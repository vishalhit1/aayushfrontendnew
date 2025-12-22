import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import { AuthContext } from "../../context/AuthContext";

const LobbyDoctorStart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartBooking = async () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }

    setLoading(true);
    // Simulate short delay for UX (optional)
    setTimeout(() => {
      navigate("/lobby-doctor/category");
      setLoading(false);
    }, 300);
  };

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Consult Doctor
                  </li>
                  <li className="breadcrumb-item active">Lobby Doctor</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container lobby-booking-container">
        <div className="lobby-booking-wrapper">
          <div className="card lobby-booking-card">
            <div className="card-body lobby-booking-card-body">
              <div>
                <i className="bi bi-hospital lobby-booking-icon"></i>
                <h2 className="lobby-booking-title">Lobby Doctor Booking</h2>
                <p className="lobby-booking-description">
                  Welcome! Book your appointment with our experienced doctors in just a few simple steps.
                </p>
              </div>

              <div className="lobby-booking-btn-wrapper">
                <button
                  className="btn btn-primary lobby-booking-btn"
                  onClick={handleStartBooking}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="bi bi-hourglass-split me-2"></i> Please wait...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-check"></i> Start Booking
                    </>
                  )}
                </button>
              </div>

              <div className="lobby-booking-footer">
                <small>Quick, easy, and secure appointment scheduling</small>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="lobby-booking-features">
            <div className="lobby-feature-item">
              <i className="bi bi-clock-history lobby-feature-icon"></i>
              <p className="lobby-feature-text">Fast Booking</p>
            </div>
            <div className="lobby-feature-item">
              <i className="bi bi-shield-check lobby-feature-icon"></i>
              <p className="lobby-feature-text">Secure & Private</p>
            </div>
            <div className="lobby-feature-item">
              <i className="bi bi-people lobby-feature-icon"></i>
              <p className="lobby-feature-text">Expert Doctors</p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default LobbyDoctorStart;
