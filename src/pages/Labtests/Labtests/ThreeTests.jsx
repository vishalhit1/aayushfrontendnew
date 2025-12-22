import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import three1 from "../../../assets/icons/three1.png";
import three2 from "../../../assets/icons/three2.png";
import three3 from "../../../assets/icons/three3.png";

const ThreeTests = () => {
  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/screenTestList/${encodeURIComponent(name)}`);
  };

  return (
    <div className="three-test-labetss">
      <Container>
        <Row>

          <Col lg={3} sm={4} md={6} xs={4}>
            <div
              className="media-journey-sliders"
              // onClick={() => handleClick("Screening Test")}
              style={{ cursor: "pointer" }}
            >
              <div className="media-overlay" />
              <img className="w-100" alt="" src={three1} />
              <h4>Screening Test</h4>
            </div>
          </Col>

          <Col lg={3} sm={4} md={6} xs={4}>
            <div
              className="media-journey-sliders"
              // onClick={() => handleClick("Pre - Diabetic")}
              style={{ cursor: "pointer" }}
            >
              <div className="media-overlay" />
              <img className="w-100" alt="" src={three2} />
              <h4>Pre - Diabetic</h4>
            </div>
          </Col>

          <Col lg={3} sm={4} md={6} xs={4}>
            <div
              className="media-journey-sliders"
              // onClick={() => handleClick("Diabetic")}
              style={{ cursor: "pointer" }}
            >
              <div className="media-overlay" />
              <img className="w-100" alt="" src={three3} />
              <h4>Diabetic</h4>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default ThreeTests;
