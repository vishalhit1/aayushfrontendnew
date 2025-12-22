import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios.js";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext.jsx";
import { DoctorFilterContext } from "../../context/DoctorFilterContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/doctors.css";
import { API_URL } from "../../../config.js";
import { Spinner } from "react-bootstrap";
import LoginModal from "../../components/LoginModal.jsx";
import HomeSearch from "../Search/HomeSearch.jsx";

const Doctors = () => {
  const {
    setSelectedCategory,
    setSelectedDoctor,
    setSelectedDoctorName,
    setTotalAmount,
  } = useContext(CartContext);

  const {
    searchTerm,
    setSearchTerm,
    specialtyFilter,
    setSpecialtyFilter,
    ratingFilter,
  } = useContext(DoctorFilterContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const categoryQuery = queryParams.get("category");

  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loadingDoctorId, setLoadingDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // ✅ For mobile drawer toggle

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
  
      try {
        const res = await API.get("/api/category/getActiveCategories");
        setCategories(res.data.categories);
  
        // Apply category query if exists
        if (categoryQuery) {
          const matchedCategory = res.data.categories.find(
            (c) => c._id === categoryQuery
          );
          if (matchedCategory) {
            setSpecialtyFilter(categoryQuery); // set filter
          }
        }
      } catch (err) {
        toast.error("Error fetching categories");
      }
  
      // Fetch doctors after setting specialtyFilter
      await fetchDoctors(categoryQuery || specialtyFilter);
      setLoading(false);
    };
  
    initFetch();
  }, []);
  
  
  

  useEffect(() => {
    fetchDoctors();
  }, [specialtyFilter, searchTerm, ratingFilter]);

  const fetchDoctors = async (filter = specialtyFilter) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        specialty: filter,
        search: searchTerm,
      }).toString();
  
      const res = await API.get(`/api/doctors/specialistdoctors?${query}`);
      setDoctors(res.data.doctors);
    } catch (err) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/category/getActiveCategories");
      setCategories(res.data.categories);
  
      // Apply category query if exists
      if (categoryQuery) {
        const matchedCategory = res.data.categories.find(
          (c) => c._id === categoryQuery
        );
        if (matchedCategory) {
          setSpecialtyFilter(categoryQuery);
        }
      }
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };
  

  const handleContinue = (doctor) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }

    setLoadingDoctorId(doctor._id);
    setSelectedCategory(doctor.specialization?._id);
    setSelectedDoctor(doctor._id);
    setSelectedDoctorName(doctor.name);
    setTotalAmount(doctor.fees);

    setTimeout(() => {
      navigate(`/slot/${doctor._id}`);
      setLoadingDoctorId(null);
    }, 500);
  };

  // ✅ When user changes search or filter — auto close sidebar on mobile
  const handleFilterChange = (callback) => (e) => {
    callback(e.target.value);
    if (window.innerWidth <= 991) {
      setShowFilters(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (window.innerWidth <= 991) {
      setShowFilters(false);
    }
  };

  return (
    <>
      <HomeSearch />
      <div className="mb-5">
        <div className="container-fluid px-5">
          <h2 className="consult-a-doctors-now"></h2>

          {/* ✅ Mobile Filter Toggle Button */}
          <button
            className="doctor-apply-filters d-lg-none"
            onClick={() => setShowFilters(true)}
          >
            <i className="fa fa-filter" aria-hidden="true"></i> Apply Filters
          </button>

          <div className="row">
            {/* Sidebar Filters */}
            <div
              className={`col-lg-3 filters-sidebar ${showFilters ? "show" : ""
                }`}
            >
              <div className="filters">
                <div className="filter-head d-flex justify-content-between align-items-center">
                  <h3>Filter</h3>
                  {/* Close button for mobile */}
                  <button
                    className="btn-close d-lg-none"
                    onClick={() => setShowFilters(false)}
                  ></button>
                </div>
                <div className="filter-content">
                  <label>Search Doctors By Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <label>Specialty</label>
                  <select
                    className="form-select"
                    value={specialtyFilter}
                    onChange={handleFilterChange(setSpecialtyFilter)}
                  >
                    <option value="">All</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor List */}
            <div className="col-lg-9">
              {loading ? (
                <div className="fullpage-loader">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="doctor-list">
                  <div className="row">
                    {doctors.length === 0 ? (
                      <div className="no-results-message text-center">
                        <h4>No doctors found.</h4>
                      </div>
                    ) : (
                      doctors.map((doctor) => (
                        <div key={doctor._id} className="col-xxl-6 col-md-6 mb-5">
                          <div className="special-div-basd">
                            <div className="row">
                              <div className="col-lg-4">
                                <a
                                  onClick={() =>
                                    navigate(`/doctors/${doctor._id}`)
                                  }
                                >
                                  <img
                                    className="profile-sepc-doctors"
                                    src={
                                      doctor.profileImage?.length > 0
                                        ? `${API_URL}/uploads/doctors/${doctor.profileImage[0].filename}`
                                        : "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80"
                                    }
                                    alt={doctor.name}
                                  />
                                </a>
                              </div>
                              <div className="col-lg-8">
                                <div className="doctor-info-detail">
                                  <h3
                                    onClick={() =>
                                      navigate(`/doctors/${doctor._id}`)
                                    }
                                  >
                                    {doctor.name}
                                  </h3>
                                  <a href="#" className="doctor-abcds13">
                                    {doctor.specialization?.name ||
                                      doctor.specialization}
                                  </a>
                                  <div className="data_new-abcd">
                                    <p>
                                      <i className="fa fa-map-marker me-2" />
                                      Mumbai
                                    </p>
                                    <p>
                                      <i className="fa fa-briefcase me-2" />
                                      Experience - {doctor.experience} Years
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="spec-cons-fees">
                            <div className="row">
                              <div className="col-lg-7">
                                <p>Consultation Fees</p>
                                <div className="special-price-doc">
                                  <h3 className="doc-fees">₹{doctor.offerPrice}/-</h3>
                                  <h4 className="doc-fees-disc">₹{doctor.fees}/-</h4>
                                </div>
                              </div>
                              <div className="col-lg-5">
                                <a
                                  onClick={() => handleContinue(doctor)}
                                  className="spec-book-doctor"
                                >
                                  {loadingDoctorId === doctor._id ? (
                                    <>
                                      <i className="bi bi-hourglass-split me-2"></i>
                                      Please wait...
                                    </>
                                  ) : (
                                    <>
                                      <i className="isax isax-calendar-1 me-2" />
                                      Know more
                                    </>
                                  )}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>

      {/* ✅ Overlay when sidebar is open */}
      {showFilters && (
        <div
          className="filter-overlay d-lg-none"
          onClick={() => setShowFilters(false)}
        ></div>
      )}
    </>
  );
};

export default Doctors;