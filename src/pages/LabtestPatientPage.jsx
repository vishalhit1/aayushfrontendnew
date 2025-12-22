import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Row, Col } from "react-bootstrap";
import API from "../api/axios.js";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext.jsx";
// import "../styles/patient.css";
import { API_URL } from "../../config.js";
const LabtestPatientPage = () => {
  const navigate = useNavigate();
  const { selectedPatient, setSelectedPatient } = useContext(CartContext);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    relation: "",
    medical_history: "",
    allergies: "",
    prescription: []
  });
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    fetchPatients();
  }, []);
  const fetchPatients = async () => {
    try {
      const res = await API.get("/api/users/patients");
      const fetched = res.data.patients || [];
      setPatients(fetched);
      // Set first patient as default if none selected
      if (!selectedPatient && fetched.length > 0) setSelectedPatient(fetched[0]);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  // Handle file add
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      prescription: [...prev.prescription, ...files],
    }));
  };
  // Remove a file by index
  const removeFile = (index) => {
    setForm((prev) => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.phone) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const formData = new FormData();
      for (let key in form) {
        if (key !== "prescription") formData.append(key, form[key]);
      }
      form.prescription.forEach((file) => {
        if (file instanceof File) {
          formData.append("prescription", file);
        }
      });
      if (editingId) {
        await API.patch(`/api/users/patient/${editingId}`, form);
        toast.success("Patient updated successfully!");
      } else {
        await API.post("/api/users/patient", form);
        toast.success("Patient added successfully!");
      }
      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        relation: "",
        medical_history: "",
        allergies: "",
        prescription: []
      });
      setEditingId(null);
      setShowModal(false);
      fetchPatients();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save patient");
    }
  };
  const handleEdit = (patient) => {
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      relation: patient.relation || "",
      medical_history: patient.medical_history || "",
      allergies: patient.allergies || "",
      prescription: patient.prescription || [],
    });
    setEditingId(patient._id);
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await API.delete(`/api/users/patient/${id}`);
      toast.success("Patient deleted successfully!");
      const updatedPatients = patients.filter((p) => p._id !== id);
      setPatients(updatedPatients);
      if (selectedPatient?._id === id) setSelectedPatient(updatedPatients[0] || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete patient");
    }
  };
  const handleSelect = (patient) => setSelectedPatient(patient);
  const handleAddPatientmodal = () => {
    setForm({
      name: "",
      age: "",
      gender: "",
      phone: "",
      relation: "",
      medical_history: "",
      allergies: "",
      prescription: []
    })
    setEditingId(null)
    setShowModal(true)
  }

  const selfExists = patients.some(
    (p) => p.relation === "Self" && p._id !== editingId
  );
  

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Lab Test
                  </li>
                  <li className="breadcrumb-item active">Select Patient</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-4">
        {/* Add New Patient */}
        <button className="add-patie" onClick={handleAddPatientmodal}>
          <i className="fa fa-plus"></i> Add New Patient
        </button>
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Select Patient</h3>
          </div>
          {/* Patients List */}
          <div className="patient-list">
            <div className="row">
              {patients.length === 0 && <p>No patients added yet.</p>}
              {patients.map((p) => (
                <div className="col-lg-4" key={p._id}>
                  <div
                    className={`patient-card ${selectedPatient?._id === p._id ? "selected" : ""}`}
                    onClick={() => handleSelect(p)}
                  >
                    <div className="patient-info">
                      <h4>{p.name}</h4>
                      <p><b>Age:</b> {p.age}</p>
                      <p><b>Gender:</b> {p.gender}</p>
                      <p><b>Contact:</b> {p.phone}</p>
                      <p><b>Relation:</b> {p.relation}</p>
                    </div>
                    <div className="patient-actions">
                      <button className="pat-edit" onClick={() => handleEdit(p)}><i className="fa fa-edit"></i> Edit</button>
                      <button className="pat-delete" onClick={() => handleDelete(p._id)}><i className="fa fa-trash"></i> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="action-buttons mt-5">
            <button className="go-backs" onClick={() => navigate(-1)}>
              <i className="fa fa-chevron-left"></i> Go Back
            </button>
            <button className="continue-abcd" disabled={!selectedPatient}
              onClick={() => navigate("/cart")}>
              Continue <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
        {/* Add/Edit Modal */}
        <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Edit Patient" : "Add Patient"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="patient-selection" onSubmit={handleSubmit}>
              <Row>
                <Col lg={6}>
                  <label htmlFor="Full Name">Full Name</label>
                  <input
                    className="form-control"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Age</label>
                  <input
                    className="form-control"
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Select Gender</label>
                  <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
                    <option value="" hidden>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Mobile Number</label>
                  <input
                    className="form-control"
                    name="phone"
                    placeholder="Contact Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Relationship With Patient</label>
                  <select className="form-select" name="relation" value={form.relation} onChange={handleChange}>
                  <option hidden>Select Relation</option>
                    <option value="Self" disabled={selfExists}>Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Other">Other</option>
                  </select>
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Medical History</label>
                  <textarea
                    className="form-control"
                    name="medical_history"
                    placeholder="Medical History"
                    value={form.medical_history}
                    onChange={handleChange}
                    rows={3}
                  />
                </Col>
                <Col lg={6}>
                  <label htmlFor="Full Name">Allergies</label>
                  <textarea
                    className="form-control"
                    name="allergies"
                    placeholder="Allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    rows={2}
                  />
                </Col>
                <Col lg={6}>
                  <label>Prescription (Images/PDFs)</label>
                  <input
                    className="form-control"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e)}
                  />
                  <div className="preview-container mt-2" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {form.prescription?.map((file, index) => {
                      const isString = typeof file === "string";
                      const fileUrl = isString
                        ? file.startsWith("http") ? file : `${API_URL}${file}`
                        : URL.createObjectURL(file);
                      const isPdf = (isString && file.endsWith(".pdf")) || (!isString && file.type === "application/pdf");
                      return (
                        <div
                          key={index}
                          className="preview-item"
                          style={{
                            position: "relative",
                            width: "100px",
                            minHeight: "100px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            padding: "5px",
                            backgroundColor: "#fff",
                            textAlign: "center",
                            cursor: "pointer"
                          }}
                        >
                          {isPdf ? (
                            <>
                              <a href={fileUrl} target="blank">
                                <div style={{
                                  fontSize: "28px",
                                  color: "#e74c3c",
                                }}>
                                  <i className="bi bi-file-earmark-pdf"></i>
                                </div>
                                <div style={{
                                  fontSize: "12px",
                                  marginTop: "5px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "90%",
                                }}>
                                  {/* {isString ? file.split("/").pop() : file.name} */}
                                  Click to preview
                                </div>
                              </a>
                            </>
                          ) : (
                            <a href={fileUrl} target="blank">
                              <img
                                src={fileUrl}
                                alt="preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                              />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            style={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              padding: "2px 6px",
                              fontSize: "12px",
                              borderRadius: "50%",
                              border: "none",
                              background: "#e74c3c",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
              <button type="submit" className="button-add-update">
                {editingId ? "Update Patient" : "Add Patient"}
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default LabtestPatientPage;