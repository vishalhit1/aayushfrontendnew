import React from 'react'
import icon1 from "../../../assets/icons/icon1.gif"
import icon2 from "../../../assets/icons/icon2.gif"
import icon3 from "../../../assets/icons/icon3.gif"
import { Col, Container, Row } from 'react-bootstrap'

const BasicInfo = () => {
    return (
        <div className='sec-basic-infos'>
            <Container>
                <Row>
                    <Col lg={4}>
                        <div className='base-info'>
                            <div className='img-animated-gif'>
                                <img src={icon1} alt="" />
                            </div>
                            <h3>NABL <br />Certified</h3>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='base-info'>
                            <div className='img-animated-gif'>
                                <img src={icon2} alt="" />
                            </div>
                            <h3>Faster collection <br />7 AM - 12 PM</h3>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='base-info'>
                            <div className='img-animated-gif'>
                                <img src={icon3} alt="" />
                            </div>
                            <h3>Reports in <br />8-12 hours</h3>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default BasicInfo
