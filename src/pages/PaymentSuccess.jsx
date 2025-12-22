import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import API from "../api/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [statusText, setStatusText] = useState("Verifying your payment...");
  const [paymentStatus, setPaymentStatus] = useState("verifying");
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setPaymentStatus("failed");
        setStatusText("Invalid order ID.");
        return;
      }

      try {
        const { data } = await API.post("/api/payment/verifyPaymentUnified", {
          order_id: orderId,
        });

        const { paymentStatus: serverPaymentStatus, bookingStatus, booking } = data;

        setBookingDetails(booking);

        if (serverPaymentStatus === "paid") {
          setPaymentStatus("paid");
          setStatusText(`Payment successful! Your booking is ${bookingStatus}.`);
        } else if (serverPaymentStatus === "pending") {
          setPaymentStatus("pending");
          setStatusText("Payment is pending. Please complete the payment.");
        } else {
          setPaymentStatus("failed");
          setStatusText("Payment failed. Please try again.");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setPaymentStatus("failed");
        setStatusText("Payment verification failed. Please try again later.");
      }
    };

    verifyPayment();
  }, [orderId]);

  const handleAction = () => {
    if (paymentStatus === "paid") navigate("/bookings");
    else navigate(-1);
  };

  const iconMap = {
    verifying: <Loader2 className="text-primary" size={72} />,
    paid: <CheckCircle color="#28a745" size={80} />,
    pending: <AlertTriangle color="#ffc107" size={80} />,
    failed: <XCircle color="#dc3545" size={80} />,
  };

  const titleMap = {
    verifying: "Verifying Payment",
    paid: "Payment Successful!",
    pending: "Payment Pending",
    failed: "Payment Failed",
  };

  return (
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-lg rounded-4 p-5 w-100"
          style={{ maxWidth: "520px" }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            {iconMap[paymentStatus]}
          </motion.div>

          <h3 className="fw-bold mb-2">{titleMap[paymentStatus]}</h3>
          <p className="text-muted mb-3">{statusText}</p>

          {orderId && (
            <p className="text-secondary small mb-4">
              <strong>Order ID:</strong> {orderId}
            </p>
          )}

          {bookingDetails && paymentStatus === "paid" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border rounded-4 p-4 text-start bg-light mb-4"
            >
              <h6 className="fw-bold mb-3 text-center">Booking Summary</h6>
              <ul className="list-unstyled mb-0 small">
                <li>
                  <strong>Patient:</strong> {bookingDetails.patient?.name || "N/A"}
                </li>
                {/* <li>
                  <strong>Test / Package:</strong>{" "}
                  {bookingDetails.package?.name || bookingDetails.test?.name || "N/A"}
                </li> */}
                <li>
                  <strong>Amount Paid:</strong> ₹{bookingDetails.totalAmount || "N/A"}
                </li>
                <li>
                  <strong>Date:</strong>{" "}
                  {new Date(bookingDetails.createdAt).toLocaleString()}
                </li>
                <li>
                  <strong>Status:</strong>{" "}
                  <span className="text-success fw-semibold">{bookingDetails.status}</span>
                </li>
              </ul>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn px-4 py-2 fw-semibold ${
              paymentStatus === "paid"
                ? "btn-success"
                : paymentStatus === "pending"
                ? "btn-warning"
                : paymentStatus === "failed"
                ? "btn-danger"
                : "btn-primary"
            }`}
            onClick={handleAction}
          >
            {paymentStatus === "paid"
              ? "Go to My Bookings"
              : paymentStatus === "pending"
              ? "Try Again"
              : paymentStatus === "failed"
              ? "Go Back"
              : "Verifying..."}
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* <footer className="text-muted small mt-4">
        © {new Date().getFullYear()} Ayush Labs — Secure Payment Portal
      </footer> */}
    </div>
  );
};

export default PaymentSuccess;
