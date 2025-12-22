import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Loader2, CheckCircle } from "lucide-react";
import API from "../api/axios";

const BookingCancelled = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("booking_id");
  const type = searchParams.get("type"); // "doctor" or "lab"

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [refund, setRefund] = useState(0);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId || !type) return;

        const endpoint =
          type === "doctor"
            ? `/api/booking/doctors/${bookingId}`
            : `/api/booking/lab-tests/${bookingId}`;

        const { data } = await API.get(endpoint);
        setBooking(data.booking);
        setRefund(data.booking.refundAmount || 0);
      } catch (err) {
        console.error("Error fetching cancelled booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, type]);

  const handleAction = () => {
    navigate(type === "doctor" ? "/bookings" : "/lab-bookings");
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
          key={loading ? "loading" : "cancelled"}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-lg rounded-4 p-5 w-100"
          style={{ maxWidth: "520px" }}
        >
          {loading ? (
            <>
              <Loader2 className="text-primary mb-4" size={72} />
              <h4>Fetching booking details...</h4>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <XCircle color="#dc3545" size={80} />
              </motion.div>

              <h3 className="fw-bold mb-2 text-danger">Booking Cancelled</h3>
              <p className="text-muted mb-3">
                Your {type === "doctor" ? "doctor" : "lab test"} booking has been
                cancelled successfully.
              </p>

              {booking && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border rounded-4 p-4 text-start bg-light mb-4"
                >
                  <h6 className="fw-bold mb-3 text-center">
                    Cancellation Summary
                  </h6>
                  <ul className="list-unstyled mb-0 small">
                    <li>
                      <strong>Booking ID:</strong> {booking._id}
                    </li>

                    {type === "doctor" && (
                      <li>
                        <strong>Doctor:</strong>{" "}
                        {booking.doctors?.[0]?.name ||
                          booking.lobbyDoctor?.name ||
                          "N/A"}
                      </li>
                    )}

                    {type === "lab" && (
                      <>
                        {booking.tests?.length > 0 && (
                          <li>
                            <strong>Tests:</strong>{" "}
                            {booking.tests.map((t) => t.name).join(", ")}
                          </li>
                        )}
                        {booking.packages?.length > 0 && (
                          <li>
                            <strong>Packages:</strong>{" "}
                            {booking.packages.map((p) => p.name).join(", ")}
                          </li>
                        )}
                      </>
                    )}

                    <li>
                      <strong>Status:</strong>{" "}
                      <span className="text-danger fw-semibold">
                        {booking.status}
                      </span>
                    </li>

                    <li>
                      <strong>Refund Amount:</strong> ₹
                      {refund > 0 ? refund : "0"}{" "}
                      {refund > 0 ? "(added to wallet)" : ""}
                    </li>

                    <li>
                      <strong>Cancelled On:</strong>{" "}
                      {new Date(booking.updatedAt).toLocaleString()}
                    </li>
                  </ul>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-danger px-4 py-2 fw-semibold"
                onClick={handleAction}
              >
                Go to My {type === "doctor" ? "Doctor" : "Lab"} Bookings
              </motion.button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* <footer className="text-muted small mt-4">
        © {new Date().getFullYear()} Ayush Labs — Secure Portal
      </footer> */}
    </div>
  );
};

export default BookingCancelled;
