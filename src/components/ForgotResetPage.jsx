import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Form, Alert, Spinner  } from "react-bootstrap";
import { toast } from "react-toastify";
import "../styles/doctorLogin.css";
import logos from "../assets/logo.png"
import API from "../api/axios";

const ForgotResetPage = () => {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return setErrors({ password: "Password is required" });
    if (newPassword !== confirmPassword)
      return setErrors({ confirm: "Passwords do not match" });

    try {
      setLoading(true);
      const { data } = await API.post(`/api/users/reset-password/${token}`, {
        password: newPassword,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/"), 2000); // redirect to login after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setErrors({ confirm: "Passwords do not match" });
    } else {
      setErrors({});
    }
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (newPassword && newPassword !== e.target.value) {
      setErrors({ confirm: "Passwords do not match" });
    } else {
      setErrors({});
    }
  };



  return (
    <>
      <div className="top-header-bar">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="contact-info">
                <a href="tel:6295550129">
                  <i className="fa fa-phone" />
                  (629) 555-0129
                </a>
                <a href="mailto:info@example.com">
                  <i className="fa fa-envelope" />
                  info@example.com
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-none d-md-block">
              <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i class="fa-brands fa-facebook"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                  <i className="fa-brands fa-pinterest" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fa-brands fa-instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="logo-login">
        <Link to="/"><img src={logos} alt="" /></Link>
      </div>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="login-space">
              <h2>Reset Password</h2>

              <div className="form-content-abcd">
                {/* Email field */}
                <div className="form-group">
                  <label>New Password</label>
                  <div className="confirm-password">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      value={newPassword}
                      onChange={handlePasswordChange}
                      className={
                        errors.password
                          ? "invalid form-control"
                          : newPassword
                            ? "valid form-control"
                            : "form-control"
                      }
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                    </Button>
                  </div>
                </div>
                {errors.password && <span className="error-msg">{errors.password}</span>}

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="confirm-password">
                    <input
                      type={showconfirmPassword ? "text" : "password"}
                      placeholder=" "
                      value={confirmPassword}
                      onChange={handleConfirmChange}
                      className={
                        errors.confirm
                          ? "invalid form-control"
                          : confirmPassword
                            ? "valid form-control"
                            : "form-control"
                      }
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      <i className={showconfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                    </Button>
                  </div>
                </div>

                <button
                  className="login-methods"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
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
                    "Reset Password"
                  )}
                </button>

              </div>
              {/* {message && <p>{message}</p>} */}
              {errors.confirm && (
                <Alert
                  variant={"danger"}
                  className="mt-3 mb-0 text-center"

                >
                  <span className="error-msg">{errors.confirm}</span>
                </Alert>
              )}
              {message && (
                <Alert
                  variant={
                    message.toLowerCase().includes("sent") ||
                      message.toLowerCase().includes("success")
                      ? "success"
                      : "danger"
                  }
                  className="mt-3 mb-0 text-center"
                >
                  {message}
                </Alert>
              )}


            </div>
          </div>
        </div>
      </div>
      <div className='copy-right' style={{ marginTop: '100px' }}>
        <p>© Copyright 2025 by www.aayushlabs.com</p>
      </div>
    </>
  );
};

export default ForgotResetPage;
