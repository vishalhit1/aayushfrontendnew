import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { CartContext } from "../context/CartContext.jsx";
import API from "../api/axios";

import BookTogether from "./Testdetails/BookTogether.jsx";
import Ourpackages from "./Labtests/Ourpackages.jsx";
import Popularhealthpackages from "./Labtests/Popularhealthpackages.jsx";
import Individualtest from "./Labtests/Individualtest.jsx";

import banner from "../assets/banner/homebanner.png";
import { Container } from "react-bootstrap";

const LabTestPaymentSuccess = () => {
  const { clearLabCart, resetBookingState } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [statusText, setStatusText] = useState("Verifying your payment...");
  const [paymentStatus, setPaymentStatus] = useState("verifying");

  const [bookingDetails, setBookingDetails] = useState(null);

  // ------------------------------------------------
  // 🔥 VERIFY PAYMENT (ONLINE + COLLECTION)
  // ------------------------------------------------
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          setPaymentStatus("failed");
          setStatusText("Invalid order ID.");
          return;
        }

        const { data } = await API.post(
          "/api/payment/verifyLabPaymentUnified",
          { order_id: orderId }
        );

        const { paymentStatus, bookingStatus, booking } = data;

        setBookingDetails(booking);

        // ✅ BOTH ONLINE SUCCESS + COLLECTION
        if (paymentStatus === "paid") {
          setPaymentStatus("paid");
          setStatusText(
            booking.paymentMethod === "collection"
              ? "Booking confirmed. Pay on collection."
              : `Payment successful! Your booking is ${bookingStatus}.`
          );

          clearLabCart();
          resetBookingState();
          return;
        }

        if (paymentStatus === "pending") {
          setPaymentStatus("pending");
          setStatusText(
            "Your booking has been confirmed, but the payment is still pending. Please go to 'My Bookings' and use the 'Pay Now' button to complete your payment."
          );
          return;
        }

        setPaymentStatus("failed");
        setStatusText("Payment failed. Please try again.");
      } catch (err) {
        console.error("Payment verification failed:", err);
        setPaymentStatus("failed");
        setStatusText("Payment verification failed. Please try again later.");
      }
    };

    verifyPayment();
  }, [orderId]);

  // ------------------------------------------------
  // 🔁 CTA HANDLER
  // ------------------------------------------------
  const handleAction = () => {
    if (paymentStatus === "paid") {
      navigate("/bookings");
    } else {
      navigate("/bookings");
    }
  };

  // ------------------------------------------------
  // UI MAPS
  // ------------------------------------------------
  const iconMap = {
    verifying: <Loader2 className="text-primary" size={72} />,
    paid: <CheckCircle color="#28a745" size={80} />,
    pending: <AlertTriangle color="#ffc107" size={80} />,
    failed: <XCircle color="#dc3545" size={80} />,
  };

  const titleMap = {
    verifying: "Verifying Payment",
    paid: "Booking Confirmed!",
    pending: "Payment Pending",
    failed: "Payment Failed",
  };

  return (
    <>
      {/* ===== PAYMENT STATUS SECTION ===== */}
      <div
        className="d-flex align-items-center justify-content-center px-3"
        style={{
          background:
            "radial-gradient(circle at top, #eef6ff 0%, #f9fafb 60%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={paymentStatus}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="payment-card shadow-lg"
          >
            {/* STATUS STRIP */}
            <div
              className={`status-strip ${paymentStatus}`}
            />

            {/* ICON */}
            <div className="text-center mt-4">{iconMap[paymentStatus]}</div>

            {/* TITLE */}
            <h2 className="fw-bold text-center mt-3 mb-2">
              {titleMap[paymentStatus]}
            </h2>

            {/* MESSAGE */}
            <p className="text-muted text-center px-4 mb-3">
              {statusText}
            </p>

            {/* ORDER ID */}
            {orderId && (
              <p className="text-center small text-secondary mb-4">
                Order ID: <strong>{orderId}</strong>
              </p>
            )}

            {/* BOOKING SUMMARY */}
            {bookingDetails && paymentStatus === "paid" && (
              <div className="summary-card">
                <h6 className="fw-semibold text-center mb-3">
                  Booking Summary
                </h6>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Patient</span>
                  <span className="fw-medium">
                    {bookingDetails.user?.name || "N/A"}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Amount</span>
                  <span className="fw-medium">
                    ₹{bookingDetails.totalAmount}
                  </span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-muted">Status</span>
                  <span className="text-success fw-semibold">
                    {bookingDetails.status}
                  </span>
                </div>
              </div>
            )}

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAction}
              className={`btn w-100 mt-4 fw-semibold ${paymentStatus === "paid"
                ? "btn-success"
                : paymentStatus === "pending"
                  ? "btn-warning"
                  : "btn-danger"
                }`}
            >
              {/* {paymentStatus === "paid"
                ? "View My Lab Bookings"
                : "Return to Home"} */}
              {paymentStatus === "paid"
                ? "View My Lab Bookings"
                : paymentStatus === "pending"
                  ? "Go to My Bookings"
                  : "Return to Home"}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===== RECOMMENDATIONS ===== */}
      <section className="" style={{ background: "#F2FAF9" }}>
        <BookTogether />
      </section>

      <Container className="my-4">
        <img className="w-100 rounded-4 shadow-sm" src={banner} alt="" />
      </Container>

      <Individualtest />

      <section className="py-5" style={{ background: "#F2FAF9" }}>
        <Ourpackages />
      </section>

      <Popularhealthpackages />
    </>
  );

};

export default LabTestPaymentSuccess;