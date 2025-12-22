import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Spinner, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext.jsx";
import "../styles/address.css";
import API from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

import nopatient from "../assets/noadress.gif"

const LabtestAddressPage = () => {
  const navigate = useNavigate();
  const { selectedAddress, setSelectedAddress } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    flatNo: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [editing, setEditing] = useState(null);
  const [isediting, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [statelist, setStateList] = useState([]);
  const [citylist, setCityList] = useState([]);

  useEffect(() => {
    fetchAddresses();
    fetchStates();
  }, []);
  const fetchAddresses = async () => {
    try {
      const res = await API.get("/api/users/addresses");
      const fetchedAddresses = res.data.addresses || [];
      setAddresses(fetchedAddresses);
      // Only auto-select default if nothing is already selected
      if (!selectedAddress) {
        const defaultAddr = fetchedAddresses.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await API.get("/api/commonmaster/getActivestates");
      setStateList(res.data.data);
    } catch {
      toast.error("Failed to fetch states");
    }
  };

  // Fetch cities by state
  // const fetchCities = async (stateId) => {
  //   if (!stateId) return;
  //   try {
  //     const res = await API.get("/api/commonmaster/getActiveCities", {
  //       params: { state: stateId }
  //     });
  //     setCityList(res.data.data || []);
  //   } catch {
  //     toast.error("Failed to load cities");
  //   }
  // };

  // 🟢 Fetch Cities by State ID
  const fetchCities = async (stateId, prefillCity = null) => {
    if (!stateId) return setCityList([]);
    try {
      const res = await API.get("/api/commonmaster/getActiveCities", {
        params: { state: stateId },
      });
      setCityList(res.data.data || []);
      if (prefillCity) {
        setForm((prev) => ({ ...prev, city: prefillCity }));
      }
    } catch {
      toast.error("Failed to load cities");
    }
  };


  const handleSelect = (addr) => setSelectedAddress(addr);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await API.delete(`/api/users/address/${id}`);
      toast.success("Address removed");
      fetchAddresses();
      if (selectedAddress?._id === id) setSelectedAddress(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };
  const handleEdit = (addr) => {
    console.log("addr", addr)
    setForm(addr);
    setEditing(addr._id);
    setIsEditing(true)
    setShowForm(true);

    // ✅ Load the cities for the selected state
    const selectedState = statelist.find((s) => s.name === addr.state);
    if (selectedState) {
      // prefill the dropdown and set city
      fetchCities(selectedState._id, addr.city);
    }

  };

  // 🟢 Handle State Change
  const handleStateChange = (e) => {
    const selectedStateName = e.target.value;
    const selectedState = statelist.find((s) => s.name === selectedStateName);

    setForm((prev) => ({
      ...prev,
      state: selectedStateName,
      city: "", // reset city whenever state changes
    }));

    if (selectedState) fetchCities(selectedState._id);
    else setCityList([]); // clear city if no valid state
  };


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // 🛡️ Field Validations
      const { name, phone, flatNo, street, city, pincode, state } = form;
    
      if (!name.trim()) return toast.error("Please enter recipient's name.");
      if (!phone.trim() || !/^[0-9]{10}$/.test(phone))
        return toast.error("Please enter a valid 10-digit mobile number.");
      if (!flatNo.trim()) return toast.error("Please enter your house/flat number.");
      if (!street.trim()) return toast.error("Please enter your area/street name.");
      if (!state.trim()) return toast.error("Please select your state.");
      if (!city.trim()) return toast.error("Please select your city.");
      if (!pincode.trim() || !/^[0-9]{6}$/.test(pincode))
        return toast.error("Please enter a valid 6-digit pincode.");
    
      try {
        setLoading(true);
    
        if (editing) {
          await API.patch(`/api/users/address/${editing}`, form);
          toast.success("Address updated successfully!");
        } else {
          await API.post("/api/users/address", form);
          toast.success("Address added successfully!");
        }
    
        // Reset after submit
        setForm({
          name: "",
          phone: "",
          flatNo: "",
          street: "",
          city: "",
          pincode: "",
          state: "",
        });
        setEditing(null);
        setIsEditing(false);
        setShowForm(false);
        fetchAddresses();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save address, please try again.");
      } finally {
        setLoading(false);
      }
    };
    
  const handleSetDefault = async (id) => {
    try {
      const res = await API.patch(`/api/users/set/address/${id}`);
      toast.success("Default address updated");
      fetchAddresses();
      setSelectedAddress(res.data.address); // auto select default
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };
  const handleAddmodal = () => {
    setForm({
      name: "",
      phone:  "",
      flatNo: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
    });
    setIsEditing(false)
    setShowForm(true)
  }
  console.log(isediting)
  if (loading) {
    return (
      <div className="fullpage-loader">
        <div className="spinner"></div>
      </div>
    );
  }


  const allowOnlyNumbers = (value) => {
    return value?.replace(/\D/g, "") || "";
  };
  console.log(isediting)
  return (
    <>
      <div className="container my-4">
        <button className="add-patie" onClick={() => handleAddmodal()}>
          + Add new address
        </button>
        {addresses.length === 0 ? (
          <div className="no-patient-records">
            <div className="no-patient-records">
              <img src={nopatient} alt="No addresses found" />
              <h3>No Address Found</h3>
            </div>
          </div>
        ) : (
          <div className="selection-abcd" style={{ background: '#F9F0ED' }}>
            <div className="select-medical-category">
              <h3>Select Address</h3>
            </div>
            {/* Address List */}
            <div className="address-list">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`address-card ${selectedAddress?._id === addr._id ? "selected" : ""}`}
                >
                  <label className="address-label">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => handleSelect(addr)}
                    />
                    <div className="address-info">
                      <p><strong>{addr.name}</strong></p>
                      <p>
                        {addr.flatNo}, {addr.street}, {addr.city} ({addr.pincode}), {addr.state}
                      </p>
                      <p>{addr.phone}</p>
                    </div>
                  </label>
                  <div className="address-actions">
                    <button className="editbutton" onClick={() => handleEdit(addr)}>
                      <i className="fa fa-edit" /> Edit
                    </button>
                    <button className="removebutton" onClick={() => handleDelete(addr._id)}>
                      <i className="fa fa-trash" /> Remove
                    </button>
                    {!addr.isDefault && (
                      <button className="defaultbutton" onClick={() => handleSetDefault(addr._id)}>
                        Set as Default
                      </button>
                    )}
                    {addr.isDefault && <span className="default-label">Default</span>}
                  </div>
                </div>
              ))}

              <div className="action-buttons mt-5">
                <button className="go-backs" onClick={() => navigate('/cart')}>
                  <i className="fa fa-chevron-left"></i> Back
                </button>
                <button
                  className="continue-abcd"
                  disabled={!selectedAddress}
                  onClick={() => navigate("/lab/slot")}
                >
                  Continue <i className="fa fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Address Modal */}
        <Modal size="lg" show={showForm} onHide={() => { setShowForm(false), setIsEditing(false) }} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isediting ? "Edit Address" : "Add Address"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="patient-selection" onSubmit={handleSubmit}>
              <Row>
                <Col lg={6}>
                  <label htmlFor="Full Name">Recipient's Full Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Mobile Number</label>
                  <input
                    name="phone"
                    value={allowOnlyNumbers(form.phone)}
                    maxLength={10}
                    className="form-control"
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">House/Flat No</label>
                  <input
                    name="flatNo"
                    className="form-control"
                    value={form.flatNo}
                    onChange={handleChange}
                    placeholder="House/Flat No."
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Area/Street</label>
                  <input
                    name="street"
                    className="form-control"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Area/Street"
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">State</label>
                  <select
                    name="state"
                    className="form-control"
                    value={form.state}
                    onChange={handleStateChange}
                    required
                  >
                    <option value="">Select State</option>
                    {statelist.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">City</label>
                  <select
                    className="form-control"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    {citylist.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Pincode</label>
                  <input
                    name="pincode"
                    className="form-control"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                  />
                </Col>

              </Row>
              <button className="button-add-update" type="submit">{isediting ? "Update Address" : "Add Address"}</button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default LabtestAddressPage;