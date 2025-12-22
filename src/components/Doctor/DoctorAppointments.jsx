import React, { useEffect, useState } from "react";
import { doctorAPI } from "../../api/axios";
import { Table, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";
import { formatDate } from "../../utils/formatDate";

const socket = io(API_URL);

const DoctorAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  // For cancellation modal
  const [cancelInfo, setCancelInfo] = useState({
    open: false,
    booking: null,
    reason: "",
  });
  const [rescheduleInfo, setRescheduleInfo] = useState({
    open: false,
    booking: null,
    date: "",
    slots: [],
    slotId: "",
    time: "",
    loading: false,
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  

  useEffect(() => {
    if (!doctorId) return;

    socket.emit("joinDoctorRoom", doctorId);

    socket.on("consultationReady", ({ bookingId }) => {
      toast.info(`Patient joined consultation for booking ${bookingId}`);
      setAppointments(prev =>
        prev.map(a => (a.bookingId === bookingId ? { ...a, patientJoined: true } : a))
      );
    });

    socket.on("appointmentUpdate", data => {
      toast.info(`Appointment ${data.status}`);
      fetchAppointments();
    });

    socket.on("appointmentRescheduled", data => {
      toast.info(`Appointment rescheduled to ${data.newDate} ${data.newTime}`);
      fetchAppointments();
    });

    return () => {
      socket.off("consultationReady");
      socket.off("appointmentUpdate");
      socket.off("appointmentRescheduled");
    };
  }, [doctorId]);

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.get(`/api/doctors/${doctorId}/appointments`);
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      // Send update to backend
      await doctorAPI.put(`/api/appointments/${appointmentId}/status`, { status });
      toast.success(`Appointment ${status}`);

      // Update local state
      setAppointments(prev =>
        prev.map(a => a.bookingId === appointmentId ? { ...a, status } : a)
      );

      // Optionally, notify patient via socket
      socket.emit("appointmentStatusChanged", { appointmentId, status });

    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };


  const handleReschedule = async (appointment) => {
    const doctorId =
      appointment?.doctortype === "lobby" ? appointment.lobbyDoctor : appointment.doctors;

    if (!doctorId) {
      toast.error("Cannot fetch slots: doctor not assigned");
      return;
    }

    setRescheduleInfo({
      open: true,
      booking: appointment,
      date: appointment.slot?.date || "", // pre-populate the date if available
      slots: [], // initially empty slots
      slotId: "",
      time: "",
      loading: false,
    });

    try {
      // Fetch available slots only once after selecting the date
      const res = await doctorAPI.get(`/api/doctors/${doctorId}/slots`, {
        params: { date: appointment.slot?.date },
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
      setRescheduleInfo((prev) => ({ ...prev, slots: [], loading: false }));
      // toast.error("Failed to fetch available slots");
    }
  };

  const confirmReschedule = async () => {
    if (!rescheduleInfo.slotId) {
      toast.error("Please select a slot");
      return;
    }

    try {
      // Update the rescheduled appointment with new date/time and slot
      await doctorAPI.put(`/api/doctors/appointments/${rescheduleInfo.booking._id}/reschedule`, {
        newDate: rescheduleInfo.date,
        newTime: rescheduleInfo.time,
        newSlotId: rescheduleInfo.slotId,
      });

      toast.success("Appointment rescheduled");
      setRescheduleInfo({
        open: false,
        booking: null,
        date: "",
        slots: [],
        slotId: "",
        time: "",
        loading: false,
      });
      fetchAppointments(); // Refresh appointments list after reschedule
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule");
    }
  };

  const respondToPatientReschedule = async (bookingId, response) => {
    try {
      const res = await doctorAPI.patch(`/api/doctors/appointments/${bookingId}/respond-patient-request`, {
        response, // "accepted" or "rejected"
      });

      toast.success(`Reschedule request ${response}`);
      fetchAppointments(); // refresh list

      // optionally notify patient via socket
      socket.emit("appointmentUpdate", res.data.booking);
    } catch (err) {
      console.error(err);
      toast.error("Failed to respond to reschedule request");
    }
  };


  // const confirmReschedule = async () => {
  //   if (!rescheduleInfo.slotId) {
  //     toast.error("Please select a slot");
  //     return;
  //   }

  //   try {
  //     await doctorAPI.put(`/api/doctors/appointments/${rescheduleInfo.booking._id}/reschedule`, {
  //       newDate: rescheduleInfo.date,
  //       newTime: rescheduleInfo.time,
  //       newSlotId: rescheduleInfo.slotId,
  //     });
  //     toast.success("Appointment rescheduled");
  //     setRescheduleInfo({
  //       open: false,
  //       booking: null,
  //       date: "",
  //       slots: [],
  //       slotId: "",
  //       time: "",
  //       loading: false,
  //     });
  //     fetchAppointments();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to reschedule");
  //   }
  // };

  const confirmCancellation = async () => {
    // if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await doctorAPI.put(`/api/booking/${cancelInfo.booking._id}/cancel`, { reason: cancelInfo.reason });
      toast.success("Appointment cancelled");
      fetchAppointments();
      setCancelInfo({
        open: false,
        booking: null,
        reason: ""}
        )
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };



  const handleJoinConsultation = async (appointment, type) => {
    try {
      const channelName = appointment.orderId;
      const patientId = appointment.user._id
      const patientName = appointment.patient.name
      const uid = Math.floor(Math.random() * 100000);
      const res = await doctorAPI.get(`/api/consultations/getAgoratoken`, {
        params: { channelName, uid, doctorId, type },
      });
      const { token } = res.data;
      const basePath =
        type === "video"
          ? "/doctorconsultation/video"
          : type === "audio"
            ? "/doctorconsultation/audio"
            : "/doctorconsultation/chat";
      window.location.href = `${basePath}?channelName=${channelName}&uid=${uid}&token=${token}&patientId=${appointment.user._id}&bookingId=${appointment._id}&doctorType=${appointment.doctortype}&doctorId=${doctorId}&patientId=${patientId}&patientName=${patientName}`;
    } catch {
      toast.error("Unable to start consultation");
    }
  };

  const viewBookingDetails = appointment => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const getJoinButtonLabel = type => {
    if (type.toLowerCase() === "video") return "🎥 Join Video";
    if (type.toLowerCase() === "audio") return "🎧 Join Audio";
    if (type.toLowerCase() === "chat") return "💬 Join Chat";
    if (type.toLowerCase() === "hybrid") return "🎥 Join Video";
    return "Join";
  };

  const getConsultationType = type => (type.toLowerCase() === "hybrid" ? "video" : type.toLowerCase());

  console.log("appointments>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",appointments)

  return (
    <div>
      <div className="profilecobntent">
        <h3>Appointments</h3>
      </div>
      <div className="form-data-abcd">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Sr.no</th>
                <th>Patient</th>
                <th>Booked on</th>
                <th>Slot Date</th>
                <th>Slot Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, index) => (
                <tr key={a.bookingId}>
                  <td>{index + 1}</td>
                  <td>{a?.patient?.name}</td>
                  <td>
                    {a?.createdAt
                      ? (() => {
                        const d = new Date(a.createdAt);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()
                      : "-"}
                  </td>

                  <td>{formatDate(a.date)}</td>
                  <td>{a.startTime || "-"}</td>
                  <td>{a.status}</td>
                  <td>
                    <Button size="sm" variant="info" onClick={() => viewBookingDetails(a)} className="me-2">
                      View
                    </Button>

                    {a.status === "pending" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => handleStatusChange(a.bookingId, "accepted")} className="me-2">
                          Accept
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleStatusChange(a.bookingId, "rejected")} className="me-2">
                          Reject
                        </Button>
                      </>
                    )}

                    {a.status !== "completed" && a.status !== "cancelled" && (
                      // <Button size="sm" variant="dark" onClick={() => handleCancel(a.bookingId)} className="me-2">
                      //   Cancel
                      // </Button>
                      <Button size="sm" variant="dark"
                        className="me-2"
                        onClick={() =>
                          setCancelInfo({ open: true, booking:a, reason: "" })
                        }
                      >
                        Cancel
                      </Button>

                    )}

                    {a.status !== "completed" && a.status !== "cancelled" && a.status !== "rescheduled" && (
                      <Button size="sm" variant="warning" onClick={() => handleReschedule(a)} className="me-2">
                        Reschedule
                      </Button>
                    )}

                    {a.status == "reschedule_requested" && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => respondToPatientReschedule(a._id, "accepted")}
                          className="me-2"
                        >
                          Accept Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => respondToPatientReschedule(a._id, "rejected")}
                          className="me-2"
                        >
                          Reject Reschedule
                        </Button>
                      </>
                    )}


                    {(a.status === "confirmed" || a.status === "rescheduled") && a.consultationType && (
                      <Button
                        size="sm"
                        variant={"primary"}
                        onClick={() => handleJoinConsultation(a, getConsultationType(a.consultationType))}
                      >
                        {getJoinButtonLabel(a.consultationType)}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Reschedule Modal */}
      {/* Reschedule Modal */}
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
              loading: false,
            })
          }
          size="md"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Reschedule Appointment</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* DATE SELECTION */}
            <div className="mb-3">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                value={rescheduleInfo.date}
                onChange={async (e) => {
                  const selectedDate = e.target.value;

                  if (!selectedDate) return;

                  const doctorId =
                    rescheduleInfo.booking.doctortype === "lobby"
                      ? rescheduleInfo.booking.lobbyDoctor
                      : rescheduleInfo.booking.doctors;

                  if (!doctorId) {
                    toast.error("Cannot fetch slots: doctor not assigned");
                    return;
                  }

                  // Reset previous slot selection and loading
                  setRescheduleInfo((p) => ({
                    ...p,
                    date: selectedDate,
                    slotId: "",
                    time: "",
                    slots: [],
                    loading: true,
                  }));

                  try {
                    const res = await doctorAPI.get(`/api/doctors/${doctorId}/slots`, {
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

                    setRescheduleInfo((p) => ({
                      ...p,
                      slots: availableSlots,
                      loading: false,
                    }));
                  } catch (err) {
                    console.error(err);
                    setRescheduleInfo((p) => ({ ...p, slots: [], loading: false }));
                    toast.error("Failed to fetch available slots");
                  }
                }}
              />
            </div>

            {/* SLOT SELECTION: show only if slots fetched */}
            {rescheduleInfo.date && (
              <div className="mb-3">
                <label className="form-label">Select Slot</label>

                {rescheduleInfo.loading ? (
                  <div className="text-center p-3">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {rescheduleInfo.slots.length === 0 ? (
                      <p className="text-muted">No slots available for selected date</p>
                    ) : (
                      rescheduleInfo.slots.map((s) => {
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
                      })
                    )}
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
                  loading: false,
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


      {/* Booking Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>
                <strong>Patient Name:</strong> {selectedAppointment.patient?.name || selectedAppointment.user.name}
              </p>
              <p>
                <strong>Contact:</strong> {selectedAppointment.patient?.phone || selectedAppointment.user.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedAppointment.address?.flatNo}, {selectedAppointment.address?.street},{" "}
                {selectedAppointment.address?.city}
              </p>
              <p>
                <strong>Consultation Type:</strong> {selectedAppointment.consultationType}
              </p>
              <p>
                <strong>Category:</strong> {selectedAppointment.category?.name || "-"}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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

    </div>
  );
};

export default DoctorAppointments;
