import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../../../api/axios";

const Aayushhhostlic = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const res = await API.get("/api/labtestpackage/holistic");
        if (res.data.success) setPackages(res.data.packages);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally{
        setLoading(false)
    }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <div className="container">
  
          <div className="row">
            {[...Array(6)].map((_, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text" style={{ width: "80%" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "60%" }}></div>
              </div>
            ))}
          </div>
  
        </div>
      </div>
    );
  }


  return (
    <div className="aayush-holistic">
      <Container>
        <h3>Aayush Holistic Women/Men Packages</h3>
        <Row style={{ justifyContent: "center" }}>
          {packages.map((pkg) => (
            <Col key={pkg._id} lg={3} md={4} sm={6} xs={3}>
              <Link to={`/holisticpackagedetails/${pkg._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="ayush-hjos">
                  <img src={pkg.image} alt={pkg.name} className="img-fluid" />
                  <h6>{pkg.name}</h6>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Aayushhhostlic;
