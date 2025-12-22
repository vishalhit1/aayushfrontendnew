import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import API from "../../api/axios";
import { toast } from "react-toastify";
import "../../styles/doctorLogin.css";
import logos from "../../assets/logo.png"
import DoctorForgotPassword from "./DoctorForgotPassword";

const DoctorLogin = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const isExpired = params.get("session") === "expired";

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    mobile: "",
    password: "",
    otp: "",
  });
  const [loginMode, setLoginMode] = useState("email"); // 'email' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);



  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  // Send OTP
  const sendOtp = async () => {
    if (!loginData.email) {
      toast.error("Please enter email or mobile");
      return;
    }
    try {
      await API.post("/api/doctors/sendloginotp", {
        email: loginData.email,
      });
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };
  // Login handler
  const handleLogin = async () => {
    try {
      let res;
      if (loginMode === "otp") {
        if (!loginData.otp) {
          toast.error("Enter OTP");
          return;
        }
        res = await API.post("/api/doctors/login-otp", {
          email: loginData.email,
          mobile: loginData.mobile,
          otp: loginData.otp,
        });
      } else {
        if (!loginData.email || !loginData.password) {
          toast.error("Enter email and password");
          return;
        }
        res = await API.post("/api/doctors/login", {
          email: loginData.email,
          password: loginData.password,
        });
      }
      const { token, doctor } = res.data;
      localStorage.setItem("doctorToken", token);
      localStorage.setItem("doctorInfo", JSON.stringify(doctor));
      toast.success("Login successful!");
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };
  // Forgot password
  const handleForgotPassword = async () => {
    if (!loginData.email) {
      toast.error("Enter email or mobile");
      return;
    }
    try {
      await API.post("/api/doctors/forgot-password", {
        email: loginData.email,
      });
      toast.success("Reset link/OTP sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
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
              <h2>Doctor Login</h2>

              <div className="form-content-abcd">
                {/* Email field */}
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {loginMode === "email" ? (
                  <>
                    {/* Password login */}
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button className="send-otp-new" onClick={handleLogin}>
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    {!otpSent ? (
                      <button className="send-otp-new" onClick={sendOtp}>
                        Send OTP
                      </button>
                    ) : (
                      <>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="otp"
                            value={loginData.otp}
                            onChange={handleChange}
                            required
                          />
                          <label>Enter OTP</label>
                        </div>
                        <button
                          className="login-via-otp"
                          onClick={handleLogin}
                          disabled={!otpSent}
                        >
                          Login via OTP
                        </button>
                        <button className="otp-resends" onClick={sendOtp}>
                          Resend OTP
                        </button>
                      </>
                    )}
                  </>
                )}

                <button
                  className="login-methods"
                  onClick={() =>
                    setLoginMode(loginMode === "otp" ? "email" : "otp")
                  }
                >
                  Switch to {loginMode === "otp" ? "Email/Password Login" : "OTP Login"}
                </button>

                <button className="forgot-password" onClick={() => setShowForgotModal(true)}>
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='copy-right' style={{ marginTop: '100px' }}>
        <p>© Copyright 2025 by www.aayushlabs.com</p>
      </div>

      {showForgotModal && (
        <DoctorForgotPassword
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
        />
      )}
    </>
  );
};

export default DoctorLogin;
