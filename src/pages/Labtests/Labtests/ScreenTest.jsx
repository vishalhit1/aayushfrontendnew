import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import three1 from "../../../assets/gut.png"
import three2 from "../../../assets/cancer.png"
import three3 from "../../../assets/fitness.png"
import { useNavigate } from 'react-router-dom'

const ScreenTest = () => {

    const navigate = useNavigate();

    const handleClick = (name) => {
      navigate(`/screenTestList/${encodeURIComponent(name)}`);
    };

    return (
        <div className='screentest-genetic'>
            <Container>
            <h3>Genetic Testing & Cancer Screening</h3>
                <Row>
                    <Col lg={3} sm={4} md={6} xs={4}>
                        <div className="media-journey-sliders" 
                        // onClick={() => handleClick("Gut Health")}
                        >
                            <div className="media-overlay" />
                            <img className="w-100" alt="" src={three1} />
                            <h4>Gut Health</h4>
                        </div>
                    </Col>
                    <Col lg={3} sm={4} md={6} xs={4} 
                    // onClick={() => handleClick("Cancer Risk Screening")}
                    >
                        <div className="media-journey-sliders">
                            <div className="media-overlay" />
                            <img className="w-100" alt="" src={three2}/>
                            <h4>Cancer Screening</h4>
                        </div>
                    </Col>
                    <Col lg={3} sm={4} md={6} xs={4} 
                    // onClick={() => handleClick("Fitness")}
                    >
                        <div className="media-journey-sliders">
                            <div className="media-overlay" />
                            <img className="w-100" alt="" src={three3} />
                            <h4>Fitness</h4>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ScreenTest
