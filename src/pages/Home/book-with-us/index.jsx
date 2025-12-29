import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import doctsept from "../../../assets/icons/doctorsept.png"

const BookWithUs = () => {
    return (
        <div className='bookwithus'>
            <div className='text-center'>
            <h2 className='testimonial-heading'>Why Book With Us</h2>
            </div>
            <Container>
                <div className="row mt-4 center-items">
                    <div className="col-lg-6">
                        <div className="bookus-img">
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/book-01.jpg" alt="img" className="img-fluid" />
                                </div>
                                <div className="col-sm-6">
                                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/book-02.jpg" alt="img" className="img-fluid" />
                                </div>
                                <div className="col-sm-6">
                                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/book-03.jpg" alt="img" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="section-header">
                            <h2>
                                We are committed to understanding your{" "}
                                <span className="uniu-test">
                                    unique needs and delivering care.
                                </span>
                            </h2>
                        </div>
                        <p>
                            As a trusted health As a trusted healthcare provider in our community, we
                            are passionate about promoting health and wellness beyond the clinic. We
                            actively engage in community outreach programs, health fairs, and
                            educational workshop.
                        </p>
                        <Row className='search-doctorsss'>
                            <Col lg={6}>
                                <div className='search-for-doctors'>
                                    <div className='h5-bg'>
                                        <h5>1</h5>
                                    </div>
                                    <h6>Easy Online <br/>Booking</h6>
                                    <img src={doctsept} alt="" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className='search-for-doctors second'>
                                    <div className='h5-bg'>
                                        <h5>2</h5>
                                    </div>
                                    <h6>Safe Sample <br/>Collection</h6>
                                    <img src={doctsept} alt="" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className='search-for-doctors third'>
                                    <div className='h5-bg'>
                                        <h5>3</h5>
                                    </div>
                                    <h6>Sample Received <br/>at Lab</h6>
                                    <img src={doctsept} alt="" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className='search-for-doctors fours'>
                                    <div className='h5-bg'>
                                        <h5>4</h5>
                                    </div>
                                    <h6>Doctor-Verified <br/>Reports</h6>
                                    <img src={doctsept} alt="" />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

            </Container>
        </div>
    )
}

export default BookWithUs
