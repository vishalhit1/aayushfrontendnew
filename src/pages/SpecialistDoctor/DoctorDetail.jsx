import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios.js";
import { CartContext } from "../../context/CartContext.jsx";
import { toast } from "react-toastify";
import "../../styles/doctorDetails.css";
import { API_URL } from "../../../config.js";
import { Col, Container, Row } from "react-bootstrap";

import Popularhealthpackages from "../Labtests/Popularhealthpackages";
import Individualtest from "../Labtests/Individualtest";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { doctorCart, setSelectedCategory, setTotalAmount } = useContext(CartContext);

  // ✅ Hooks at top-level
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`/api/doctors/${id}`);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  console.log("doctor", doctor)

  if (loading) return <div className="fullpage-loader">
    <div className="spinner"></div>
  </div>;
  if (!doctor) return <p>Doctor not found</p>;

  const handleContinue = (doctor) => {
    setSelectedCategory(doctor.specialization);
    setTotalAmount(doctor.fees);
    navigate(`/slot/${doctor._id}`);
  };

  return (
    <div className="doctor-details-news12">
      <Container>
        <div className="mt-5">
          {/* Doctor Header */}
          <Row className="mobile-row-center">
            <Col lg={6}>
            <div className="doctor-header">
              <img
                src={`${API_URL}/uploads/doctors/${doctor.profileImage?.map(val => val.filename)}` || "/doctor-placeholder.png"}
                alt={doctor.name}
                className="doctor-images123"
              />
            </div>
            <h2>{doctor.name}</h2>
            <Row>
            <Col lg={6} md={12} xs={6} className="consul-fesas">
            <h3>Consultation Fees</h3>
            <p> ₹{doctor.fees}/- <span>₹300/-</span></p>
            </Col>
            <Col lg={6} md={12} xs={6}>
            <button className="off-percent-price12">56% Off</button>
            </Col>
            </Row>
            <Row style={{justifyContent:'center'}}>
            <Col lg={12} md={12} xs={12}>
              <button className="book-now-appo" onClick={() => handleContinue(doctor)}>
                Consult Now
              </button>
            </Col>
            </Row>
            
            </Col>
          </Row>
            <div className="doctor-info">
              <p><span>Speciality:</span> {doctor?.specialization?.name}</p>
              <p><span>Experience:</span> {doctor.experience} yrs</p>
              <p><span>Location:</span> Mumbai, Delhi</p>
              <p><span>Languages:</span> {doctor.languages?.join(", ")}</p>
            </div>
          {/* Doctor Bio */}
          <div className="doctor-bio">
            <h3>About Me</h3>
            <p>{doctor.bio || "No bio available."}</p>
          </div>
        </div>
      </Container>
      {/* Reviews */}
      <Container>
        <div className="doctor-reviews">
          <h3>Reviews</h3>
          {doctor.reviews?.length > 0 ? (
            doctor.reviews.map((r, idx) => (
              <div key={idx} className="review-card">
                <p>
                  <strong>{r.patient?.name || "Anonymous"}</strong> - {r.rating} ★
                </p>
                <p>{r.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </Container>
      <hr className="doctor-detiles-hr" />
      <Popularhealthpackages />
      <Individualtest/>
    </div>
  );
};

export default DoctorDetails;