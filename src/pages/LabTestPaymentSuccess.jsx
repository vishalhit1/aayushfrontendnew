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
          setStatusText("Payment is pending. Please complete the payment.");
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
      navigate(-1);
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
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3"
        style={{
          background: "linear-gradient(145deg, #f9fafb 0%, #eef1f5 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={paymentStatus}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-lg rounded-4 p-5 w-100"
            style={{ maxWidth: "520px" }}
          >
            <div className="mb-4">{iconMap[paymentStatus]}</div>

            <h3 className="fw-bold mb-2">{titleMap[paymentStatus]}</h3>
            <p className="text-muted mb-3">{statusText}</p>

            {orderId && (
              <p className="text-secondary small mb-4">
                <strong>Order ID:</strong> {orderId}
              </p>
            )}

            {bookingDetails && paymentStatus === "paid" && (
              <div className="border rounded-4 p-4 text-start bg-light mb-4">
                <h6 className="fw-bold mb-3 text-center">
                  Lab Test Booking Summary
                </h6>
                <ul className="list-unstyled mb-0 small">
                  <li>
                    <strong>Patient:</strong>{" "}
                    {bookingDetails.user?.name || "N/A"}
                  </li>
                  <li>
                    <strong>Amount:</strong> ₹{bookingDetails.totalAmount}
                  </li>
                  <li>
                    <strong>Status:</strong>{" "}
                    <span className="text-success fw-semibold">
                      {bookingDetails.status}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn px-4 py-2 fw-semibold ${
                paymentStatus === "paid"
                  ? "btn-success"
                  : paymentStatus === "pending"
                  ? "btn-warning"
                  : "btn-danger"
              }`}
              onClick={handleAction}
            >
              {paymentStatus === "paid"
                ? "Go to My Lab Bookings"
                : "Go Back"}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="recooo mt-5 mb-5" style={{ background: "#F2FAF9" }}>
        <BookTogether />
      </div>

      <Container>
        <img className="w-100" src={banner} alt="" />
      </Container>

      <Individualtest />

      <div className="recooo pt-5 pb-3" style={{ background: "#F2FAF9" }}>
        <Ourpackages />
      </div>

      <Popularhealthpackages />
    </>
  );
};

export default LabTestPaymentSuccess;
