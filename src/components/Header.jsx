import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { LocationContext } from "../context/LocationContext.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import logos from "../assets/logo.png"
import newlogo from "../assets/logonew.png"
import navbars from "../assets/icons/navbar.svg"
import "../styles/navbar.css"
import API from "../api/axios.js";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { city, setCity, pincode, setPincode } = useContext(LocationContext);
  const [citylist, setCityList] = useState([]);
  // const [city, setCity] = useState("Mumbai");
  // const [pincode, setPincode] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { doctorCart, labCart, clearDoctorCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    consultDoctors: false,
    forDoctors: false,
  });
  const dropdownRef = useRef();

  // ADD: Ref for city dropdown
  const cityDropdownRef = useRef();

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo"));
  const doctorToken = localStorage.getItem("doctorToken");
  const isDoctor = !!doctorToken && !!doctorInfo;

  // New State for Popup Confirm
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [pendingAutoCity, setPendingAutoCity] = useState(null);
  const [pendingAutoPincode, setPendingAutoPincode] = useState(null);
  const [checkingDetect, setCheckingDetect] = useState(false);

  // Save the previous auto-detected city/pincode for reference when confirming
  const [lastDetectedCity, setLastDetectedCity] = useState("");
  const [lastDetectedPincode, setLastDetectedPincode] = useState("");

  // Close dropdown if clicked outside
  useEffect(() => {
    fetchCities()
    // Remove auto-detect here, now only called after confirm
    //detectLocation()
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // ADD: Close city dropdown if clicked outside as well
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCities = async () => {
    try {
      const res = await API.get("/api/commonmaster/getActiveCities");
      setCityList(res.data.data || []);
    } catch {
      console.log("Failed to load cities");
    }
  };

  // Show popup if city is not already current location
  const handleDetectLocationClick = () => {
    setCheckingDetect(true);
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      setCheckingDetect(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const foundCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state;
          const foundPincode = data?.address?.postcode;
          // If already matched, just set directly, else confirm popup
          if (
            (city && foundCity && city.trim().toLowerCase() === foundCity.trim().toLowerCase()) ||
            (!foundCity && city === "")
          ) {
            setCity(foundCity);
            setPincode(foundPincode);
          } else {
            setPendingAutoCity(foundCity || "");
            setPendingAutoPincode(foundPincode || "");
            setLastDetectedCity(foundCity || "");
            setLastDetectedPincode(foundPincode || "");
            setLocationPopupOpen(true);
          }
        } catch (err) {
          console.error("Reverse geocode error:", err);
          alert("Could not detect your city.");
        } finally {
          setCheckingDetect(false);
        }
      },
      (err) => {
        setCheckingDetect(false);
        console.error("Location permission denied:", err);
        alert("Could not access your location.");
      }
    );
  };

  // Detect location and set city/pincode directly (used only after confirming)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const foundCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state;
          const foundPincode = data?.address?.postcode;
          setCity(foundCity);
          setPincode(foundPincode);
          setLocationPopupOpen(false);
          setPendingAutoCity(null);
          setPendingAutoPincode(null);
        } catch (err) {
          console.error("Reverse geocode error:", err);
        }
      },
      (err) => {
        console.error("Location permission denied:", err);
      }
    );
  };

  // Prevent body scroll when offcanvas is open
  useEffect(() => {
    if (offcanvasOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [offcanvasOpen]);

  const doctorLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorInfo");
    localStorage.clear()
    navigate("/");
  };

  const clearCartData = () => {
    localStorage.removeItem("doctorCart");
    localStorage.removeItem("labCart");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("selectedPatient");
    localStorage.removeItem("selectedSlot");
    localStorage.removeItem("preferredLanguage");
    localStorage.removeItem("consultationType");
    localStorage.removeItem("totalAmount");
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setCity(data.address.city || data.address.town || data.address.village || "Mumbai");
          } catch (err) {
            console.error(err);
            alert("Failed to fetch city from location");
          }
        },
        (err) => {
          console.error(err);
          alert("Permission denied for location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const toggleMobileDropdown = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCities = citylist.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // const handleSearch = async () => {
  //   if (!search.trim()) return;

  //   try {
  //     setSearchLoading(true);
  //     const res = await API.get(`/api/search?query=${encodeURIComponent(search)}`);
  //     // Assuming the API returns an array of results
  //     setSearchResults(res.data.data || []);
  //   } catch (err) {
  //     console.error("Search API error:", err);
  //     setSearchResults([]);
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  // const handleSearchSubmit = () => {
  //   if (search.trim() === "") return;
  //   navigate(`/search?q=${encodeURIComponent(search)}`);
  //   setSearch(""); // optional: clear input
  //   setOpen(false); // close city dropdown if open
  // };

  const [items, setItems] = useState([]);
  const handleSearch = async (string) => {
    if (!string.trim()) return;

    const res = await API.get(`/api/search?query=${string}`);
    setItems(res.data.data);
  };

  const handleSelect = (item) => {
    navigate(item.url);
  };

  // Location Popup modal rendering
  const renderLocationConfirmModal = () =>
    locationPopupOpen && pendingAutoCity !== null ? (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          width: "100vw",
          height: "100vh",
          background: 'rgba(0,0,0,0.45)',
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{
          background: "#fff", borderRadius: 12, padding: "32px 24px 24px 24px", minWidth: 280, maxWidth: 350, boxShadow: "0 8px 24px 0 rgba(0,0,0,0.19)"
        }}>
          <h5 className="location-confirm-titlesss" style={{ marginBottom: 16 }}>Use your current location?</h5>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            We detected your location as <b>{pendingAutoCity}</b>
            {pendingAutoPincode && <> (Pincode: <b>{pendingAutoPincode}</b>)</>}
            .
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              onClick={() => {
                setLocationPopupOpen(false);
                setPendingAutoCity(null);
                setPendingAutoPincode(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={detectLocation}
              className="detect-kicationb"
            >
              Yes, Use This
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      {/* Main Header */}
      <header className="main-header">
        <div className="container-fluid">
          <div className="row align-items-center header-content">
            {/* Mobile Menu Toggle - Absolute positioned on mobile */}
            <button
              className="mobile-menu-toggle d-lg-none"
              onClick={() => setOffcanvasOpen(true)}
              aria-label="Open Menu"
            >
              <img src={navbars} alt="" />
            </button>

            {/* Logo */}
            <div className="col-xl-2 col-lg-2 col-md-3 col-12 logo-section">
              <img
                src={logos}
                alt="Aayush Wellness Limited"
                onClick={() => navigate("/")}
                className="logo-img"
              />
            </div>

            {/* Search Section - Hidden on mobile */}
            <div className="col-xl-7 col-lg-6 col-md-9 d-none d-lg-block search-section-wrapper">
              <div className="search-section">
                <div className="city-selector-wrapper">

                  {/* Selected box with Detect button inside */}
                  <div className="city-select-display-wrapper">
                    <div
                      className="city-select-display"
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <span>{city || "Select City"}</span>
                      {/* <i className="fa fa-chevron-down" /> */}
                    </div>
                    <button
                      type="button"
                      className="detect-location-btn-inline"
                      onClick={handleDetectLocationClick}
                      title="Detect current location"
                      disabled={checkingDetect}
                    >
                      <i className="fas fa-location" aria-hidden="true"></i>
                      {checkingDetect && (
                        <span
                          style={{
                            fontSize: 12,
                            marginLeft: 6,
                            color: "#555"
                          }}
                        >(Detecting...)</span>
                      )}
                    </button>
                  </div>

                  {/* Dropdown Panel */}
                  {open && (
                    <div className="city-dropdown" ref={cityDropdownRef}>
                      <input
                        type="text"
                        placeholder="Search city..."
                        className="city-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />

                      <div className="city-options">
                        {filteredCities.length === 0 ? (
                          <div className="no-results">No cities found</div>
                        ) : (
                          filteredCities.map((c) => (
                            <div
                              key={c._id}
                              className="city-option"
                              onClick={() => {
                                setCity(c.name);
                                setOpen(false);
                                setSearch("");
                              }}
                            >
                              {c.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="react-autocomplete-wrapper">
                  <ReactSearchAutocomplete
                    items={items}
                    className="search-inputsasas"
                    placeholder="Search for Cardiology, Lab Tests..."
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    fuseOptions={{ keys: ["name"] }}
                    styling={{
                      zIndex: 9999,
                      height: "45px",
                      borderRadius: "10px",
                      backgroundColor: "white",
                      boxShadow: "0 0 8px rgba(0,0,0,0.1)"
                    }}
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Header Actions - Right side on mobile */}
            <div className="col-xl-3 col-lg-4 header-actions-wrapper">
              <div className="header-actions">
                {/* Cart Icon */}
                {(!isDoctor || user) && (
                  <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
                    <i className="fa fa-shopping-cart"></i>
                    {(labCart.length + doctorCart.length) > 0 && (
                      <span className="cart-badge">{labCart.length + doctorCart.length}</span>
                    )}
                  </div>
                )}

                {/* User Dropdown or Auth Links */}
                {(user || isDoctor) ? (
                  <div className="user-dropdown-wrapper" ref={dropdownRef}>
                    <button
                      className="user-info-btn"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      <i className="fa fa-user-circle"></i>
                      <span className="user-name">
                        {isDoctor
                          ? doctorInfo.name.split(" ")[0]
                          : user.name.split(" ")[0]}
                      </span>
                      <i className={`fa fa-chevron-down dropdown-arrow ${dropdownOpen ? 'open' : ''}`}></i>
                    </button>

                    {dropdownOpen && (
                      <div className="user-dropdown-menu">
                        <div className="dropdown-header">
                          <div className="user-avatar">
                            <i className="fa fa-user-circle"></i>
                          </div>
                          <div className="user-details">
                            <h6>{isDoctor ? doctorInfo.name : user.name}</h6>
                            <p>{isDoctor ? doctorInfo.email : user.email}</p>
                          </div>
                        </div>

                        <div className="dropdown-body">
                          {isDoctor ? (
                            <>
                              <div className="dropdown-item" onClick={() => { navigate("/doctor/dashboard"); setDropdownOpen(false); }}>
                                <i className="fa fa-th-large"></i>
                                <span>Dashboard</span>
                              </div>
                              <div className="dropdown-item" onClick={() => { navigate("/doctor/dashboard?tab=patients"); setDropdownOpen(false); }}>
                                <i className="fa fa-users"></i>
                                <span>Patients</span>
                              </div>
                              <div className="dropdown-item" onClick={() => { navigate("/doctor/dashboard?tab=appointments"); setDropdownOpen(false); }}>
                                <i className="fa fa-calendar"></i>
                                <span>Appointments</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="dropdown-item" onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>
                                <i className="fa fa-user"></i>
                                <span>My Profile</span>
                              </div>
                              <div className="dropdown-item" onClick={() => { navigate("/bookings"); setDropdownOpen(false); }}>
                                <i className="fa fa-calendar"></i>
                                <span>My Bookings</span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="dropdown-footer">
                          <div className="dropdown-item logout" onClick={() => {
                            setDropdownOpen(false);
                            if (isDoctor) doctorLogout(); else logout();
                          }}>
                            <i className="fa fa-sign-out"></i>
                            <span>Logout</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="auth-links">
                    <button className="btn-login" onClick={() => setLoginOpen(true)}>
                      Login
                    </button>
                    <button className="btn-signup" onClick={() => setSignupOpen(true)}>
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Desktop */}
        <nav className="nav-bar d-none d-lg-block">
          <div className="container-fluid">
            <ul className="nav-links">


              {!isDoctor && (
                <>
                  <li className="nav-item">
                    <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/lab-tests" className={`nav-link ${location.pathname === "/lab-tests" ? "active" : ""}`}>
                      <i className="fa fa-flask"></i> Book a Lab Test
                    </Link>
                  </li>

                  <li className="nav-item has-dropdown">
                    <span className="nav-link dropdown-trigger">
                      <i className="fa fa-stethoscope"></i> Doctor Consultation
                      <i className="fa fa-angle-down"></i>
                    </span>
                    <div className="nav-dropdown-menu">
                      <a
                        onClick={() => {
                          clearCartData();
                          navigate("/lobby-doctor");
                        }}
                      >
                        <i className="fa fa-user-md"></i> Lobby Doctor
                      </a>

                      <a
                        onClick={() => {
                          clearCartData();
                          navigate("/doctors");
                        }}
                      >
                        <i className="fa fa-user-md"></i> Specialist
                      </a>
                    </div>
                  </li>
                </>
              )}

              {isDoctor && (
                <>
                  <li className="nav-item">
                    <Link to="/doctor/dashboard" className={`nav-link ${location.pathname === "/doctor/dashboard" ? "active" : ""}`}>
                      <i className="fa fa-th-large"></i> Doctor Dashboard
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
                  <i className="fa fa-info-circle"></i> About Us
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/blogs" className={`nav-link ${location.pathname === "/blogs" ? "active" : ""}`}>
                  <i className="fa fa-newspaper"></i> Blogs
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/contact" className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}>
                  <i className="fa fa-phone"></i> Contact Us
                </Link>
              </li>

              {(!isDoctor && !user) && (
                <li className="nav-item has-dropdown">
                  <span className="nav-link dropdown-trigger">
                    <i className="fa fa-user-md"></i> For Doctors
                    <i className="fa fa-angle-down"></i>
                  </span>
                  <div className="nav-dropdown-menu">
                    <Link to="/doctor/login">
                      <i className="fa fa-sign-in"></i> Doctor Login
                    </Link>
                    <Link to="/doctor/register">
                      <i className="fa fa-user-plus"></i> Doctor Register
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Location Confirm Popup for Detect Location */}
      {renderLocationConfirmModal()}

      {/* Off-canvas Overlay */}
      <div
        className={`offcanvas-overlay ${offcanvasOpen ? 'show' : ''}`}
        onClick={() => setOffcanvasOpen(false)}
        aria-hidden="true"
      />

      {/* Off-canvas Menu */}
      <div className={`offcanvas-menu ${offcanvasOpen ? 'show' : ''}`}>
        <div className="offcanvas-header">
          <div className="offcanvas-logo">
            <img src={newlogo} alt="Logo" />
          </div>
          <button
            className="offcanvas-close"
            onClick={() => setOffcanvasOpen(false)}
            aria-label="Close Menu"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="offcanvas-body">
          {/* User Info in Mobile Menu */}
          {(user || isDoctor) && (
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                <i className="fa fa-user-circle"></i>
              </div>
              <div className="mobile-user-details">
                <h6>{isDoctor ? doctorInfo.name : user.name}</h6>
                <p>{isDoctor ? doctorInfo.email : user.email}</p>
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link
                to="/"
                className={`mobile-nav-link ${location.pathname === "/" ? "active" : ""}`}
                onClick={() => setOffcanvasOpen(false)}
              >
                <i className="fa fa-home"></i>
                <span>Home</span>
              </Link>
            </li>

            {!isDoctor && (
              <>
                <li className="mobile-nav-item">
                  <Link
                    to="/lab-tests"
                    className={`mobile-nav-link ${location.pathname === "/lab-tests" ? "active" : ""}`}
                    onClick={() => setOffcanvasOpen(false)}
                  >
                    <i className="fa fa-flask"></i>
                    <span>Book a Lab Test</span>
                  </Link>
                </li>

                <li className="mobile-nav-item has-submenu">
                  <button
                    className="mobile-dropdown-trigger"
                    onClick={() => toggleMobileDropdown('consultDoctors')}
                  >
                    <div className="mobile-dropdown-label">
                      <i className="fa fa-stethoscope"></i>
                      <span>Doctor Consultation</span>
                    </div>
                    <i className={`fa fa-chevron-down mobile-dropdown-icon ${mobileDropdowns.consultDoctors ? 'open' : ''}`} />
                  </button>
                  <ul className={`mobile-submenu ${mobileDropdowns.consultDoctors ? 'show' : ''}`}>
                    <li>
                      <a
                        onClick={() => {
                          clearCartData();
                          setOffcanvasOpen(false);
                          navigate("/lobby-doctor");
                        }}
                      >
                        <i className="fa fa-user-md"></i>
                        <span>Lobby Doctor</span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          clearCartData();
                          setOffcanvasOpen(false);
                          navigate("/doctors");
                        }}
                      >
                        <i className="fa fa-user-md"></i>
                        <span>Specialist</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {isDoctor && (
              <>
                <li className="mobile-nav-item">
                  <Link
                    to="/doctor/dashboard"
                    className={`mobile-nav-link ${location.pathname === "/doctor/dashboard" ? "active" : ""}`}
                    onClick={() => setOffcanvasOpen(false)}
                  >
                    <i className="fa fa-th-large"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    to="/doctor/dashboard?tab=patients"
                    className={`mobile-nav-link ${location.pathname === "/doctor/dashboard?tab=patients" ? "active" : ""}`}
                    onClick={() => setOffcanvasOpen(false)}
                  >
                    <i className="fa fa-users"></i>
                    <span>Patients</span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link
                    to="/doctor/dashboard?tab=appointments"
                    className={`mobile-nav-link ${location.pathname === "/doctor/dashboard?tab=appointments" ? "active" : ""}`}
                    onClick={() => setOffcanvasOpen(false)}
                  >
                    <i className="fa fa-calendar"></i>
                    <span>Appointments</span>
                  </Link>
                </li>
              </>
            )}

            <li className="mobile-nav-item">
              <Link
                to="/about"
                className={`mobile-nav-link ${location.pathname === "/about" ? "active" : ""}`}
                onClick={() => setOffcanvasOpen(false)}
              >
                <i className="fa fa-info-circle"></i>
                <span>About Us</span>
              </Link>
            </li>

            <li className="mobile-nav-item">
              <Link
                to="/blogs"
                className={`mobile-nav-link ${location.pathname === "/blogs" ? "active" : ""}`}
                onClick={() => setOffcanvasOpen(false)}
              >
                <i className="fa fa-newspaper"></i>
                <span>Blogs</span>
              </Link>
            </li>

            <li className="mobile-nav-item">
              <Link
                to="/contact"
                className={`mobile-nav-link ${location.pathname === "/contact" ? "active" : ""}`}
                onClick={() => setOffcanvasOpen(false)}
              >
                <i className="fa fa-phone"></i>
                <span>Contact Us</span>
              </Link>
            </li>

            {(!isDoctor && !user) && (
              <li className="mobile-nav-item has-submenu">
                <button
                  className="mobile-dropdown-trigger"
                  onClick={() => toggleMobileDropdown('forDoctors')}
                >
                  <div className="mobile-dropdown-label">
                    <i className="fa fa-user-md"></i>
                    <span>For Doctors</span>
                  </div>
                  <i className={`fa fa-chevron-down mobile-dropdown-icon ${mobileDropdowns.forDoctors ? 'open' : ''}`} />
                </button>
                <ul className={`mobile-submenu ${mobileDropdowns.forDoctors ? 'show' : ''}`}>
                  <li>
                    <Link to="/doctor/login" onClick={() => setOffcanvasOpen(false)}>
                      <i className="fa fa-sign-in"></i>
                      <span>Doctor Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/doctor/register" onClick={() => setOffcanvasOpen(false)}>
                      <i className="fa fa-user-plus"></i>
                      <span>Doctor Register</span>
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Mobile Menu Footer */}
          {(user || isDoctor) && (
            <div className="mobile-menu-footer">
              <button
                className="mobile-logout-btn"
                onClick={() => {
                  setOffcanvasOpen(false);
                  if (isDoctor) doctorLogout(); else logout();
                }}
              >
                <i className="fa fa-sign-out"></i>
                <span>Logout</span>
              </button>
            </div>
          )}

          {(!user && !isDoctor) && (
            <div className="mobile-menu-footer">
              <button className="mobile-login-btn" onClick={() => { setLoginOpen(true); setOffcanvasOpen(false); }}>
                <i className="fa fa-sign-in"></i> Login
              </button>
              <button className="mobile-signup-btn" onClick={() => { setSignupOpen(true); setOffcanvasOpen(false); }}>
                <i className="fa fa-user-plus"></i> Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <SignupModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
};

export default Header;
