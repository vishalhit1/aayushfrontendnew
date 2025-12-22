import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { API_URL } from "../../config.js";

const MembersTab = ({
  members,
  member,
  editingId,
  showModal,
  setShowModal,
  handleAddMemberModal,
  handleEditMember,
  handleDelete,
  handlememberChange,
  handlememberFileChange,
  removeFile,
  handleMembersubmit,
}) => {
  const allowOnlyNumbers = (value) => value?.replace(/\D/g, "") || "";

  const selfExists = members.some(
    (m) => m.relation === "Self" && m._id !== editingId
  );
  

  return (
    <section>
      <div className="profilecobntent">
        <h3>Family Members</h3>
      </div>
      <button className="add-patie" onClick={handleAddMemberModal}>
        + Add New Member
      </button>

      {members.length === 0 && <p>No members added yet.</p>}

      {members.map((m) => (
        <div key={m._id} className="member-card shadow-sm p-3 mb-3" style={{ borderRadius: "10px", border: "1px solid #ddd", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#333" }}>{m.name}</h4>
            <div className="member-actions">
              <button className="pat-edit" onClick={() => handleEditMember(m)}><i className="fa fa-edit"></i> Edit</button>
              <button className="pat-delete" onClick={() => handleDelete(m._id)}><i className="fa fa-trash"></i> Delete</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <p><strong>Age:</strong> {m.age}</p>
            <p><strong>Gender:</strong> {m.gender}</p>
            <p><strong>Phone:</strong> {m.phone}</p>
            <p><strong>Relation:</strong> {m.relation}</p>
          </div>

          {m.medical_history && <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "6px" }}><strong>Medical History:</strong><p style={{ margin: "5px 0" }}>{m.medical_history}</p></div>}

          {m.allergies && <div style={{ background: "#fff4f4", padding: "10px", borderRadius: "6px" }}><strong>Allergies:</strong><p style={{ margin: "5px 0", color: "#c0392b" }}>{m.allergies}</p></div>}

          {m.prescription?.length > 0 && (
            <div>
              <strong>Prescriptions:</strong>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
                {m.prescription.map((file, index) => {
                  const isString = typeof file === "string";
                  const fileUrl = isString ? (file.startsWith("http") ? file : `${API_URL}${file}`) : URL.createObjectURL(file);
                  const isPdf = (isString && file.endsWith(".pdf")) || (!isString && file.type === "application/pdf");

                  return (
                    <div key={index} style={{ width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center", background: "#fff", position: "relative", textAlign: "center", cursor: "pointer" }}>
                      {isPdf ? (
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          <i className="bi bi-file-earmark-pdf" style={{ fontSize: "28px", color: "#e74c3c" }}></i>
                          <div style={{ fontSize: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>PDF</div>
                        </a>
                      ) : (
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          <img src={fileUrl} alt="prescription" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Member" : "Add Member"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="patient-news">
          <form className="patient-selection" onSubmit={handleMembersubmit}>
            <Row>
              <Col lg={6}>
                <label htmlFor="">Full Name</label>
                <input className="form-control" name="name" placeholder="Full Name" value={member.name} onChange={handlememberChange} required />
              </Col>
              <Col lg={6}>
                <label htmlFor="">Age</label>
                <input className="form-control" type="number" name="age" placeholder="Age" value={member.age} onChange={handlememberChange} required />
              </Col>
              <Col lg={6}>
                <label htmlFor="">Select Gender</label>
                <select className="form-select mb-3" name="gender" value={member.gender} onChange={handlememberChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Col>
              <Col lg={6}>
                <label htmlFor="">Mobile Number</label>
                <input className="form-control" name="phone" placeholder="Contact Number" value={allowOnlyNumbers(member.phone)} maxLength={10} onChange={handlememberChange} required />
              </Col>

              <Col lg={6}>
                <label htmlFor="">Relationship with Patient</label>
                <select className="form-select mb-3" name="relation" value={member.relation} onChange={handlememberChange}>
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
                <label htmlFor="">Medical History</label>
                <textarea className="form-control" name="medical_history" placeholder="Medical History" value={member.medical_history} onChange={handlememberChange} rows={3} />
              </Col>
              <Col lg={6}>
                <label htmlFor="">Allergies</label>
                <textarea className="form-control" name="allergies" placeholder="Allergies" value={member.allergies} onChange={handlememberChange} rows={2} />
              </Col>
              <Col lg={6}>
                <div className="mt-2">
                  <label>Prescription (Images/PDFs)</label>
                  <input className="form-control" type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handlememberFileChange} />
                </div>
              </Col>
            </Row>
            <button type="submit" className="button-add-update">{editingId ? "Update Member" : "Add Member"}</button>
          </form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default MembersTab;