import React, { useState } from "react";
import { Row, Col, Modal, Button, Spinner } from "react-bootstrap";
import { API_URL } from "../../config";

const statusColors = {
    pending: "#f5a623",
    confirmed: "#4d6c5d",
    completed: "#28a745",
    cancelled: "#dc3545",
};

const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} || ${hours}:${minutes}`;
};

const ITEMS_PER_PAGE = 4;

const LabReportsTab = ({ labOrders }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [reportModal, setReportModal] = useState({ open: false, report: null });

    if (!labOrders || labOrders.length === 0) {
        return <div className="text-center py-4 text-muted">No lab reports available.</div>;
    }

    const totalPages = Math.ceil(labOrders.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = labOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const openReport = (report) => setReportModal({ open: true, report });
    const closeReport = () => setReportModal({ open: false, report: null });

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
                        <button className="pagination-number" onClick={() => handlePageChange(1)}>
                            1
                        </button>
                        {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                    </>
                )}

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
                    <button
                        key={number}
                        className={`pagination-number ${currentPage === number ? "active" : ""}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                        <button className="pagination-number" onClick={() => handlePageChange(totalPages)}>
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

    return (
        <div>
            <Row>
                {currentItems.map((order) => (
                    <Col lg={6} key={order._id} className="mb-4">
                        <div className="shadow-sm rounded-4 p-3 border bg-white lab-report-card">
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                <div>
                                    <h6 className="mb-1 fw-semibold text-dark">
                                    Order ID: <span className="text-primary">{order.orderId}</span>
                                    </h6>
                                    <small className="text-muted">{formatDateTime(order.createdAt)}</small>
                                </div>
                                <span
                                    className="px-3 py-1 rounded-pill text-white fw-semibold"
                                    style={{ background: statusColors[order.status] || "#6c757d" }}
                                >
                                    {order.status?.toUpperCase()}
                                </span>
                            </div>

                            <div className="mb-3">
                                <h6 className="text-secondary fw-semibold mb-2">Test Information</h6>
                                {order.testsWithPatients?.map((item, idx) => (
                                    <div key={idx} className="border rounded-3 p-2 mb-2 bg-light">
                                        <div className="fw-semibold">
                                            🧪 {item.testId?.name || item.packageId?.name || "Lab Test"}
                                        </div>
                                        <div className="mt-1">
                                            <strong>Patients:</strong> {item.patients.map((p) => p.name).join(", ")}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-3">
                                <p className="mb-1">
                                    <strong>Address:</strong> {order.address?.flatNo}, {order.address?.city}
                                </p>
                                <p className="mb-1">
                                    <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}
                                </p>
                                <p className="mb-0 fw-semibold text-success">
                                    <strong>Total:</strong> ₹{order.totalAmount}
                                </p>
                            </div>

                            <div className="mt-3 d-flex justify-content-end">
                                {order.reportUrls && order.reportUrls.length > 0 && (
                                    <button
                                        className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                        onClick={() => openReport(order)}
                                    >
                                        View Report
                                    </button>
                                )}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {totalPages > 1 && renderPagination()}

            {/* Modal to View Report */}
            {reportModal.open && (
                <Modal
                    show={reportModal.open}
                    onHide={() => setReportModal({ open: false, report: null })}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Report Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Order ID:</strong> {reportModal.report.orderId}</p>
                        <p><strong>Date:</strong> {formatDateTime(reportModal.report.createdAt)}</p>
                        <p><strong>Status:</strong> {reportModal.report.status}</p>

                        {reportModal.report.testsWithPatients?.map((item, idx) => (
                            <div key={idx} className="border rounded-3 p-2 mb-2 bg-light">
                                <div className="fw-semibold">
                                    🧪 {item.testId?.name || item.packageId?.name || "Lab Test"}
                                </div>
                                <div className="mt-1">
                                    <strong>Patients:</strong> {item.patients.map((p) => p.name).join(", ")}
                                </div>
                            </div>
                        ))}

                        {/* Downloadable Reports */}
                        {reportModal.report.reportUrls && reportModal.report.reportUrls.length > 0 && (
                            <div className="mt-3">
                                <h6 className="fw-semibold">Download Reports</h6>
                                {reportModal.report.reportUrls.map((url, index) => (
                                    <div key={index} className="mb-2">
                                        <a
                                            href={`${API_URL}${url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            Download Report {index + 1}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setReportModal({ open: false, report: null })}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
};

export default LabReportsTab;
