import React from 'react'

import searchbanner from "../../assets/banner/banner3.svg"
import HomeSearch from './HomeSearch'
import { Col, Container, Row } from 'react-bootstrap'
import { Tabs } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';

import searchimg from '../../assets/searchimg.gif';

const SearchDetails = () => {
    return (
        <div>
            <HomeSearch />
            <Container>
                <img className='w-100 mb-4' src={searchbanner} alt="" />
            </Container>
            <div className='age-test-new mt-4 searchnew-tabs' style={{ background: 'white' }}>
                <Container>
                    <Tabs
                        defaultActiveKey="home"
                        id="uncontrolled-tab-example"
                    >
                        <Tab eventKey="home" title="Lab Test">
                            <Row>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="profile" title="Doctor Consultation">
                            <Row>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className='search-resul'>
                                        <Row>
                                            <Col lg={10} xs={9}>
                                                <div className='abcd-search-res'>
                                                    <h3>Thyroid Function Test ( TFT )</h3>
                                                    <h5>3 Tests Included</h5>
                                                    <div className='price-lab-testea'>
                                                        <p>₹349/-</p>
                                                        <p className='discount-pricmes'>₹349/-</p>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} xs={3}>
                                                <img className='serach-giff' src={searchimg} alt="" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        </div>
    )
}

export default SearchDetails
