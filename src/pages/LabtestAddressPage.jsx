import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/address.css";
import API from "../api/axios.js";
import nopatient from "../assets/noadress.gif";

const LabtestAddressPage = () => {
  const navigate = useNavigate();
  const { selectedAddress, setSelectedAddress } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Form states
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
  const [initialloading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dropdown states
  const [statelist, setStateList] = useState([]);
  const [citylist, setCityList] = useState([]);

  // Serviceability states
  const [serviceability, setServiceability] = useState(null);
  const [checkingService, setCheckingService] = useState(false);

  // Memoized serviceability checker
  const checkServiceability = useCallback(async (pincode, stateId, cityId) => {
    if (!pincode || pincode.length !== 6 || !stateId || !cityId) {
      setServiceability(null);
      return false;
    }

    try {
      setCheckingService(true);
      // ✅ Fixed: Use GET with params (matches your backend)
      const res = await API.get(`/api/serviceablearea/check/${pincode}`, {
        params: {
          pincode,  // ✅ Send as query param
          stateId,
          cityId
        }
      });

      const isServiceable = res.data.serviceable;
      setServiceability({ serviceable: isServiceable });
      return isServiceable;
    } catch (err) {
      console.error("Serviceability check failed:", err);
      setServiceability({ serviceable: false });
      return false;
    } finally {
      setCheckingService(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchAddresses();
    fetchStates();
  }, []);

  // ✅ FIXED: Wait for states before auto-checking form
  useEffect(() => {
    if (statelist.length === 0) return;

    const stateObj = statelist.find((s) => s.name === form.state);
    const cityObj = citylist.find((c) => c.name === form.city);

    if (form.pincode.length === 6 && stateObj?._id && cityObj?._id) {
      checkServiceability(form.pincode, stateObj._id, cityObj._id);
    } else {
      setServiceability(null);
    }
  }, [form.pincode, form.state, form.city, statelist, citylist, checkServiceability]);

  // ✅ CRITICAL FIX: Load cities when states load OR address selected
  useEffect(() => {
    if (statelist.length > 0 && addresses.length > 0) {
      // Load cities for the first address's state
      const firstAddrState = addresses[0]?.state;
      const stateObj = statelist.find(s => s.name === firstAddrState);
      if (stateObj?._id) {
        fetchCities(stateObj._id);
      }
    }
  }, [statelist, addresses]);

  const toastShown = useRef(false);
  useEffect(() => {
    if (
      serviceability !== null &&
      serviceability?.serviceable === false &&
      !toastShown.current
    ) {
      toast.error("Service is not available for this address");
      toastShown.current = true;
    }
  
    if (serviceability?.serviceable) {
      toastShown.current = false; // reset when serviceable
    }
  }, [serviceability]);

  useEffect(() => {
    // Reset serviceability when selectedAddress changes
    setServiceability(null);
    setCheckingService(false);
  
    if (selectedAddress) {
      checkServiceability(selectedAddress.pincode);
    }
  }, [selectedAddress]);
  

  const fetchAddresses = async () => {
    try {
      setInitialLoading(true)
      const res = await API.get("/api/users/addresses");
      const fetchedAddresses = res.data.addresses || [];
      setAddresses(fetchedAddresses);

      // Auto-select default AFTER states load
      if (!selectedAddress && fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find((a) => a.isDefault);
        if (defaultAddr && statelist.length > 0) {
          handleSelect(defaultAddr);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    } finally {
      setInitialLoading(false)
    }
  };

  const fetchStates = async () => {
    try {
      const res = await API.get("/api/commonmaster/getActivestates");
      setStateList(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch states");
    }
  };

  const fetchCities = async (stateId, prefillCity = null) => {
    if (!stateId) {
      setCityList([]);
      return;
    }

    try {
      const res = await API.get("/api/commonmaster/getActiveCities", {
        params: { state: stateId },
      });
      setCityList(res.data.data || []);

      if (prefillCity) {
        setForm(prev => ({ ...prev, city: prefillCity }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cities");
      setCityList([]);
    }
  };

  // ✅ FIXED: Load cities BEFORE checking serviceability
  const handleSelect = async (addr) => {
    console.log('🔍 Selecting address:', addr);
    setSelectedAddress(addr);
  
    const stateObj = statelist.find((s) => s.name === addr.state);
    
    if (!stateObj?._id) {
      console.log('❌ No state found for:', addr.state);
      setServiceability(null);
      return;
    }
  
    console.log('🔍 Loading cities for state:', stateObj.name);
    
    // ✅ ALWAYS load cities fresh
    await fetchCities(stateObj._id, addr.city);
    
    // ✅ Wait for citylist to update (give React time to re-render)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cityObj = citylist.find((c) => c.name === addr.city);
    console.log('🔍 citylist after load:', citylist.length, 'cityObj:', cityObj);
  
    if (!cityObj?._id) {
      console.log('❌ No cityId found for:', addr.city);
      // toast.warning("City not found. Please edit address.");
      setServiceability(null);
      return;
    }
  
    if (addr.pincode?.length === 6) {
      console.log('🔍 Checking serviceability...');
      const result = await checkServiceability(addr.pincode, stateObj._id, cityObj._id);
      console.log('✅ Service result:', result);
    } else {
      setServiceability(null);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await API.delete(`/api/users/address/${id}`);
      toast.success("Address deleted");
      fetchAddresses();

      if (selectedAddress?._id === id) {
        setSelectedAddress(null);
        setServiceability(null);
      }
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditing(addr._id);
    setShowForm(true);

    const selectedState = statelist.find((s) => s.name === addr.state);
    if (selectedState?._id) {
      fetchCities(selectedState._id, addr.city);
    }
  };

  const handleStateChange = (e) => {
    const selectedStateName = e.target.value;
    const selectedState = statelist.find((s) => s.name === selectedStateName);

    setForm((prev) => ({
      ...prev,
      state: selectedStateName,
      city: "",
      pincode: "",
    }));
    setServiceability(null);

    if (selectedState?._id) {
      fetchCities(selectedState._id);
    } else {
      setCityList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setForm((prev) => ({ ...prev, city: value, pincode: "" }));
      setServiceability(null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, flatNo, street, city, pincode, state } = form;

    if (!name.trim() || !/^\d{10}$/.test(phone) || !flatNo.trim() || !street.trim() ||
      !state || !city || pincode.length !== 6) {
      return toast.error("Fill all required fields");
    }

    if (serviceability !== null && !serviceability.serviceable) {
      return toast.error("Service not available in this area");
    }

    try {
      setLoading(true);

      let savedAddress;
      if (editing) {
        const res = await API.patch(`/api/users/address/${editing}`, form);
        savedAddress = res.data.address;
        toast.success("Address updated!");
      } else {
        const res = await API.post("/api/users/address", form);
        savedAddress = res.data.address;
        toast.success("Address saved!");
      }

      setSelectedAddress(savedAddress);
      setEditing(null);
      setShowForm(false);
      setForm({ name: "", phone: "", flatNo: "", street: "", city: "", pincode: "", state: "" });
      fetchAddresses();

    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await API.patch(`/api/users/set-address/${id}`);
      toast.success("Default address set");
      fetchAddresses();
      if (res.data.address) handleSelect(res.data.address);
    } catch (err) {
      toast.error("Failed to set default");
    }
  };

  const handleAddModal = () => {
    setForm({ name: "", phone: "", flatNo: "", street: "", city: "", pincode: "", state: "" });
    setEditing(null);
    setShowForm(true);
  };

  if (loading) {
    return <div className="fullpage-loader"><div className="spinner"></div></div>;
  }

  if (initialloading) {
    return <div className="fullpage-loader"><div className="spinner"></div></div>;
  }

  return (
    <div className="container my-4">
      <button className="add-patie" onClick={handleAddModal}>+ Add new address</button>

      {addresses.length === 0 ? (
        <div className="no-patient-records">
          <img src={nopatient} alt="No addresses" />
          <h3>No Address Found</h3>
        </div>
      ) : (
        <div className="selection-abcd" style={{ background: '#F9F0ED' }}>
          <div className="select-medical-category">
            <h3>Select Address</h3>
          </div>

          <div className="address-list">
            {addresses.map((addr) => (
              <div key={addr._id} className={`address-card ${selectedAddress?._id === addr._id ? "selected" : ""}`}>
                <label className="address-label">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => handleSelect(addr)}
                  />
                  <div className="address-info">
                    <p><strong>{addr.name}</strong></p>
                    <p>{addr.flatNo}, {addr.street}, {addr.city} ({addr.pincode}), {addr.state}</p>
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

                  {selectedAddress?._id === addr._id && (
                    <div className={serviceability?.serviceable ? "service-indicator mt-2 p-2 rounded bg-light" : ""}>
                      {checkingService ? (
                        <small>🔄 Checking service...</small>
                      ) : serviceability?.serviceable ? (
                        <small className="text-success fw-bold">✅ Service Available</small>
                      ) : serviceability !== null ? (
                        <small className="text-danger fw-bold">❌ Not Serviceable</small>
                     
                      ) : (
                        null
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="action-buttons mt-5">
              <button className="go-backs" onClick={() => navigate('/cart')}>
                <i className="fa fa-chevron-left"></i> Back
              </button>
              <button
                className="continue-abcd"
                disabled={!selectedAddress || checkingService || (serviceability !== null && !serviceability.serviceable)}
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log("🚀 Continue clicked");
                  if (!selectedAddress) return toast.error("Select an address");

                  // ✅ FIXED: RE-LOAD cities before final validation
                  const stateObj = statelist.find(s => s.name === selectedAddress.state);
                  console.log("🔍 stateObj:", stateObj);

                  if (stateObj?._id) {
                    // Ensure cities are loaded
                    if (!citylist.find(c => c.name === selectedAddress.city)) {
                      console.log("🔍 Re-loading cities...");
                      await fetchCities(stateObj._id, selectedAddress.city);
                    }
                  }

                  // ✅ Now get fresh cityObj
                  console.log("citylist",citylist.find(c => c.name))
                  console.log("selectedAddress",selectedAddress)

                  const cityObj = citylist.find(c => c.name === selectedAddress.city);
                  console.log("🔍 Final cityObj:", cityObj);

                  // if (!stateObj?._id || !cityObj?._id) {
                  //   toast.error("Address Not Matching city/state details for serviceable. Please edit address.");
                  //   return;
                  // }

                  // ✅ FINAL service check
                  const isServiceable = await checkServiceability(
                    selectedAddress.pincode,
                    stateObj._id,
                    cityObj._id
                  );

                  if (isServiceable) {
                    navigate("/lab/slot");
                  }
                }}
              >
                {checkingService ? "Checking..." : "Continue"}
                <i className="fa fa-chevron-right"></i>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Modal - unchanged */}
      <Modal size="lg" show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Address" : "Add Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="patient-selection" onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}><label>Recipient's Full Name *</label><input name="name" className="form-control" value={form.name} onChange={handleChange} required /></Col>
              <Col lg={6}><label>Mobile Number *</label><input name="phone" className="form-control" value={form.phone.replace(/\D/g, '')} maxLength={10} onChange={handleChange} required /></Col>
              <Col lg={6}><label>House/Flat No *</label><input name="flatNo" className="form-control" value={form.flatNo} onChange={handleChange} required /></Col>
              <Col lg={6}><label>Area/Street *</label><input name="street" className="form-control" value={form.street} onChange={handleChange} required /></Col>
              <Col lg={6}>
                <label>State *</label>
                <select name="state" className="form-control" value={form.state} onChange={handleStateChange} required>
                  <option value="">Select State</option>
                  {statelist.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              </Col>
              <Col lg={6}>
                <label>City *</label>
                <select name="city" className="form-control" value={form.city} onChange={handleChange} required>
                  <option value="">Select City</option>
                  {citylist.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </Col>
              <Col lg={6}>
                <label>Pincode *</label>
                <input name="pincode" className="form-control" value={form.pincode} onChange={handlePincodeChange} maxLength={6} placeholder="123456" required />
                {checkingService && <small className="text-muted">🔄 Checking...</small>}
                {serviceability?.serviceable && <small className="text-success mt-1 d-block">✅ Service Available</small>}
                {serviceability && !serviceability.serviceable && <small className="text-danger mt-1 d-block">❌ Not Serviceable</small>}
              </Col>
            </Row>
            <button type="submit" className="button-add-update mt-3" disabled={checkingService || !serviceability?.serviceable}>
              {editing ? "Update Address" : "Add Address"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LabtestAddressPage;
