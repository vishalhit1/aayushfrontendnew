import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import icon1 from "../../../assets/icons/labtest1.png";
import icon2 from "../../../assets/icons/labtest2.png";
import icon3 from "../../../assets/icons/labtest3.png";
import icon4 from "../../../assets/icons/labtest4.png";

const CalltoActions = () => {
    const navigate = useNavigate();

    return (
        <div className='calll-to-acs'>
            <Container>
                <Row style={{ justifyContent: 'space-between' }}>
                    {/* Book Via Call */}
                    <Col lg={2} md={6} sm={6} xs={3}>
                        <div className='call-to-actions123' onClick={() => window.location.href="tel:+918433732988"}>
                            <img src={icon1} alt="" />
                            <h3>Book Via <br /> <span>Call</span></h3>
                        </div>
                    </Col>

                    {/* Upload Prescription */}
                    <Col lg={2} md={6} sm={6} xs={3}>
                        <div className='call-to-actions123' onClick={() => navigate("/prescription")}>
                            <img src={icon2} alt="" />
                            <h3>Upload <br /> <span>Prescription</span></h3>
                        </div>
                    </Col>

                    {/* Book via Whatsapp */}
                    <Col lg={2} md={6} sm={6} xs={3}>
                        <div className='call-to-actions123' 
                             onClick={() => window.open("https://wa.me/918433732988?text=Hi%20I%20want%20to%20book%20a%20lab%20test", "_blank")}>
                            <img src={icon3} alt="" />
                            <h3>Book via <br /> <span>Whatsapp</span></h3>
                        </div>
                    </Col>

                    {/* Full Body Packages */}
                    <Col lg={2} md={6} sm={6} xs={3}>
                        <div className='call-to-actions123' onClick={() => navigate("/packagetestlist")}>
                            <img src={icon4} alt="" />
                            <h3>Full body <br /> <span>Packages</span></h3>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default CalltoActions;
