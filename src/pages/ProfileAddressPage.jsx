import React, { useState, useEffect, useCallback } from "react";
import { Modal, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios.js";
import "../styles/address.css";

const EMPTY_FORM = {
    name: "",
    phone: "",
    flatNo: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
};

const ProfileAddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState(EMPTY_FORM);
    const [statelist, setStateList] = useState([]);
    const [citylist, setCityList] = useState([]);
    const [errors, setErrors] = useState({});
    const [serviceability, setServiceability] = useState(null);
    const [checkingService, setCheckingService] = useState(false);

    /* ===================== INIT ===================== */
    useEffect(() => {
        fetchAddresses();
        fetchStates();
    }, []);

    /* ===================== API ===================== */
    const fetchAddresses = async () => {
        try {
            const { data } = await API.get("/api/users/addresses");
            setAddresses(data.addresses || []);
        } catch {
            toast.error("Failed to load addresses");
        }
    };

    const fetchStates = async () => {
        try {
            const { data } = await API.get("/api/commonmaster/getActivestates");
            setStateList(data.data || []);
        } catch {
            toast.error("Failed to load states");
        }
    };

    const fetchCities = async (stateId, prefillCity) => {
        if (!stateId) return setCityList([]);
        try {
            const { data } = await API.get("/api/commonmaster/getActiveCities", {
                params: { state: stateId },
            });
            setCityList(data.data || []);
            if (prefillCity) {
                setForm((p) => ({ ...p, city: prefillCity }));
            }
        } catch {
            toast.error("Failed to load cities");
        }
    };

    /* ===================== HANDLERS ===================== */
    const openAddModal = () => {
        resetForm();
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (addr) => {
        setForm(addr);
        setEditingId(addr._id);
        setShowForm(true);

        const stateObj = statelist.find((s) => s.name === addr.state);
        if (stateObj) {
            fetchCities(stateObj._id, addr.city).then(() => {
                if (addr.pincode) checkServiceability(addr.pincode);
            });
        } else if (addr.pincode) {
            checkServiceability(addr.pincode);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            await API.delete(`/api/users/address/${id}`);
            toast.success("Address deleted");
            fetchAddresses();
        } catch {
            toast.error("Failed to delete address");
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await API.patch(`/api/users/set/address/${id}`);
            toast.success("Default address updated");
            fetchAddresses();
        } catch {
            toast.error("Failed to set default address");
        }
    };

    const handleStateChange = (e) => {
        const stateName = e.target.value;
        const stateObj = statelist.find((s) => s.name === stateName);

        setForm((p) => ({ ...p, state: stateName, city: "" }));
        fetchCities(stateObj?._id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));

        if (name === "pincode") {
            if (value.length === 6) checkServiceability(value);
            else setServiceability(null);
        }
    };

    const allowOnlyNumbers = (v) => v.replace(/\D/g, "");

    /* ===================== SERVICEABILITY ===================== */
    const checkServiceability = useCallback(async (pincode) => {
        if (!pincode || pincode.length !== 6 || !form.state || !form.city) {
            setServiceability(null);
            return false;
        }

        try {
            setCheckingService(true);
            const stateObj = statelist.find((s) => s.name === form.state);
            const cityObj = citylist.find((c) => c.name === form.city);
            const { data } = await API.get(`/api/serviceablearea/check/${pincode}`, {
                params: {
                    pincode,
                    stateId: stateObj?._id,
                    cityId: cityObj?._id,
                },
            });
            setServiceability({ serviceable: data.serviceable });
            if (!data.serviceable) toast.error("❌ Not serviceable in this area");
            return data.serviceable;
        } catch {
            toast.error("Failed to check serviceability");
            setServiceability({ serviceable: false });
            return false;
        } finally {
            setCheckingService(false);
        }
    }, [form.state, form.city, statelist, citylist]);

    /* ===================== FORM VALIDATION ===================== */
    const validateForm = () => {
        const newErrors = {};
        const { name, phone, flatNo, street, city, pincode, state } = form;

        if (!name.trim()) newErrors.name = "Recipient name is required";
        if (!phone.trim()) newErrors.phone = "Mobile number is required";
        else if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = "Enter a valid 10-digit mobile number";
        if (!flatNo.trim()) newErrors.flatNo = "House / Flat number is required";
        if (!street.trim()) newErrors.street = "Street / Area is required";
        if (!state.trim()) newErrors.state = "Please select a state";
        if (!city.trim()) newErrors.city = "Please select a city";
        if (!pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^[0-9]{6}$/.test(pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
        if (!serviceability?.serviceable) newErrors.pincode = "This pincode is not serviceable";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            if (editingId) {
                await API.patch(`/api/users/address/${editingId}`, form);
                toast.success("Address updated");
            } else {
                await API.post("/api/users/address", form);
                toast.success("Address added");
            }
            setShowForm(false);
            resetForm();
            fetchAddresses();
        } catch {
            toast.error("Failed to save address");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setEditingId(null);
        setCityList([]);
        setServiceability(null);
    };

    /* ===================== UI ===================== */
    return (
        <>
            <button className="add-patie mb-3" onClick={openAddModal}>
                + Add New Address
            </button>

            <div className="address-list">
                {addresses.map((addr) => (
                    <div key={addr._id} className="address-card">
                        <div className="address-info">
                            <strong>{addr.name}</strong>
                            <p>{addr.flatNo}, {addr.street}, {addr.city} ({addr.pincode}), {addr.state}</p>
                            <p>{addr.phone}</p>
                        </div>
                        <div className="address-actions">
                            <button className="pat-edit" onClick={() => handleEdit(addr)}>Edit</button>
                            <button className="pat-delete" onClick={() => handleDelete(addr._id)}>Remove</button>
                            {!addr.isDefault && (
                                <button className="defaultbutton ms-3" onClick={() => handleSetDefault(addr._id)}>Set as Default</button>
                            )}
                            {addr.isDefault && <span className="default-label ms-3">Default</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            <Modal show={showForm} onHide={() => { setShowForm(false); resetForm(); }} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? "Edit Address" : "Add Address"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form className="patient-selection" onSubmit={handleSubmit}>
                        <Row>
                            {/* NAME */}
                            <Col lg={6} className="mb-3">
                                <label>Name <span className="danger">*</span></label>
                                <input
                                    name="name"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    value={form.name}
                                    placeholder="Name"
                                    onChange={handleChange}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </Col>

                            {/* PHONE */}
                            <Col lg={6} className="mb-3">
                                <label>Phone <span className="danger">*</span></label>
                                <input
                                    name="phone"
                                    maxLength={10}
                                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                    value={allowOnlyNumbers(form.phone)}
                                    placeholder="Phone"
                                    onChange={handleChange}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </Col>

                            {/* FLAT */}
                            <Col lg={6} className="mb-3">
                                <label>House / Flat <span className="danger">*</span></label>
                                <input
                                    name="flatNo"
                                    className={`form-control ${errors.flatNo ? "is-invalid" : ""}`}
                                    value={form.flatNo}
                                    placeholder="House/Flat No."
                                    onChange={handleChange}
                                />
                                {errors.flatNo && <div className="invalid-feedback">{errors.flatNo}</div>}
                            </Col>

                            {/* STREET */}
                            <Col lg={6} className="mb-3">
                                <label>Street <span className="danger">*</span></label>
                                <input
                                    name="street"
                                    className={`form-control ${errors.street ? "is-invalid" : ""}`}
                                    value={form.street}
                                    placeholder="Area/Street"
                                    onChange={handleChange}
                                />
                                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                            </Col>

                            {/* STATE */}
                            <Col lg={6} className="mb-3">
                                <label>State <span className="danger">*</span></label>
                                <select
                                    className={`form-control ${errors.state ? "is-invalid" : ""}`}
                                    value={form.state}
                                    onChange={handleStateChange}
                                >
                                    <option value="" hidden>Select State</option>
                                    {statelist.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                                </select>
                                {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                            </Col>

                            {/* CITY */}
                            <Col lg={6} className="mb-3">
                                <label>City <span className="danger">*</span></label>
                                <select
                                    name="city"
                                    className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                    value={form.city}
                                    onChange={handleChange}
                                >
                                    <option value="" hidden>Select City</option>
                                    {citylist.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                                </select>
                                {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                            </Col>

                            {/* PINCODE */}
                            <Col lg={6} className="mb-3">
                                <label>Pincode <span className="danger">*</span></label>
                                <input
                                    name="pincode"
                                    className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                                    value={form.pincode}
                                    placeholder="Pincode"
                                    onChange={handleChange}
                                />
                                {form.pincode && serviceability && (
                                    <small className={serviceability.serviceable ? "text-success" : "text-danger"}>
                                        {serviceability.serviceable
                                            ? "✅ Service available in this area"
                                            : "❌ Not serviceable"}
                                    </small>
                                )}
                                {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                            </Col>
                        </Row>

                        <button
                            className="button-add-update"
                            type="submit"
                            disabled={loading || checkingService || !serviceability?.serviceable}
                        >
                            {editingId ? "Update Address" : "Add Address"}
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProfileAddressPage;
