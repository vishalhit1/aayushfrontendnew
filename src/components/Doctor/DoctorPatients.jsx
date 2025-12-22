import React, { useState, useEffect } from "react";
import { Table, Card, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import API, { doctorAPI } from "../../api/axios";
import { API_URL } from "../../../config";
import { formatDate } from "../../utils/formatDate";


const DoctorPatients = ({ doctorId }) => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newPrescription, setNewPrescription] = useState({
    title: "",
    notes: "",
    file: null,
  });

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  // ✅ Fetch only completed bookings for this doctor
  const fetchCompletedBookings = async () => {
    setLoading(true);
    try {
      const { data } = await doctorAPI.get(`/api/doctors/completed/${doctorId}/appointments`);
      if (data.success) {
        const completed = data.bookings.filter(
          (b) => b.status === "completed"
        );
        setCompletedBookings(completed);
      }
    } catch (err) {
      console.error("Error fetching completed bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload prescription for completed booking
  const handlePrescriptionUpload = async (e) => {
    e.preventDefault();
    if (!newPrescription.title || !newPrescription.file) {
      return alert("Please enter a title and select at least one file.");
    }

    const bookingId = selectedBooking?._id;
    if (!bookingId) return alert("No valid booking selected.");

    const formData = new FormData();
    formData.append("title", newPrescription.title);
    formData.append("notes", newPrescription.notes);

    if (newPrescription.file && newPrescription.file.length > 0) {
      Array.from(newPrescription.file).forEach((file) => {
        formData.append("file", file);
      });
    }

    setUploading(true);
    try {
      const { data } = await API.post(
        `/api/doctors/add-prescription/${bookingId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        alert("Prescription uploaded successfully!");
        setNewPrescription({ title: "", notes: "", file: null });
        fetchCompletedBookings();
      }
    } catch (err) {
      console.error("Error uploading prescription:", err);
      alert("Failed to upload prescription");
    } finally {
      setUploading(false);
    }
  };

  const renderCompletedTable = () => (
    <Card>
      <Card.Header>Completed Consultations</Card.Header>
      <Card.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : completedBookings.length ? (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Booked On</th>
                <th>slot Date</th>
                <th>Slot Time</th>
                <th>Consultation Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.patient?.name || "—"}</td>
                  <td>
                    {b?.createdAt
                      ? (() => {
                        const d = new Date(b.createdAt);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()
                      : "-"}
                  </td>

                  <td>{formatDate(b.slot.date)}</td>
                  <td>{b.slot.startTime || "-"}</td>
                  <td>{b.consultationType || "—"}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedBooking(b)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No completed consultations found.</p>
        )}
      </Card.Body>
    </Card>
  );

  const renderBookingDetails = () => (
    <Card className="shadow-sm border-0">
      <Card.Header className="d-flex justify-content-between align-items-center bg-light border-bottom">
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setSelectedBooking(null)}
          >
            ← Back
          </Button>
          <span className="ms-2 fw-bold">Consultation Details</span>
        </div>
      </Card.Header>

      <Card.Body className="px-4">
        {/* Patient Information */}
        <h5 className="fw-bold text-primary mb-3">Patient Information</h5>
        <Row className="mb-3">
          <Col md={6}>
            <p><b>Name:</b> {selectedBooking.patient?.name || "—"}</p>
            <p><b>Phone:</b> {selectedBooking.user?.phone || "—"}</p>
            <p><b>Email:</b> {selectedBooking.user?.email || "—"}</p>
          </Col>
          <Col md={6}>
            <p><b>Date:</b> {formatDate(selectedBooking.slot?.date) || "—"}</p>
            <p><b>Time:</b> {selectedBooking.slot?.startTime || "—"}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                className={`badge ${selectedBooking.status === "completed"
                    ? "bg-success"
                    : selectedBooking.status === "rescheduled"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
              >
                {selectedBooking.status}
              </span>
            </p>
          </Col>
        </Row>

        {/* Consultation Info */}
        <div className="border-top pt-3">
          <h6 className="fw-bold text-primary">Consultation Information</h6>
          <p><b>Type:</b> {selectedBooking.consultationType || "—"}</p>
          <p><b>Medical History:</b> {selectedBooking.medical_history || "—"}</p>
          <p><b>Allergies:</b> {selectedBooking.patient?.medical_history || "—"}</p>

          {/* ✅ Existing Prescription - Handle PDF or Image */}
          <div className="mt-4">
            <h6 className="fw-bold mb-2">Existing Prescription</h6>
            {selectedBooking.patient?.prescription?.length > 0 ? (
              <div className="d-flex flex-wrap gap-3">
                {selectedBooking.patient.prescription.map((fileUrl, idx) => (
                  <div
                    key={idx}
                    className="border rounded p-2 text-center"
                    style={{
                      width: "140px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      backgroundColor: "#fff",
                    }}
                  >
                    {fileUrl.endsWith(".pdf") ? (
                      <iframe
                        src={`${API_URL}${fileUrl}`}
                        width="100%"
                        height="120"
                        title={`ExistingPrescription-${idx}`}
                        className="rounded border mb-2"
                        style={{ backgroundColor: "#f9f9f9" }}
                      ></iframe>
                    ) : (
                      <img
                        src={`${API_URL}${fileUrl}`}
                        alt={`Prescription-${idx}`}
                        className="img-fluid rounded border mb-2"
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <a
                      href={`${API_URL}${fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary w-100"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No existing prescription uploaded.</p>
            )}
          </div>

        </div>



        {/* Prescriptions */}
        <div className="border-top pt-4">
          <h5 className="fw-bold text-primary mb-3">Prescriptions</h5>
          {selectedBooking.prescriptions?.length ? (
            selectedBooking.prescriptions.map((p, i) => (
              <Card key={i} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{p.title}</strong>
                    <small className="text-muted">
                      {new Date(p.date).toLocaleDateString("en-GB") || ""}
                    </small>
                  </div>
                  {p.notes && <p className="mt-2 mb-2 text-muted">{p.notes}</p>}
                  {p.file && (
                    <div className="mt-2 d-flex flex-wrap gap-3">
                      {Array.isArray(p.file) &&
                        p.file.map((fileUrl, idx) => (
                          <div key={idx} className="text-center">
                            {fileUrl.endsWith(".pdf") ? (
                              <iframe
                                src={`${API_URL}${fileUrl}`}
                                width="120"
                                height="100"
                                title={`Prescription-${i}-${idx}`}
                                className="rounded border"
                              ></iframe>
                            ) : (
                              <img
                                src={`${API_URL}${fileUrl}`}
                                alt={p.title}
                                className="rounded border"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <div className="mt-2">
                              <a
                                href={`${API_URL}${fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted">No prescriptions uploaded yet.</p>
          )}
        </div>

        {/* Upload New Prescription */}
        <div className="border-top pt-4 mt-3">
          <h6 className="fw-bold text-primary mb-3">Add New Prescription</h6>
          <Form onSubmit={handlePrescriptionUpload}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    placeholder="Prescription title"
                    value={newPrescription.title}
                    onChange={(e) =>
                      setNewPrescription({ ...newPrescription, title: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Add notes or instructions"
                    value={newPrescription.notes}
                    onChange={(e) =>
                      setNewPrescription({ ...newPrescription, notes: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Upload Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) =>
                  setNewPrescription({ ...newPrescription, file: e.target.files })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Prescription"}
            </Button>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );



  return (
    <div>
      {selectedBooking ? renderBookingDetails() : renderCompletedTable()}
    </div>
  );
};

export default DoctorPatients;
