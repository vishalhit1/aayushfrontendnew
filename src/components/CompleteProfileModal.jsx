import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";

const CompleteProfileModal = ({ isOpen, onClose, user }) => {
  const { completeProfile } = useContext(AuthContext);
  const [phone, setPhone] = useState(user.phone || "");
  const [dob, setDob] = useState(user.dob ? user.dob.split("T")[0] : "");
  const [gender, setGender] = useState(user.gender || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await completeProfile({ phone, dob, gender });

    setLoading(false);

    if (success) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          phone,
          dob,
          gender,
        })
      );

      onClose();
      window.location.href = "/";
    }
  };

  return (
    <Modal show={isOpen}  size="lg" onHide={onClose} centered backdrop="static"
    keyboard={false}>
      <Modal.Header>
        <Modal.Title>Complete Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-reg-login">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="phone" className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="dob" className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="gender" className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" disabled={loading} className="login-button-login">
            {loading ? "Saving..." : "Save"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CompleteProfileModal;