import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import CompleteProfileModal from "./CompleteProfileModal.jsx";
import ForgotResetModal from "./ForgotResetModal.jsx";


const LoginModal = ({ isOpen, onClose }) => {
  const { login, googleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;
  // Validation
  const validateField = (name, value) => {
    let err = "";
    if (name === "email") {
      if (!value) err = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) err = "Email is invalid";
    }
    if (name === "password") {
      if (!value) err = "Password is required";
      else if (value.length < 6) err = "Password must be at least 6 characters";
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err === "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);
    if (!emailValid || !passwordValid) return;
    const success = await login(email, password);
    if (success) {
      // toast.success("Logged in successfully");
      onClose(); // ✅ close the modal
      window.location.reload();
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    const data = await googleLogin(credentialResponse);
    if (!data) return;
    if (!data.isComplete) {
      setGoogleUser(data.user);

      setShowProfileModal(true);
    } else {
      onClose();
    }
  };
  const handleDoctorRedirect = () => {
    onClose();
    window.location.href = "/doctor/login";
  };

  return (
    <>
    {(!showProfileModal && (
       
      <Modal 
       show={isOpen && !showForgotModal}
        onHide={onClose}
        centered
        backdrop="static"
        size="lg"
        keyboard={false}
         >
        <Modal.Header closeButton>
          <Modal.Title className="sign-up-in">Sign In Your Account</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-reg-login">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => validateField("email", e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => validateField("password", e.target.value)}
                  isInvalid={!!errors.password}
                />
                <Button
                className="see-password-news"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button type="submit" className="login-button-login">
              Login
            </Button>
          </Form>

          <div className="text-center mb-3">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </Button>
          </div>

          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1" />
            <span className="px-3 text-muted">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <div className="text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google Login Failed");
              }}
            />
          </div>
          <div className="text-center mt-4">
            <p className="mb-0 text-muted">
              Are you a doctor?{" "}
              <a
              style={{cursor:'pointer'}}
                className=" text-center"
                onClick={handleDoctorRedirect}
              >
                Login here
              </a>
            </p>
          </div>
        </Modal.Body>
      </Modal>
      ))}

      {showProfileModal && googleUser && (
        <CompleteProfileModal
          isOpen={showProfileModal}
          user={googleUser}
          onClose={() => {
            setShowProfileModal(false);
            onClose();
          }}
        />
      )}

      {showForgotModal && (
        <ForgotResetModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
        />
      )}
    </>
  );
};

export default LoginModal;