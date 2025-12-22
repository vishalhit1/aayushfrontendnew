// src/pages/LabTestCart.jsx
import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { toast } from "react-toastify";
import "../styles/cart.css";
import API from "../api/axios.js";

const LabTestCart = () => {
  const { labCart, removeFromCart, setSelectedPatient, selectedPatient } = useContext(CartContext);
  const [patients, setPatients] = useState([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "" });

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/api/patients");
      setPatients(res.data.patients || []);
    } catch (err) {
      console.log(err)
      // toast.error("Failed to load patients");
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/patient", newPatient);
      toast.success("Patient added");
      setShowAddPatient(false);
      setNewPatient({ name: "", age: "", gender: "" });
      fetchPatients();
    } catch {
      toast.error("Failed to add patient");
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Remove this patient?")) return;
    try {
      await API.delete(`/api/patient/${id}`);
      toast.success("Patient removed");
      fetchPatients();
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleContinue = () => {
    if (!selectedPatient) return toast.error("Select a patient first");
    // navigate to address/checkout
  };

  return (
    <div className="cart-container container-fluid px-4 mb-5">
      <h2 className="page-title">Your Lab Tests</h2>

      {/* --- Patient Section --- */}
      <div className="patient-section">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>Patient Details</h5>
          <button className="btn btn-outline-primary btn-sm" onClick={() => setShowAddPatient(true)}>
            + Add Patient
          </button>
        </div>

        <div className="row">
          {patients.map((p) => (
            <div key={p._id} className="col-md-4 col-sm-6 mb-3">
              <div
                className={`patient-card ${selectedPatient?._id === p._id ? "selected" : ""}`}
                onClick={() => setSelectedPatient(p)}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>{p.name}</h6>
                    <small>{p.gender} • {p.age} yrs</small>
                  </div>
                  <i
                    className="fa fa-trash text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(p._id);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Add Patient Modal --- */}
      {showAddPatient && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5>Add New Patient</h5>
            <form onSubmit={handleAddPatient}>
              <input
                type="text"
                placeholder="Name"
                className="form-control mb-2"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Age"
                className="form-control mb-2"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                required
              />
              <select
                className="form-select mb-3"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-light me-2" onClick={() => setShowAddPatient(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Cart Items --- */}
      <div className="cart-items mt-4">
        {labCart.length === 0 ? (
          <p>No tests in cart</p>
        ) : (
          labCart.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="cart-info">
                <h6>{item.name}</h6>
                <small>{item.category?.name}</small>
              </div>
              <div className="cart-price">₹{item.price}</div>
              <i className="fa fa-trash remove-icon" onClick={() => removeFromCart(item._id)}></i>
            </div>
          ))
        )}
      </div>

      {/* --- Summary --- */}
      <div className="summary-card mt-4">
        <div className="d-flex justify-content-between">
          <span>Total</span>
          <strong>
            ₹{labCart.reduce((sum, i) => sum + (i.price || 0), 0)}
          </strong>
        </div>
      </div>

      <div className="text-end mt-3">
        <button
          className="btn btn-dark rounded-pill px-4"
          onClick={handleContinue}
          disabled={!selectedPatient}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LabTestCart;
