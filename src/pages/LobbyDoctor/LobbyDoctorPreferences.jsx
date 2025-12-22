import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import StepIndicator from "../../components/StepIndicator";
import Multiselect from "multiselect-react-dropdown";
import "../../styles/lobbyDoctor.css";
import API from "../../api/axios";

const consultationTypes = [
  { name: "Audio", icon: "fa fa-microphone" },
  { name: "Video", icon: "fa fa-video-camera" },
  { name: "Chat", icon: "fa fa-comments" }
];

const LobbyDoctorPreferences = () => {
  const { preferredLanguage, setPreferredLanguage, consultationType, setConsultationType } = useContext(CartContext);

  const [languages, setLanguages] = useState(preferredLanguage || []);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [type, setType] = useState(consultationType || "");

  useEffect(() => {
    const saved = localStorage.getItem("preferredLanguage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLanguages(parsed);
        }
      } catch (err) {
        console.error("Failed to parse languages from localStorage", err);
      }
    }
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await API.get("/api/commonmaster/getActivelanguages");
      if (res.data?.success) {
        const options = res.data.languages.map((lang) => ({
          name: lang.name,
          id: lang._id,
        }));
        setAvailableLanguages(options);
      } else {
        console.error("Failed to load languages");
      }
    } catch (err) {
      console.error("Error fetching languages", err);
    }
  };

  const navigate = useNavigate();

  const handleSelect = (selectedList) => {
    setLanguages(selectedList);
    localStorage.setItem("preferredLanguage", JSON.stringify(selectedList));
  };

  const handleRemove = (selectedList) => {
    setLanguages(selectedList);
    localStorage.setItem("preferredLanguage", JSON.stringify(selectedList));
  };

  const handleContinue = () => {
    if (languages.length === 0 || !type) return;
    setPreferredLanguage(languages);
    setConsultationType(type);
    navigate("/lobby-doctor/patient");
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
                  <li className="breadcrumb-item">Select Category</li>
                  <li className="breadcrumb-item active">Select Language and Type</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-4">
        <StepIndicator currentStep={2} />
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Preferences & Consultant Type</h3>
          </div>
          <div className="form-group no-float">
            <label>Select your preferred languages</label>
            <Multiselect
              options={availableLanguages}
              selectedValues={languages}
              onSelect={handleSelect}
              onRemove={handleRemove}
              displayValue="name"
              showCheckbox={true}
              placeholder="Choose languages"
            />
          </div>
          <h5 className="select-type-abcds">Select your type</h5>
          <div className="tag-group">
            {consultationTypes.map((c) => (
              <button
                key={c.name}
                className={`video-audio-chat ${type === c.name ? "selected" : ""}`}
                onClick={() => setType(c.name)}
              >
                <i className={c.icon} style={{ marginRight: '8px' }}></i>
                {c.name}
              </button>
            ))}
          </div>

          <div className="action-buttons mt-5">
            <button className="go-backs" onClick={() => navigate(-1)}>
              <i className="fa fa-chevron-left"></i> Go Back
            </button>
            <button
              className="continue-abcd"
              disabled={languages.length === 0 || !type}
              onClick={handleContinue}
            >
              Continue <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LobbyDoctorPreferences;