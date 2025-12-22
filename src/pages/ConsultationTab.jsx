import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { Row, Modal, Button, Spinner } from "react-bootstrap";

const statusColors = {
    pending: "#f5a623",
    confirmed: "#4d6c5d",
    completed: "#28a745",
    canceled: "#dc3545",
};

const ConsultationTab = ({ consultations }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [cancelInfo, setCancelInfo] = useState({
        open: false,
        booking: null,
        reason: "",
    });

    const [loading, setLoading] = useState(false);



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
            )}&patientId=${patientId}&doctorId=${doctorId}&bookingId=${bookingId}`;
        } catch (err) {
            console.error(err);
            alert("Failed to join consultation");
        }
    };

    // Cancel confirmation API call
    const confirmCancellation = async () => {
        try {
            setLoading(true);
            const endpoint = `/api/booking/doctors/${cancelInfo.booking._id}/cancel`;
            const res = await API.put(endpoint, { reason: cancelInfo.reason });
            alert(`Booking cancelled successfully! Refund: ₹${res.data.refundAmount}`);
            // Update local list (optional)
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to cancel booking.");
        } finally {
            setCancelInfo({ open: false, booking: null, reason: "" });
            setLoading(false);
        }
    };

    const handleCancel = (booking) => {
        setCancelInfo({ open: true, booking, reason: "" });
    };

    const allowOnlyNumbers = (value) => {
        return value?.replace(/\D/g, "") || "";
      };
      if (loading) {
        return (
          <div className="fullpage-loader">
            <div className="spinner"></div>
          </div>
        );
      }

      const formatDate = (dateStr) => {
        if (!dateStr) return "N/A"; // fallback if no date
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };
      
    const renderBookingCard = (booking) => (
        <Row>
            <div className="col-lg-12">
                <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                        <span>{new Date(booking.createdAt).toLocaleString()}</span>
                        <span
                            className="status-badge"
                            style={{ background: statusColors[booking.status] || "#ccc" }}
                        >
                            {booking.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="booking-overview">
                        <p><strong>Patient Name:</strong> {booking.patient?.name}</p>
                        <p><strong>Patient Age:</strong> {booking.patient?.age} yrs</p>
                        <p><strong>Patient Address:</strong> {booking.address?.flatNo}, {booking.address?.city}</p>
                        <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
                        <p><strong>Doctor Name:</strong> {booking.type == "lobby" ? booking.lobbyDoctor?.name : booking.type == "specialist" ? booking.doctors?.name : "N/A " }</p>
                        <p><strong>Slot:</strong> {formatDate(booking.slot.date)} || {booking.slot.startTime}</p>
                        <p><strong>Total Cost:</strong> ₹{booking.totalAmount}</p>
                    </div>

                    <div className="booking-actions">
                        {booking.status === "confirmed" && booking.consultationType && (
                            <button
                                className="join-consultation-btn"
                                onClick={() => handleJoinConsultation(booking)}
                            >
                                Join {booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)} Consultation
                            </button>
                        )}

                        {(booking.status === "pending" || booking.status === "confirmed") && (
                            <button className="cancel-btn-booking" onClick={() => handleCancel(booking)}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Row>
    );

    if (!consultations || consultations.length === 0) {
        return <div className="nobookingneeded">No doctor consultations booked yet.</div>;
    }

    // Calculate pagination
    const totalPages = Math.ceil(consultations.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = consultations.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return (
            <div className="pagination-container">
                <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            className="pagination-number"
                            onClick={() => handlePageChange(1)}
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                    </>
                )}

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
                    <button
                        key={number}
                        className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                        <button
                            className="pagination-number"
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    console.log("consultations",consultations)

    return (
        <div>
            <div>
                <div className="row">
                    {currentItems.map(b => (
                        <div className="col-lg-6" key={b._id}>
                            {renderBookingCard(b)}
                        </div>
                    ))}
                </div>

            </div>
            {totalPages > 1 && renderPagination()}


            {/* Cancel Modal */}
            {cancelInfo.open && (
                <Modal
                    show={cancelInfo.open}
                    onHide={() =>
                        setCancelInfo({ open: false, booking: null, reason: "" })
                    }
                    size="md"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="title-abcds-cancel">
                            Cancellation Rules
                        </Modal.Title>
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
                                Refund processed to{" "}
                                <strong>Original payment method</strong>.
                            </li>
                        </ul>
                        <label className="reason-label-cancel">
                            Reason for cancellation (optional):
                        </label>
                        <textarea
                            value={cancelInfo.reason}
                            onChange={(e) =>
                                setCancelInfo((prev) => ({
                                    ...prev,
                                    reason: e.target.value,
                                }))
                            }
                            placeholder="Enter reason"
                            rows={3}
                            style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Please Wait...
                            </>
                        ) : (
                            <Button variant="danger" onClick={confirmCancellation}>
                                Confirm Cancel
                            </Button>
                        )
                        }
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setCancelInfo({ open: false, booking: null, reason: "" })
                            }
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>

    );
};

export default ConsultationTab;