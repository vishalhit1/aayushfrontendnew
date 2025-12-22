import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import API from "../../api/axios";
import { toast } from "react-toastify";
import "../../styles/doctorRegister.css";
import { Link, useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import logos from "../../assets/logo.png";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { preferredLanguage } = useContext(CartContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    fees: "",
    languages: [],
    bio: "",
    qualifications: "",
    specialization: "",
    experience: "",
    profileImage: null,
    showPassword: false,
    documents: {
      medicalLicense: null,
      idProof: null,
      degreeCertificate: null,
    },
  });

  const [previews, setPreviews] = useState({});
  const [languages, setLanguages] = useState(preferredLanguage || []);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useEffect(() => {
    fetchLanguages();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get(`/api/category/getActiveCategories`);
      setCategories(res.data.categories || []);
    } catch {
      toast.error("Error fetching categories");
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await API.get("/api/commonmaster/getActivelanguages");
      if (res.data?.success) {
        setAvailableLanguages(
          res.data.languages.map((lang) => ({
            name: lang.name,
            id: lang._id,
          }))
        );
      }
    } catch {
      toast.error("Error fetching languages");
    }
  };

  const handleSelect = (selectedList) => {
    setLanguages(selectedList);
    setFormData({ ...formData, languages: selectedList });
  };

  const handleRemove = (selectedList) => {
    setLanguages(selectedList);
    setFormData({ ...formData, languages: selectedList });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: file });
    } else {
      setFormData({
        ...formData,
        documents: { ...formData.documents, [name]: file },
      });
    }
    setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const sendOtp = async () => {
    try {
      if (!formData.name.trim()) return toast.error("Name required");
      if (!/\S+@\S+\.\S+/.test(formData.email))
        return toast.error("Valid email required");
      if (!/^\d{10}$/.test(formData.phone))
        return toast.error("Valid 10-digit mobile required");
      if (!formData.password.trim()) return toast.error("Password required");
      if (!formData.specialization) return toast.error("Select specialization");
      if (!formData.experience) return toast.error("Enter experience");
      if (!formData.fees) return toast.error("Enter consultation fee");
      if (!formData.languages.length)
        return toast.error("Select at least one language");

      setLoadingOtp(true);
      await API.post("/api/doctors/send-otp", {
        email: formData.email,
        phone: formData.phone,
      });
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoadingRegister(true);
      const data = new FormData();
  
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "documents") {
          Object.entries(value).forEach(([k, v]) => v && data.append(k, v));
        } else if (key === "languages") {
          // Extract only language names (handle array of objects or strings)
          const langArray = Array.isArray(value)
            ? value.map((l) => (typeof l === "object" ? l.name : l))
            : [];
          data.append("languages", JSON.stringify(langArray));
        } else {
          data.append(key, value);
        }
      });
  
      const res = await API.post("/api/doctors/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.status === 201) {
        toast.success(res.data.message || "Registration successful!");
        navigate("/doctor/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoadingRegister(false);
    }
  };
  

  const allowOnlyNumbers = (value) => value?.replace(/\D/g, "") || "";

  return (
    <>
      {/* Header */}
      <div className="top-header-bar py-2">
        <div className="container d-flex justify-content-between align-items-center small">
          <div>
            <a href="tel:6295550129" className="me-3 text-muted text-decoration-none">
              <i className="fa fa-phone me-1" /> (629) 555-0129
            </a>
            <a href="mailto:info@example.com" className="text-muted text-decoration-none">
              <i className="fa fa-envelope me-1" /> info@example.com
            </a>
          </div>
          <div>
            <a href="#" className="text-muted me-3"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" className="text-muted me-3"><i className="fa-brands fa-pinterest"></i></a>
            <a href="#" className="text-muted"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="text-center my-4">
        <Link to="/">
          <img src={logos} alt="Logo" style={{ height: "70px" }} />
        </Link>
      </div>

      {/* Form Section */}
      <div className="doctor-register-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-10">
              <div className="card doctor-register-card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <h3 className="text-center mb-4 fw-semibold text-primary">Doctor Registration</h3>

                {/* Profile Upload */}
                {/* Profile Upload */}
                <div className="profile-upload text-center mb-4">
                  <div className="profile-image-wrapper mx-auto mb-3">
                    <img
                      src={previews.profileImage || "https://via.placeholder.com/120x120?text=Profile"}
                      alt="Profile Preview"
                      className="profile-preview-img"
                    />
                    <label htmlFor="profileImage" className="upload-overlay">
                      <i className="fa fa-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="d-none"
                    />
                  </div>
                  <p className="text-muted small">Upload your profile photo (JPG or PNG)</p>
                </div>


                {/* Personal Information */}
                <section className="form-section mb-4">
                  <h6 className="section-title">Personal Information</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Full Name</label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Email Address</label>
                      <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 position-relative">
                      <label className="form-label">Password</label>
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        className="form-control pe-5"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <i
                        className={`fa ${formData.showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            showPassword: !formData.showPassword,
                          })
                        }
                      ></i>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={allowOnlyNumbers(formData.phone)}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>
                  </div>
                </section>

                {/* Professional Information */}
                <section className="form-section mb-4">
                  <h6 className="section-title">Professional Details</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Consultation Fee</label>
                      <input type="number" name="fees" className="form-control" value={formData.fees} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Specialization</label>
                      <select className="form-select" name="specialization" value={formData.specialization} onChange={handleChange}>
                        <option value="">Select Specialization</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        className="form-control"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Languages</label>
                      <Multiselect
                        options={availableLanguages}
                        selectedValues={languages}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        displayValue="name"
                        showCheckbox
                        placeholder="Select Languages"
                      />
                    </div>
                  </div>
                </section>

                {/* Bio & Qualifications */}
                <section className="form-section mb-4">
                  <h6 className="section-title">Bio & Qualifications</h6>
                  <label className="form-label">Short Bio</label>
                  <textarea
                    name="bio"
                    rows="3"
                    className="form-control mb-3"
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                  <label className="form-label">Qualifications</label>
                  <textarea
                    name="qualifications"
                    rows="2"
                    className="form-control"
                    value={formData.qualifications}
                    onChange={handleChange}
                  ></textarea>
                </section>

                {/* Documents */}
                <section className="form-section mb-4">
                  <h6 className="section-title">Documents Upload</h6>
                  <div className="row g-3">
                    {["medicalLicense", "idProof", "degreeCertificate"].map((docKey) => (
                      <div key={docKey} className="col-md-4">
                        <label className="form-label text-capitalize">
                          {docKey.replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          type="file"
                          name={docKey}
                          className="form-control"
                          onChange={handleFileChange}
                        />
                        {previews[docKey] && (
                          <small className="text-success d-block mt-1">
                            Uploaded: {formData.documents[docKey]?.name}
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* OTP Section */}
                <div className="text-center mt-4">
                  {!otpSent ? (
                    <button className="btn btn-primary w-50" onClick={sendOtp} disabled={loadingOtp}>
                      {loadingOtp ? "Sending OTP..." : "Send OTP"}
                    </button>
                  ) : (
                    <>
                      <label className="form-label">Enter OTP</label>
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        className="form-control text-center w-50 mx-auto mb-3"
                        onChange={handleChange}
                        value={formData.otp}
                      />
                      <div className="d-flex justify-content-center gap-3">
                        <button
                          className="btn btn-success px-4"
                          onClick={handleRegister}
                          disabled={loadingRegister}
                        >
                          {loadingRegister ? "Registering..." : "Register"}
                        </button>
                        <button
                          className="btn btn-outline-secondary px-4"
                          onClick={sendOtp}
                          disabled={loadingOtp}
                        >
                          {loadingOtp ? "Resending..." : "Resend OTP"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-5 text-muted small">
        © 2025 AayushLabs. All rights reserved.
      </footer>

      {(loadingOtp || loadingRegister) && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorRegister;
