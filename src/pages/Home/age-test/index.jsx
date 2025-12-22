import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import { Tabs } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';

import age1 from "../../../assets/icons/age1.png"
import age2 from "../../../assets/icons/age2.png"
import age3 from "../../../assets/icons/age3.png"
import age4 from "../../../assets/icons/age4.png"
import age5 from "../../../assets/icons/age5.png"
import age6 from "../../../assets/icons/age6.png"


const AgeTest = () => {
    const navigate = useNavigate();

    const handleNavigate = (gender, range) => {
        navigate(`/age-tests/${gender}/${range}`);
    };

    return (
        <div className='age-test-new'>
            <h3 className='age-test'>Age - Based Test & Packages</h3>
            <Container>
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                >
                    <Tab eventKey="home" title="Men’s Category">
                        <Row>
                            <Col lg={4}>
                                <div className='age-content'
                                    onClick={() => handleNavigate("male", "05–18")}
                                    style={{ cursor: "pointer" }}>
                                    <img src={age1} alt="" />
                                    <h4>5 - 18 years</h4>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='age-content'
                                onClick={() => handleNavigate("male", "18–40")}
                                style={{ cursor: "pointer" }}
                                >
                                    <img src={age2} alt="" />
                                    <h4>18 - 40 years</h4>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='age-content'>
                                    <img src={age3} alt="" 
                                     onClick={() => handleNavigate("male", "40-85")}
                                     style={{ cursor: "pointer" }}
                                    />
                                    <h4>40 - 85 years</h4>
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="profile" title="Women’s Category">
                        <Row>
                            <Col lg={4}>
                                <div className='age-content'
                                onClick={() => handleNavigate("female", "05–18")}
                                style={{ cursor: "pointer" }}>
                                    <img src={age4} className='mb-4' alt="" />
                                    <h4>5 - 18 years</h4>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='age-content'
                                onClick={() => handleNavigate("female", "18–40")}
                                style={{ cursor: "pointer" }}
                                >
                                    <img src={age5} className='mb-4' alt="" />
                                    <h4>18 - 40 years</h4>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className='age-content'
                                  onClick={() => handleNavigate("female", "40-85")}
                                  style={{ cursor: "pointer" }}
                                >
                                    <img src={age6} className='mb-4' alt="" />
                                    <h4>40 - 85 years</h4>
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    )
}

export default AgeTest 
