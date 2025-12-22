import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Row, Col } from "react-bootstrap";
import RefundModal from "./RefundModal";
import "../styles/bookingDetails.css";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";
import { API_URL } from "../../config";
const statusColors = {
  pending: "#F5A623",
  confirmed: "#2D7DFF",
  completed: "#28A745",
  cancelled: "#DC3545",
};
const LabBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToLabCart } = useContext(CartContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [refundModal, setRefundModal] = useState({ open: false, amount: 0 });
  const [cancelInfo, setCancelInfo] = useState({ open: false, reason: "" });
  // :white_check_mark: Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/api/booking/lab-tests/${id}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);
  // :white_check_mark: Reorder: add all tests again
  const handleReorder = () => {
    if (!booking) return;
    booking.testsWithPatients.forEach((tp) => {
      if (tp.test) addToLabCart(tp.test);
    });
    navigate("/checkout");
  };
  // :white_check_mark: Cancel booking
  const handleCancel = async () => {
    try {
      setCancelling(true);
      const res = await API.put(`/api/booking/lab-tests/${id}/cancel`, {
        reason: cancelInfo.reason,
      });
      setBooking(res.data.booking);
      setRefundModal({ open: true, amount: res.data.refundAmount });
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    } finally {
      setCancelling(false);
      setCancelInfo({ open: false, reason: "" });
    }
  };
  if (loading)
    return (
      <div className="loading-state text-center py-5">
        <Spinner animation="lab-border" /> <p>Loading lab booking details...</p>
      </div>
    );
  if (!booking) return <p className="text-center mt-4">Booking not found!</p>;
  console.log("booking", booking)
  return (
    <>
      {/* ---------- BREADCRUMB ---------- */}
      <div className="breadcrumb-bar shadow-sm">
        <div className="container">
          <nav aria-label="breadcrumb" className="page-breadcrumb text-center">
            <ol className="breadcrumb justify-content-center mb-0 py-2">
              <li className="breadcrumb-item">
                <Link to="/"><i className="fa fa-home"></i> Home</Link>
              </li>
              <li className="breadcrumb-item active">Lab Booking Details</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* ---------- MAIN CONTENT ---------- */}
      <div className="page-container booking-details-page container my-5">
        <div className="booking-card shadow-lg rounded-4 p-4 bg-white">
          <div className="booking-header d-flex justify-content-between align-items-center mb-4 lab-border-bottom pb-2">
            <h3 className="fw-bold text-primary mb-0">Lab Booking Details</h3>
            <span
              className="status-badge px-3 py-1 rounded-pill text-white fw-semibold"
              style={{ backgroundColor: statusColors[booking.status] || "#ccc" }}
            >
              {booking.status.toUpperCase()}
            </span>
          </div>
          {/* ---------- ORDER META ---------- */}
          <div className="order-meta mb-4">
            <p><strong>Booking ID:</strong> {booking.orderId}</p>
            <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
            <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
          </div>
          {/* ---------- TESTS ---------- */}
          <h5 className="section-title mt-4 mb-3 text-secondary">Tests & Patients</h5>
          {booking.testsWithPatients?.map((tp, i) => (
            <div key={i} className="test-block lab-border rounded-4 p-3 mb-3">
              {tp.test ? (
                <>
                  <h6 className="text-dark mb-2 fw-semibold">{tp.test.name}</h6>
                  <p className="text-muted mb-0">₹{tp.test.price}</p>
                </>
              ) : tp.package ? (
                <>
                  <h6 className="text-dark mb-2 fw-semibold">{tp.package.name}</h6>
                  <p className="text-muted mb-0">₹{tp.package.price}</p>
                </>
              ) : (
                <p>No test information</p>
              )}
              {tp.patients?.length > 0 && (
                <div className="patient-list mt-3">
                  <strong className="text-primary">Patients:</strong>

                  {tp.patients.map((p, idx) => (
                    <div key={idx} className="patient-card lab-border rounded-3 p-3 mb-3">
                      {/* Patient Info */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold text-dark">{p.name}</span>
                        <small className="text-muted">
                          {p.gender}, {p.age} yrs
                        </small>
                      </div>

                      {p.relation && (
                        <small className="text-muted d-block mb-2">
                          Relation: {p.relation}
                        </small>
                      )}

                      {/* ✅ Patient Reports */}
                      {booking.reportApproval === true && p.reportUrls?.length > 0 && (
                        <Row className="mt-3 g-3">
                          {p.reportUrls.map((url, i) => (
                            <Col md={4} sm={6} xs={12} key={i}>
                              <div className="report-card shadow-sm border rounded-3 p-3 h-100">
                                <div className="d-flex align-items-center gap-3">
                                  {/* PDF Icon */}
                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                      width: 44,
                                      height: 44,
                                      background: "#e9f2ff",
                                      color: "#0d6efd",
                                      fontSize: "18px",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    PDF
                                  </div>

                                  {/* Report Info */}
                                  <div className="flex-grow-1">
                                    <div className="fw-semibold text-dark">
                                      Lab Report {i + 1}
                                    </div>
                                    <small className="text-muted">
                                      Approved medical report
                                    </small>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="d-flex gap-2 mt-3">
                                  <a
                                    href={`${API_URL}${url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary w-100"
                                  >
                                    <i className="fa fa-eye me-1" />
                                    View
                                  </a>

                                  <a
                                    href={`${API_URL}${url}`}
                                    target="_blank"
                                    download
                                    className="btn btn-sm btn-outline-secondary w-100"
                                  >
                                    <i className="fa fa-download me-1" />
                                    Download
                                  </a>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
          {/* ---------- ADDRESS ---------- */}
          {booking.address && (
            <>
              <h5 className="section-title mt-4 mb-3 text-secondary">Address</h5>
              <div className="lab-border rounded-4 p-3 bg-light">
                <p className="mb-1 fw-semibold">{booking.address.flatNo}</p>
                <p className="mb-0 text-muted">
                  {booking.address.city}, {booking.address.state} - {booking.address.pincode}
                </p>
              </div>
            </>
          )}
          {/* ---------- SLOT INFO ---------- */}
          {booking.slot?.date && (
            <>
              <h5 className="section-title mt-4 mb-3 text-secondary">Selected Slot</h5>
              <div className="lab-border rounded-4 p-3 bg-light">
                <p><strong>Date:</strong> {new Date(booking.slot.date).toLocaleDateString("en-In")}</p>
                <p className="mb-0"><strong>Time:</strong> {booking.slot.startTime}</p>
              </div>
            </>
          )}
          {/* ---------- PHLEBO INFO ---------- */}
          {booking.phlebo && (
            <>
              <h5 className="section-title mt-4 mb-3 text-secondary">Phlebo Details</h5>
              <div className="lab-border rounded-4 p-3 bg-light">
                <p><strong>Name:</strong> {booking.phlebo.name}</p>
                <p className="mb-0"><strong>Contact Number:</strong> {booking.phlebo.mobile}</p>
              </div>
            </>
          )}
          {
            booking.uploadedPrescriptions?.length > 0 && (
              <>
                <h5 className="section-title mt-4 mb-3 text-secondary">Uploaded Prescriptions</h5>
                <div className="lab-border rounded-4 p-3 bg-light">
                  {/* DISPLAY SINGLE OR MULTIPLE PRESCRIPTIONS */}
                  {Array.isArray(booking.uploadedPrescriptions) ? (
                    booking.uploadedPrescriptions?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-3">
                        {booking.uploadedPrescriptions.map((file, index) => (
                          <a
                            key={index}
                            href={`${API_URL}${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="prescription-thumb"
                            style={{
                              width: "90px",
                              height: "90px",
                              borderRadius: "10px",
                              overflow: "hidden",
                              border: "1px solid #ddd",
                              background: "#fff",
                              display: "block"
                            }}
                          >
                            <img
                              src={`${API_URL}${file}`}
                              alt="Prescription"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No prescriptions uploaded.</p>
                    )
                  ) : (
                    // IF ONLY A SINGLE FILE IS STORED AS STRING
                    <a
                      href={booking.uploadedPrescriptions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prescription-thumb"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        background: "#fff",
                        display: "block"
                      }}
                    >
                      <img
                        src={booking.uploadedPrescriptions}
                        alt="Prescription"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </a>
                  )}
                </div>
              </>
            )
          }
          {/* ---------- REPORTS ---------- */}
          {booking.reportUrls?.length > 0 && (
            <>
              <h5 className="section-title mt-4 mb-3 text-secondary">Lab Reports</h5>
              <div className="reports-wrapper p-3 rounded-4">
                {booking.reportUrls.map((file, index) => (
                  <div key={index} className="report-card">
                    <div className="left">
                      <div className="pdf-icon">
                        <i className="fa fa-file-pdf"></i>
                      </div>
                      <div className="report-info">
                        <h6>Report {index + 1}</h6>
                        {/* <span className="date-text">
                Uploaded • {new Date(booking.createdAt).toLocaleDateString("en-In")}
              </span> */}
                      </div>
                    </div>
                    <div className="right">
                      <a
                        href={`${API_URL}${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn view"
                        title="View Report"
                      >
                        <i className="fa fa-eye"></i>
                      </a>
                      <a
                        href={`${API_URL}${file}`}
                        target="_blank"
                        download
                        className="icon-btn download"
                        title="Download Report"
                      >
                        <i className="fa fa-download"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* ---------- ACTIONS ---------- */}
          <div className="booking-actions mt-5 d-flex gap-3 justify-content-end">
            {booking.status === "completed" && (
              <button className="btn btn-primary px-4" onClick={handleReorder}>
                Reorder Tests
              </button>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <button
                className="btn btn-outline-danger px-4"
                onClick={() => setCancelInfo({ open: true, reason: "" })}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* ---------- MODALS ---------- */}
      <Modal centered show={cancelInfo.open} onHide={() => setCancelInfo({ open: false, reason: "" })}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Reason for cancellation:</label>
          <textarea
            value={cancelInfo.reason}
            onChange={(e) => setCancelInfo({ ...cancelInfo, reason: e.target.value })}
            rows={3}
            className="form-control mt-2"
            placeholder="Enter reason..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCancelInfo({ open: false, reason: "" })}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            {cancelling ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </Modal.Footer>
      </Modal>
      {refundModal.open && (
        <RefundModal
          isOpen={refundModal.open}
          refundAmount={refundModal.amount}
          onClose={() => setRefundModal({ open: false, amount: 0 })}
        />
      )}
    </>
  );
};
export default LabBookingDetails;