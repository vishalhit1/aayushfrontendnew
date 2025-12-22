import React from "react";
import { Modal, Button } from "react-bootstrap";

const RefundModal = ({ isOpen, onClose, refundAmount }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered >
      <Modal.Header closeButton>
        <Modal.Title className="title-abcds-cancel">Booking Cancelled</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your booking has been cancelled successfully.</p>
        <p>
          <strong>Refund Amount:</strong> ₹{refundAmount}
        </p>
        <p>The amount has been added to your wallet.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RefundModal;
