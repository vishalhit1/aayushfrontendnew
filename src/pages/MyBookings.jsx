import React, { useEffect, useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios.js";
import { CartContext } from "../context/CartContext.jsx";
import { load } from "@cashfreepayments/cashfree-js";
import "../styles/myBookings.css";
import { API_URL } from "../../config.js";
const statusColors = {
  pending: "#F5A623",
  confirmed: "#2D7DFF",
  completed: "#28A745",
  canceled: "#DC3545",
};
const MyBookings = () => {
  const navigate = useNavigate();
  const [doctorBookings, setDoctorBookings] = useState([]);
  const [labTestBookings, setLabTestBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("doctors");
  const { addToDoctorCart, addToLabCart } = useContext(CartContext);
  // For cancellation modal
  const [cancelInfo, setCancelInfo] = useState({
    open: false,
    booking: null,
    type: null,
    reason: "",
  });

  const [rescheduleInfo, setRescheduleInfo] = useState({
    open: false,
    booking: null,
    date: "",
    slots: [],
    slotId: "",
    time: ""
  });

  const [prescriptionModal, setPrescriptionModal] = useState({
    open: false,
    prescriptions: [],
  });

  const formatDate = (dateInput) => {
    if (!dateInput) return ""; // handle null/undefined
    const date = new Date(dateInput);
    if (isNaN(date)) return ""; // invalid date check

    // Format as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/api/booking/all");
        setDoctorBookings(res.data.doctorBookings);
        setLabTestBookings(res.data.labTestBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const scriptId = "cashfree-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);


  if (loading) return <div className="fullpage-loader">
    <div className="spinner"></div>
  </div>;


  const handleReorder = (booking, type) => {
    if (type === "doctor") booking.doctors.forEach((d) => addToDoctorCart(d));
    else booking.labTests.forEach((l) => addToLabCart(l));
    navigate("/checkout");
  };
  const handleJoinConsultation = async (booking) => {

    try {
      const uid = String(Math.floor(Math.random() * 100000));
      const channelName = booking.orderId;
      const doctorId =
        booking.doctors?.[0]?._id ||
        booking.doctors?._id ||
        booking.doctors ||
        booking.lobbyDoctor?._id ||
        booking.lobbyDoctor ||
        booking.doctorId;
      const bookingId = booking._id;
      const patientId = booking.patient._id;
      const type = booking.consultationType.toLowerCase();
      const doctorName = booking.type === "lobby"
        ? booking?.lobbyDoctor?.name || "N/A"
        : booking?.doctors?.name || "N/A"

      if (!doctorId) {
        alert("Doctor info missing!");
        return;
      }
      const res = await API.get("/api/consultations/getAgoratoken", {
        params: { channelName, uid },
      });
      const token = res.data.token;
      const basePath =
        type === "video"
          ? "/consultation/video"
          : type === "audio"
            ? "/consultation/audio"
            : "/consultation/chat";
      window.location.href = `${basePath}?channelName=${channelName}&uid=${uid}&token=${encodeURIComponent(
        token
      )}&patientId=${patientId}&doctorId=${doctorId}&bookingId=${bookingId}&doctorName=${doctorName}`;
    } catch (err) {
      console.error(err);
      alert("Failed to join consultation");
    }
  };



  // Check if slot date/time has passed
  // Check if slot date/time has passed
  // ✅ Check if slot date/time has passed
  const isSlotExpired = (slot) => {
    if (!slot?.date || !slot?.startTime) return true; // treat missing data as expired

    // Ensure startTime is valid
    const [hours, minutes] = slot.startTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return true;

    // Parse slot date
    const slotDate = new Date(slot.date);
    if (isNaN(slotDate.getTime())) return true; // invalid date

    // Set hours and minutes
    slotDate.setHours(hours, minutes, 0, 0);

    // Compare with now
    return new Date() > slotDate;
  };

  const isLabSlotExpired = (slot) => {
    console.log("lab slot", slot);
  
    if (!slot || !slot.date || !slot.startTime) return true;
  
    // Parse date string
    const slotDate = new Date(slot.date);
    if (isNaN(slotDate.getTime())) return true;
  
    // Extract start time → "9 PM"
    const startPart = slot.startTime.split("-")[0].trim(); // "9 PM"
    const [time, meridiem] = startPart.split(" ");
  
    let [hours, minutes] = time.split(":").map(Number);
    minutes = minutes || 0;
  
    if (isNaN(hours) || !meridiem) return true;
  
    // Convert to 24-hour format
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  
    slotDate.setHours(hours, minutes, 0, 0);
  
    return new Date() > slotDate;
  };
  
  

  const handlePatientResponse = async (bookingId, response) => {
    try {
      await API.patch(`/api/doctors/appointments/${bookingId}/respond`, { response });
      toast.success(`You have ${response} the rescheduled slot`);
      // Optionally update UI immediately
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to respond to reschedule");
    }
  };

  const handleLabPayment = async (booking) => {
    try {
      const res = await API.post("/api/payment/retry-lab-payment", {
        bookingId: booking._id,
      });

      console.log("res>>>>>>>>>>>>>>>>>>>>", res.data)

      if (!res.data.success) {
        toast.error("Unable to start payment");
        return;
      }

      const payment_session_id = res.data.order.payment_session_id;

      const cashfree = await load({ mode: "sandbox" }); // production in live

      cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_self"
      });

    } catch (err) {
      console.error(err);
      toast.error("Payment failed to initialize");
    }
  };

  // Render booking card
  const renderBookingCard = (booking, type) => (
    <div key={booking._id} className="booking-card doctor-booking-card">
      {/* Header */}
      <div className="booking-header">
        <div>
          <strong>Booking ID:</strong> {booking.orderId}
          <div className="booking-date">
            📅  {new Date(booking.createdAt).toLocaleString("en-In")}
          </div>
        </div>
        <span
          className="status-badge"
          style={{ background: statusColors[booking.status] || "#ccc" }}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      {/* Overview */}
      <div className="booking-overview">
        <div className="info-row">
          <strong>👨‍⚕️ Doctor: </strong>{" "}
          {booking.type === "lobby"
            ? booking?.lobbyDoctor?.name || "N/A"
            : booking?.doctors?.name || "N/A"}
        </div>

        <div className="info-row">
          <strong>🧍 Patient: </strong>{" "}
          {booking.patient?.name}, {booking.patient?.age} yrs
        </div>

        {/* <div className="info-row">
          <strong>🏠 Address:</strong>{" "}
          {booking.address?.flatNo}, {booking.address?.city}
        </div> */}

        {/* Slot details */}
        {booking.slot && (
          <div className="info-row slot-row">
            <strong>⏰ Slot: </strong>{" "}
            {booking.slot?.date
              ? new Date(booking.slot.date).toLocaleDateString("en-In")
              : "N/A"}{" "}
            | {booking.slot?.startTime || "--"} - {booking.slot?.endTime || "--"}
          </div>
        )}

        <div className="info-row">
          <strong>💳 Payment:</strong> {booking.paymentMethod?.toUpperCase()}
        </div>

        <div className="info-row">
          <strong>💰 Total:</strong> ₹{booking.totalAmount}
        </div>
      </div>

      {/* Actions */}
      <div className="booking-actions">
        <button
          className="view-details-btn"
          onClick={() => navigate(`/booking/${type}/${booking._id}`)}
        >
          View Details
        </button>

        {/* {booking.status === "completed" && (
          <button
            className="reorder-btn"
            onClick={() => handleReorder(booking, type)}
          >
            Reorder
          </button>
        )} */}

        {booking.status === "completed" && booking.prescriptions?.length > 0 && (
          <button
            className="view-details-btn"
            onClick={() =>
              setPrescriptionModal({
                open: true,
                prescriptions: booking.prescriptions,
              })
            }
          >
            View Prescription
          </button>
        )}


        {(booking.status === "confirmed" || booking.status === "rescheduled") && !isSlotExpired(booking?.slot) && (
          <>
            <button
              className="cancel-btn-booking"
              onClick={() =>
                setCancelInfo({ open: true, booking, type, reason: "" })
              }
            >
              Cancel
            </button>
          </>
        )}

        {(booking.status === "confirmed") && !isSlotExpired(booking.slot) && (
          <>
            <button
              className="reorder-btn"
              onClick={() => handleReschedule(booking)}
            >
              Reschedule
            </button>
          </>
        )}

        {booking.status === "rescheduled" && !booking.patientResponse && (
          <div className="d-flex gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => handlePatientResponse(booking._id, "accepted")}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handlePatientResponse(booking._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        )}




        {(booking.status === "confirmed" || booking.status === "rescheduled") && booking.consultationType && (
          <button
            className="join-consultation-btn"
            onClick={() => handleJoinConsultation(booking)}
          >
            Join{" "}
            {booking.consultationType.charAt(0).toUpperCase() +
              booking.consultationType.slice(1)}{" "}
            Consultation
          </button>
        )}
      </div>
    </div>
  );

  const statusLabels = {
    pending: "Pending",
    payment_pending: "Awaiting Payment",
    confirmed: "Confirmed",
    assigned: "Assigned",
    collection_scheduled: "Collection Scheduled",
    out_for_collection: "Out for Collection",
    sample_collected: "Sample Collected",
    processing: "Processing",
    report_ready: "Report Ready",
    completed: "Completed",
    cancelled: "Cancelled",
  };


  const statusColors = {
    pending: "#6c757d",             // grey
    payment_pending: "#ff9800",     // amber
    confirmed: "#0288d1",           // blue
    assigned: "#512da8",            // deep purple
    collection_scheduled: "#7b1fa2",// purple
    out_for_collection: "#00897b",  // teal
    sample_collected: "#009688",    // green-teal
    processing: "#ff7043",          // orange
    report_ready: "#43a047",        // green
    completed: "#2e7d32",           // dark green
    cancelled: "#d32f2f"            // red
  };




  // ✅ Render Lab Test Booking Card (Tata 1mg style)
  // ✅ Refined Lab Test Booking Card (Modern Tata 1mg–like UI)
  const renderLabBookingCard = (booking) => (
    <div key={booking._id} className="lab-booking-card shadow-sm rounded-4 mb-4">
      {/* ---------- HEADER ---------- */}
      <div className="lab-card-header d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <div>
          <h6 className="mb-1 fw-semibold text-dark">
            Booking ID: <span className="text-primary">{booking.orderId}</span>
          </h6>
          <small className="text-muted">
            {new Date(booking.createdAt).toLocaleString("en-In")}
          </small>
        </div>
        <span
          className="status-badge-lab"
          style={{
            background: statusColors[booking.status] || "#777",
          }}
        >
          {statusLabels[booking.status] || booking.status}
        </span>

      </div>

      {/* ---------- TESTS SECTION ---------- */}
      <div className="labtest-section">
        <h6 className="text-secondary fw-semibold mb-2">Tests & Patients</h6>
        {booking.testsWithPatients?.map((item, i) => (
          <div key={i} className="test-item border rounded-3 p-2 mb-2 bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                🧪 {item.testId?.name || item.packageId?.name || "Lab Test"}
              </span>
              <span className="text-success fw-semibold">
                ₹{item.testId?.price || item.packageId?.price || "—"}
              </span>
            </div>

            {/* Patients */}
            <div className="patient-list mt-2">
              {item.patients?.map((p, idx) => (
                <span key={idx} className="patient-chip me-2 mb-1">
                  👤 {p.name} ({p.age} yrs, {p.gender})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {booking.slot && (
        <div className="slot-info">
          Slot: {formatDate(booking.slot.date)} | {booking.slot.startTime}
        </div>
      )}


      {booking.phlebo && (
        <div className="slot-info">
          phlebo: {booking.phlebo.name} | {booking.phlebo.mobile}
        </div>
      )}


      {/* ---------- ADDRESS & PAYMENT ---------- */}
      <div className="labtest-details mt-3 border-top pt-2">
        <p className="mb-1">
          <strong>Address:</strong>{" "}
          {booking.address?.flatNo}, {booking.address?.city}
        </p>
        <p className="mb-1">
          <strong>Payment:</strong> {booking.paymentMethod == "collection" ? "Pay On collection" : booking.paymentMethod?.toUpperCase()}
        </p>
        <p className="mb-0 text-success fw-semibold">
          <strong>Total:</strong> ₹{booking.totalAmount}
        </p>
      </div>

      {/* ---------- ACTION BUTTONS ---------- */}
      <div className="booking-actions mt-3 d-flex justify-content-between align-items-center">
        <button
          className="view-details-btn"
          onClick={() => navigate(`/booking/lab/${booking._id}`)}
        >
          View Details
        </button>

        {booking.paymentStatus == "pending" && (
          !isLabSlotExpired(booking.slot) && (
            <button
              className="pay-btn"
              onClick={() => handleLabPayment(booking)}
            >
              Pay Now
            </button>
          )
        )}

        <div className="d-flex gap-2">
          {/* {booking.status === "completed" && (
            <button
              className="reorder-btn"
              onClick={() => handleReorder(booking, "lab")}
            >
              Reorder
            </button>
          )} */}

          {(booking.status === "pending" || booking.status === "confirmed") &&
            !isLabSlotExpired(booking.slot) && (
              <button
                className="cancel-btn-booking"
                onClick={() =>
                  setCancelInfo({ open: true, booking, type: "lab", reason: "" })
                }
              >
                Cancel
              </button>
            )}
        </div>
      </div>
    </div>
  );


  // Confirm cancellation
  const confirmCancellation = async () => {
    try {
      console.log("cancelInfo.type", cancelInfo.type)
      const endpoint =
        cancelInfo.type === "doctor"
          ? `/api/booking/doctors/${cancelInfo.booking._id}/cancel`
          : `/api/booking/lab-tests/${cancelInfo.booking._id}/cancel`;
      const res = await API.put(endpoint, { reason: cancelInfo.reason });
      if (cancelInfo.type === "doctor") {
        setDoctorBookings((prev) =>
          prev.map((b) => (b._id === cancelInfo.booking._id ? res.data.booking : b))
        );
      } else {
        setLabTestBookings((prev) =>
          prev.map((b) => (b._id === cancelInfo.booking._id ? res.data.booking : b))
        );
      }
      // alert(`Booking cancelled successfully! Refund: ₹${res.data.refundAmount}`);

      navigate(
        `/booking-cancelled?booking_id=${res.data.booking._id}&type=${cancelInfo.type}`
      );



    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    } finally {
      setCancelInfo({ open: false, booking: null, type: null, reason: "" });
    }
  };


  // 🟢 Updated handleReschedule
  const handleReschedule = async (booking) => {
    try {
      const doctorId =
        booking.doctors?._id || booking.lobbyDoctor?._id || booking.doctorId;

      if (!doctorId) {
        alert("Doctor information missing.");
        return;
      }

      const res = await API.get(`/api/doctors/${doctorId}/slots`, {
        params: { date: booking.slot?.date },
      });

      const available = (res.data.slots || [])
        .filter((s) => s.available) // ✅ just check availability
        .sort((a, b) => a.time.localeCompare(b.time)); // ✅ simple sort by time string


      setRescheduleInfo({
        open: true,
        booking,
        date: booking.slot?.date || "",
        slots: available,
        slotId: "",
        time: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load available slots");
    }
  };


  const confirmReschedule = async () => {
    try {
      if (!rescheduleInfo.slotId || !rescheduleInfo.date) {
        alert("Please select date and slot.");
        return;
      }

      const res = await API.put(
        `/api/doctors/appointments/${rescheduleInfo.booking._id}/requestReschedule`,
        {
          newDate: rescheduleInfo.date,
          newTime: rescheduleInfo.time,
          newSlotId: rescheduleInfo.slotId,
        }
      );

      alert("Appointment rescheduled successfully!");
      setDoctorBookings((prev) =>
        prev.map((b) =>
          b._id === rescheduleInfo.booking._id ? res.data.booking : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule appointment");
    } finally {
      setRescheduleInfo({
        open: false,
        booking: null,
        date: "",
        slots: [],
        slotId: "",
        time: "",
      });
    }
  };




  const lobbyBookings = doctorBookings.filter((b) => b.type === "lobby");
  const specialistBookings = doctorBookings.filter((b) => b.type !== "lobby");


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
                  <li className="breadcrumb-item active">My Bookings</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <h2 class="consult-a-doctors-now">My Booking List</h2>
      <div className="container">
        <div className="booking-tabs">
          <button
            className={activeTab === "doctors" ? "active" : ""}
            onClick={() => setActiveTab("doctors")}
          >
            Doctor Consultations
          </button>
          <button
            className={activeTab === "lab-tests" ? "active" : ""}
            onClick={() => setActiveTab("lab-tests")}
          >
            Lab Tests
          </button>
        </div>
        <div className="booking-content">
          <div className="row">
            {activeTab === "doctors"
              ? doctorBookings.length === 0 ? (
                <p>No doctor bookings yet.</p>
              ) : (
                <>
                  {lobbyBookings.length > 0 && (
                    <>
                      <h4 className="booking-section-title">Lobby Doctor Bookings</h4>
                      {lobbyBookings.map((b) => (
                        <div className="col-lg-4" key={b._id}>
                          {renderBookingCard(b, "doctor")}
                        </div>
                      ))}
                    </>
                  )}

                  {specialistBookings.length > 0 && (
                    <>
                      <h4 className="booking-section-title">Specialist Doctor Bookings</h4>
                      {specialistBookings.map((b) => (
                        <div className="col-lg-4" key={b._id}>
                          {renderBookingCard(b, "doctor")}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )

              : labTestBookings.length === 0
                ? <p>No lab test bookings yet.</p>
                : labTestBookings.map((b) => (
                  <div className="col-lg-4" key={b._id}>
                    {renderLabBookingCard(b, "lab")}
                  </div>
                ))}
          </div>
        </div>
        {cancelInfo.open && (
          <Modal
            show={cancelInfo.open}
            onHide={() => setCancelInfo({ open: false, booking: null, type: null, reason: "" })}
            size="md"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title className="title-abcds-cancel">Cancellation Rules</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul className="cancel-contents">
                <li>
                  Cancel <strong>before 10 PM (day prior)</strong> → Full refund.
                </li>
                <li>
                  Cancel <strong>after cutoff time</strong> → ₹200 Fee deducted.
                </li>
                <li>
                  Refund processed to <strong>Original payment method</strong>.
                </li>
              </ul>
              <label className="reason-label-cancel">
                Reason for cancellation (optional):
              </label>
              <textarea
                value={cancelInfo.reason}
                onChange={(e) =>
                  setCancelInfo((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Enter reason"
                rows={3}
                style={{ width: "100%", padding: "5px", marginTop: "5px" }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={confirmCancellation}>
                Confirm Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => setCancelInfo({ open: false, booking: null, type: null, reason: "" })}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {rescheduleInfo.open && (
          <Modal
            show={rescheduleInfo.open}
            onHide={() =>
              setRescheduleInfo({
                open: false,
                booking: null,
                date: "",
                slots: [],
                slotId: "",
                time: "",
              })
            }
            size="md"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Reschedule Appointment</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {/* ---------- DATE SELECTION ---------- */}
              <div className="mb-3">
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleInfo.date}
                  onChange={async (e) => {
                    const selectedDate = e.target.value;
                    const doctorId =
                      rescheduleInfo.booking.doctors?._id ||
                      rescheduleInfo.booking.lobbyDoctor?._id;

                    setRescheduleInfo((p) => ({ ...p, date: selectedDate, slotId: "", time: "", loading: true }));

                    try {
                      const res = await API.get(`/api/doctors/${doctorId}/slots`, {
                        params: { date: selectedDate },
                      });

                      const now = new Date();
                      const availableSlots = (res.data.slots || [])
                        .map((s) => {
                          const slotDateTime = new Date(`${selectedDate} ${s.time}`);
                          const isDisabled = slotDateTime <= now;
                          return { ...s, isDisabled };
                        })
                        .sort((a, b) => a.time.localeCompare(b.time));

                      setRescheduleInfo((p) => ({ ...p, slots: availableSlots, loading: false }));
                    } catch {
                      setRescheduleInfo((p) => ({ ...p, slots: [], loading: false }));
                    }
                  }}
                />
              </div>

              {/* ---------- SLOT SELECTION (Tata 1mg style) ---------- */}
              {rescheduleInfo.date && (
                <div className="mb-3">
                  <label className="form-label">Select Slot</label>

                  {rescheduleInfo.loading ? (
                    <div className="text-center p-3">
                      <div className="spinner-border text-primary" role="status"></div>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {rescheduleInfo.slots.length === 0 && (
                        <p className="text-muted">No slots available for selected date</p>
                      )}
                      {rescheduleInfo.slots.map((s) => {
                        const isSelected = rescheduleInfo.slotId === s._id;
                        const buttonClass = s.isDisabled
                          ? "btn btn-sm btn-secondary disabled"
                          : isSelected
                            ? "btn btn-sm btn-success"
                            : "btn btn-sm btn-outline-secondary";

                        return (
                          <button
                            key={s._id}
                            className={buttonClass}
                            style={{ minWidth: "80px", position: "relative" }}
                            onClick={() =>
                              !s.isDisabled &&
                              setRescheduleInfo((p) => ({ ...p, slotId: s._id, time: s.time }))
                            }
                            disabled={s.isDisabled}
                            title={s.isDisabled ? "Slot unavailable" : ""}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  setRescheduleInfo({
                    open: false,
                    booking: null,
                    date: "",
                    slots: [],
                    slotId: "",
                    time: "",
                  })
                }
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={confirmReschedule}
                disabled={!rescheduleInfo.slotId}
              >
                Confirm Reschedule
              </Button>
            </Modal.Footer>
          </Modal>
        )}


        {/* prescription */}
        {prescriptionModal.open && (
          <Modal
            show={prescriptionModal.open}
            onHide={() => setPrescriptionModal({ open: false, prescriptions: [] })}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Doctor Prescription</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {prescriptionModal.prescriptions.map((pres, index) => {
                const fileName = Array.isArray(pres.file) ? pres.file[0] : pres.file;
                const fileUrl = `${API.defaults.baseURL}/uploads/prescriptions/${fileName}`.replace(/([^:]\/)\/+/g, "$1");
                const isPDF = typeof fileName === "string" && fileName.toLowerCase().endsWith(".pdf");

                return (
                  <div
                    key={index}
                    className="border rounded p-2 text-center shadow-sm"
                    style={{ width: "180px" }}
                  >
                    {isPDF ? (
                      <iframe
                        src={fileUrl}
                        title={`prescription-${index}`}
                        style={{ width: "100%", height: "180px", border: "none" }}
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt={`prescription-${index}`}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary mt-2 w-100"
                    >
                      Open / Download
                    </a>
                  </div>
                );
              })}

            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setPrescriptionModal({ open: false, prescriptions: [] })}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}



      </div>
    </>
  );
};
export default MyBookings;
