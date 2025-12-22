import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../styles/bookingDetails.css";
import { CartContext } from "../context/CartContext";
import RefundModal from "./RefundModal"
import API from "../api/axios";

const statusColors = {
  pending: "#F5A623",
  confirmed: "#2D7DFF",
  completed: "#28A745",
  canceled: "#DC3545",
};

const DoctorBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToDoctorCart } = useContext(CartContext);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [refundModal, setRefundModal] = useState({ open: false, amount: 0 });
  const [cancelInfo, setCancelInfo] = useState({ open: false, reason: "" });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/api/booking/doctors/${id}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleReorder = () => {
    if (!booking) return;
    booking.doctors.forEach(d => addToDoctorCart(d));
    navigate("/checkout");
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const res = await API.put(`/api/booking/doctors/${id}/cancel`, {
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

  if (loading) return <p>Loading doctor booking...</p>;
  if (!booking) return <p>Booking not found!</p>;

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <nav aria-label="breadcrumb" className="page-breadcrumb text-center">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/"><i className="fa fa-home"></i> Home</Link>
              </li>
              <li className="breadcrumb-item active">Doctor Booking</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="page-container booking-details-pages-new mb-5">
        <h2>Doctor Booking Details</h2>
        <div className="booking-card">
          <div className="booking-header">
            <span>{new Date(booking.createdAt).toLocaleString("en-In")}</span>
            <span className="status-badge"
              style={{ background: statusColors[booking.status] || "#ccc" }}>
              {booking.status.toUpperCase()}
            </span>
          </div>

          <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>

          <h4>Doctor</h4>
          {booking.type === "lobby" ? (
            <div className="booking-item">
              <p><strong>Doctor Name:</strong> {booking?.lobbyDoctor?.name}</p>
            </div>
          ) : (
            <div className="booking-item">
              <p><strong>Doctor Name:</strong> {booking?.doctors?.name}</p>
            </div>
          )}

          <h4>Patient Details</h4>
          {booking.patient && (
            <div className="booking-item">
              <p><strong>Name:</strong> {booking.patient.name}</p>
              <p><strong>Age:</strong> {booking.patient.age} yrs</p>
            </div>
          )}
          {booking.address && (
            <p><strong>Address:</strong> {booking.address.flatNo}, {booking.address.city}, {booking.address.state}</p>
          )}

          <div className="booking-actions">
            {booking.status === "completed" && (
              <button className="reorder-btn" onClick={handleReorder}>Reorder</button>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <button className="cancel-btn" onClick={() => setCancelInfo({ open: true, reason: "" })}>
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>

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
              style={{ width: "100%" }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCancel}>
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
            <Button variant="secondary" onClick={() => setCancelInfo({ open: false, reason: "" })}>
              Close
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
      </div>
    </>
  );
};

export default DoctorBookingDetails;
