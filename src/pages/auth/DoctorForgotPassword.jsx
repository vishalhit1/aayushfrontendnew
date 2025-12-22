import React, { useState } from "react";
import API from "../../api/axios.js";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const DoctorForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let err = "";
    if (name === "email") {
      if (!value) err = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) err = "Email is invalid";
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err === "";
  };

  const handleChange = (name, value) => {
    if (name === "email") setEmail(value);
    validateField(name, value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateField("email", email)) return;

    try {
      setLoading(true);
      const { data } = await API.post("/api/doctors/forgot-password", { email });
      setMessage("✅ Password reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="lg" show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="sign-up-in">Forgot Password</Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-reg-login">
        <Form onSubmit={handleForgotPassword}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>

        {message && (
          <Alert
            variant={
              message.toLowerCase().includes("sent") ? "success" : "danger"
            }
            className="mt-3 mb-0 text-center"
          >
            {message}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DoctorForgotPassword;
