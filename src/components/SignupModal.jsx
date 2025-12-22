import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import CompleteProfileModal from "./CompleteProfileModal.jsx";
import { toast } from "react-toastify";
const SignupModal = ({ isOpen, onClose }) => {
  const { signup, sendOtp, googleLogin } = useContext(AuthContext);
  const [step, setStep] = useState("form"); // form | otp
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    otp: ""
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New: hide signup modal state triggered by Google login
  const [hideSignupOnGoogle, setHideSignupOnGoogle] = useState(false);
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);
  // Reset all data when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setHideSignupOnGoogle(false);
    }
  }, [isOpen]);
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      password: "",
      otp: "",
    });
    setErrors({});
    setShowPassword(false);
    setStep("form");
    setResendTimer(0);
  };
  const validateField = (field, value) => {
    let err = "";
    switch (field) {
      case "name":
        if (!value.trim()) err = "Name is required";
        break;
      case "email":
        if (!value) err = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) err = "Email is invalid";
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) err = "Enter valid 10-digit mobile";
        break;
      case "password":
        if (!value) err = "Password is required";
        else if (value.length < 6) err = "Min 6 characters";
        break;
      case "dob":
        if (!value) err = "Date of Birth is required";
        break;
      case "gender":
        if (!value) err = "Gender is required";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: err }));
    return err === "";
  };
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const valid =
      validateField("name", form.name) &&
      validateField("email", form.email) &&
      validateField("phone", form.phone) &&
      validateField("password", form.password) &&
      validateField("dob", form.dob) &&
      validateField("gender", form.gender);
    if (!valid) {
      toast.error("Please fill all required fields correctly.");
      setIsSubmitting(false);
      return;
    }
    try {
      const otpSent = await sendOtp({ email: form.email, phone: form.phone });
      if (otpSent) {
        // toast.success("OTP sent successfully!");
        setStep("otp");
        setResendTimer(30);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error while sending OTP:", err);
      toast.error("Something went wrong while sending OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOtpVerify = async () => {
    try {
      const success = await signup(form);
      if (success) {
        // toast.success("Signup successful!");
        onClose();
      } else {
        setErrors({ otp: "Invalid OTP" });
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    setHideSignupOnGoogle(true); // hide signup modal immediately
    const data = await googleLogin(credentialResponse);
    if (!data) {
      setHideSignupOnGoogle(false); // revert if login fails
      return;
    }
    if (!data.isComplete) {
      setGoogleUser(data.user);
      setShowProfileModal(true);
      if (onClose) onClose(); // hide the signup modal
    } else {
      setShowProfileModal(false);
      if (onClose) onClose();
    }
  };
  const handleResendOtp = async () => {
    try {
      const otpSent = await sendOtp({ email: form.email, phone: form.phone });
      if (otpSent) {
        // toast.success("OTP resent successfully!");
        setResendTimer(30);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch {
      toast.error("Error resending OTP. Try again later.");
    }
  };
  const allowOnlyNumbers = (value) => {
    return value?.replace(/\D/g, "") || "";
  };
  // If SignupModal should be hidden due to Google login, show only CompleteProfileModal if applicable
  if (!isOpen || hideSignupOnGoogle) {
    return showProfileModal && googleUser ? (
      <CompleteProfileModal
        isOpen={true}
        user={googleUser}
        onClose={() => {
          setShowProfileModal(false);
          setGoogleUser(null);
        }}
      />
    ) : null;
  }
  return (
    <>
      <Modal 
      size="lg" 
      show={isOpen && !hideSignupOnGoogle} 
      backdrop="static"
      onHide={onClose} 
      centered
      keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="sign-up-in">{step === "form" ? "Sign Up" : "Verify OTP"}</Modal.Title>
        </Modal.Header>
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--bs-secondary-color)!important" }}>
            Are you a doctor?{" "}
            <span
              style={{
                color: "#007BFF",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                onClose();
                window.location.href = "/doctor/register";
              }}
            >
              Register here
            </span>
          </p>
        </div>
        <Modal.Body className="modal-reg-login">
          {step === "form" && (
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={allowOnlyNumbers(form.phone)}
                      maxLength={10}
                      placeholder="Enter your mobile number"
                      onChange={(e) => handleChange("phone", e.target.value)}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" value={form.dob} onChange={(e) => handleChange("dob", e.target.value)} />
                  </Form.Group>
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select value={form.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                      <option value="" hidden>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        isInvalid={!!errors.password}
                      />
                      <Button className="see-password-news" onClick={() => setShowPassword((prev) => !prev)}>
                        <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                      </Button>
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </div>
              </div>
              <Button type="submit" className="login-button-login" disabled={isSubmitting}>
                Send OTP
              </Button>
            </Form>
          )}
          {step === "otp" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OTP sent to your mobile"
                  value={form.otp}
                  onChange={(e) => setForm((prev) => ({ ...prev, otp: e.target.value }))}
                  isInvalid={!!errors.otp}
                />
                <Form.Control.Feedback type="invalid">{errors.otp}</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" onClick={handleOtpVerify} className="w-100">
                Verify & Register
              </Button>
              <div style={{ marginTop: "10px" }}>
                {resendTimer > 0 ? (
                  <p style={{ color: "gray" }}>Resend OTP in {resendTimer}s</p>
                ) : (
                  <Button variant="primary" className="w-100" onClick={handleResendOtp}>
                    Resend OTP
                  </Button>
                )}
              </div>
            </>
          )}
          <div className="d-flex align-items-center mb-3 mt-3">
            <hr className="flex-grow-1" />
            <span className="px-3 text-muted">OR</span>
            <hr className="flex-grow-1" />
          </div>
          <div className="mt-3 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                setHideSignupOnGoogle(false);
                console.log("Google Signup Failed");
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
      {/* CompleteProfileModal shown independently */}
      {showProfileModal && googleUser && (
        <CompleteProfileModal
          isOpen={showProfileModal}
          user={googleUser}
          onClose={() => {
            setShowProfileModal(false);
            setGoogleUser(null);
          }}
        />
      )}
    </>
  );
};
export default SignupModal;