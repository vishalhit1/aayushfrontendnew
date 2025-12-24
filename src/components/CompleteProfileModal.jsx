import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
const CompleteProfileModal = ({ isOpen, onClose, user }) => {
  const { completeProfile } = useContext(AuthContext);
  const [phone, setPhone] = useState(user.phone || "");
  const [dob, setDob] = useState(user.dob ? user.dob.split("T")[0] : "");
  const [gender, setGender] = useState(user.gender || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    // Phone validation
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    // DOB validation
    if (!dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(dob);
      const today = new Date();
      if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      } else {
        const age =
          today.getFullYear() -
          dobDate.getFullYear() -
          (today < new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate()) ? 1 : 0);
        if (age < 1) {
          newErrors.dob = "Age must be at least 1 year";
        }
      }
    }
    // Gender validation
    if (!gender) {
      newErrors.gender = "Please select gender";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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
    <Modal show={isOpen} size="lg" onHide={onClose} centered backdrop="static"
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
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="dob" className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              isInvalid={!!errors.dob}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dob}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="gender" className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              isInvalid={!!errors.gender}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.gender}
            </Form.Control.Feedback>
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