// src/pages/LobbyDoctor/CategorySelection.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import StepIndicator from "../../components/StepIndicator";
import "../../styles/lobbyDoctor.css";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { CheckCircle } from "lucide-react"; // clean professional icons

const LobbyDoctorCategory = () => {
  const { selectedCategory, setSelectedCategory, setTotalAmount } =
    useContext(CartContext);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const found = categories.find((cat) => cat._id === selectedCategory);
      if (found) setCurrentCategory(found);
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/category/getActiveCategories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching categories");
    }
  };

  const handleContinue = () => {
    if (!currentCategory) return;
    setSelectedCategory(currentCategory._id);
    const price = currentCategory.lobbyPrice;
    setTotalAmount(price);
    navigate("/lobby-doctor/preference");
  };

  return (
    <>
      {/* === Breadcrumb === */}
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
                  <li className="breadcrumb-item">Consult Doctor</li>
                  <li className="breadcrumb-item active">Select Category</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* === Main Content === */}
      <div className="container my-4">
        <StepIndicator currentStep={1} />

        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Choose a Medical Category</h2>
          <p className="text-muted mb-0">
            Select the area of consultation to get started with your doctor session.
          </p>
        </div>

        <div className="category-grid">
          {categories.length === 0 && (
            <p className="text-center text-muted">Loading categories...</p>
          )}

          {categories.map((cat) => {
            const price = cat.lobbyPrice;
            const isSelected = currentCategory?._id === cat._id;

            return (
              <div
                key={cat._id}
                className={`category-card-pro ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => setCurrentCategory(cat)}
              >
                {isSelected && (
                  <CheckCircle className="selected-icon text-primary" size={22} />
                )}

                <h5 className="category-title mb-2">{cat.name}</h5>

                <div className="price-section mb-2">
                  <span className="price fw-bold text-primary">₹{price}</span>
                  {/* {cat.offerPrice > 0 && (
                    <span className="old-price ms-2">₹{cat.lobbyPrice}</span>
                  )} */}
                </div>

                {/* {cat.description && (
                  <p className="category-desc text-muted mb-0">
                    {cat.description}
                  </p>
                )} */}
              </div>
            );
          })}
        </div>

        {/* === Buttons === */}
        <div className="action-buttons mt-5">
          <button className="go-backs" onClick={() => navigate(-1)}>
            <i className="fa fa-chevron-left me-1"></i> Go Back
          </button>

          <button
            className="continue-abcd"
            disabled={!currentCategory}
            onClick={handleContinue}
          >
            Continue <i className="fa fa-chevron-right ms-1"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default LobbyDoctorCategory;
