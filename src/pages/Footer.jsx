import React, { useState } from 'react'
import logo from "../assets/logo/logo.png"
// import facebook from "../assets/icons/facebook.svg"
// import instagram from "../assets/icons/instagram.svg"
// import pintrest from "../assets/icons/pintrest.svg"
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const Footer = () => {
    const [activeAccordion, setActiveAccordion] = useState(null)
    const [activeMenu, setActiveMenu] = useState('home') // Track active menu item

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section)
    }

    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName)
    }

    return (
        <div>
            {/* <div className='fixed-footer'>
                <Container>
                    <Row>
                        <Col lg={3}>
                            <div 
                                className={`footer-menu ${activeMenu === 'home' ? 'active' : 'inactive'}`}
                                onClick={() => handleMenuClick('home')}
                            >
                                <i className='fa fa-home'></i>
                                <h3>
                                    <a href="">
                                        Home
                                    </a>
                                </h3>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div 
                                className={`footer-menu ${activeMenu === 'cart' ? 'active' : 'inactive'}`}
                                onClick={() => handleMenuClick('cart')}
                            >
                                <i className='fa fa-cart-plus'></i>
                                <h3>
                                    <a href="">
                                        Add to cart
                                    </a>
                                </h3>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div 
                                className={`footer-menu ${activeMenu === 'notifications' ? 'active' : 'inactive'}`}
                                onClick={() => handleMenuClick('notifications')}
                            >
                                <i className='fa fa-search'></i>
                                <h3>
                                    <a href="">
                                        Search
                                    </a>
                                </h3>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div 
                                className={`footer-menu ${activeMenu === 'profile' ? 'active' : 'inactive'}`}
                                onClick={() => handleMenuClick('profile')}
                            >
                                <i className='fa fa-user'></i>
                                <h3>
                                    <a href="">
                                        Profile
                                    </a>
                                </h3>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div> */}
            <div className='footer-top'>
                <Container>
                    <Row>
                        <Col lg={4}>
                            <div className='foot-logo'>
                                <a href="#"><img src={logo} alt="" /></a>
                                <h4>Healthcare that Fits Your Life <br/><span>Simple, Trusted, Affordable</span></h4>
                            </div>
                            {/* <div className='icons-socials'>
                                <img src={facebook} alt="" />
                                <img src={instagram} alt="" />
                                <img src={pintrest} alt="" />
                            </div> */}
                        </Col>
                        <Col lg={2}>
                            <div className='quick-links footer-accordion-section'>
                                <div
                                    className='accordion-header'
                                    onClick={() => toggleAccordion('quicklinks')}
                                >
                                    <h3>Quick Links</h3>
                                    <span className='accordion-icon'>
                                        {activeAccordion === 'quicklinks' ? '−' : '+'}
                                    </span>
                                </div>
                                <hr className='desktop-only' />
                                <div className={`accordion-content ${activeAccordion === 'quicklinks' ? 'active' : ''}`}>
                                    <ul>
                                        <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/contact">Contact Us</Link></li>
                                        <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/privacy-policy">Privacy Policies</Link></li>
                                        <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/terms-and-condition">Terms and Conditions</Link></li>
                                        <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/cancellation-policy">Cancellation Policy</Link></li>
                                        <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/about">About Us</Link></li>
                                        <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/cancellation-policy">Blogs</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col lg={2}>
                            <div className='quick-links footer-accordion-section'>
                                <div
                                    className='accordion-header'
                                    onClick={() => toggleAccordion('categories')}
                                >
                                    <h3>Categories</h3>
                                    <span className='accordion-icon'>
                                        {activeAccordion === 'categories' ? '−' : '+'}
                                    </span>
                                </div>
                                <hr className='desktop-only' />
                                <div className={`accordion-content ${activeAccordion === 'categories' ? 'active' : ''}`}>
                                    <ul>
                                        <li><Link to="/doctor-consultation" style={{ textDecoration: 'none', color: 'black' }}>Doctor Consultation</Link></li>
                                        <li><Link to="/lab-tests" style={{ textDecoration: 'none', color: 'black' }}>Book a Lab Test</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className='cont-sece'>
                                <h4>Connect with Health Advisor :</h4>
                                <div className='flex-footes'>
                                <h6><i className='fa fa-phone me-2'></i>+91 84337 32988</h6>
                                <h6><i className='fa fa-envelope me-2'></i>connect@aayushwellness.com</h6>
                                </div>
                            </div>
                            {/* <div className='icons-socials'>
                                <img src={facebook} alt="" />
                                <img src={instagram} alt="" />
                                <img src={pintrest} alt="" />
                            </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='copy-right'>
                <p>© Copyright 2025 by www.aayushlabs.com</p>
            </div>
        </div>
    )
}

export default Footer