import React, { useState, useEffect } from 'react'
import { Col, Container, Row, Tabs } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import HomeSearch from './Search/HomeSearch'
import Faqs from './Home/faqs'
import { Link } from 'react-router-dom';
import Slider from "react-slick";

import abcd from "../assets/abcd.png"
import drimge from "../assets/drimgae.png"

const DoctorConsultation = () => {
  const [slidesToShow, setSlidesToShow] = useState(3);
  const getWindowSize = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    return 1200; // Default for SSR
  };

  const updateSlidesToShow = () => {
    const width = getWindowSize();

    if (width < 576) {
      // Mobile devices
      setSlidesToShow(3.2);
    } else if (width >= 576 && width < 768) {
      // Small tablets
      setSlidesToShow(2);
    } else if (width >= 768 && width < 992) {
      // Tablets
      setSlidesToShow(2);
    } else if (width >= 992 && width < 1200) {
      // Small desktops
      setSlidesToShow(3);
    } else {
      // Large desktops
      setSlidesToShow(5);
    }
  };

  useEffect(() => {
    // Set initial value
    updateSlidesToShow();

    // Debounce function
    let timeoutId = null;
    const handleResizeDebounced = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        updateSlidesToShow();
      }, 150);
    };

    // Add event listener
    window.addEventListener('resize', handleResizeDebounced);
    window.addEventListener('orientationchange', updateSlidesToShow);

  }, []);


  const settings = {
    dots: false,
    autoplay: true,
    arrows: false,
    infinite: true,
    autoplaySpeed: 3500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: false,
    variableWidth: false,
  };

  const categories = [
    'Cough & Cold',
    'Heart Specialist',
    'Diabetes Check',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold'
  ]

  const getClassName = (index) => {
    const classNames = ['cat-1', 'cat-2', 'cat-3']
    return classNames[index % 3]
  }

  return (
    <>
      <HomeSearch />
      <Container>
        <h3 className='upcoming-appoiunt'>Upcoming Appointment</h3>
        <Row>
          <Col lg={12}>
            <div className='upcoming-list-appoin'>
              <Row>
                <Col lg={2} xs={3}>
                  <img src={drimge} alt="" />
                </Col>
                <Col lg={10} xs={9}>
                  <div className='upcoming-content-list'>
                    <h3>Dr. Noah Patel</h3>
                    <p><span>09.00 AM</span>• Endocrinologist Specialist</p>
                    <div className='join-buttons-new'>
                      <button className='starts-butt'>Starts in 15 min</button>
                      <button className='join-button-new'><i className="fa-solid fa-video"></i> Join the Call</button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <div className='doctor-new-cat mt-5'>
          <Row>
            <Col lg={6} className='test-popularws'>
              <h3>Categories</h3>
            </Col>
            <Col lg={6} xs={8} className='text-end'>
              <Link to="/doctor-category">View all</Link>
            </Col>
          </Row>
          <Slider {...settings} className='mt-3' key={slidesToShow}>
            {categories.map((category, index) => (
              <div className={`doc-sliders ${getClassName(index)}`}>
              <img
                className="w-100"
                alt=""
                src="https://ayushlabsapi.handsintechnology.in/uploads/doctorcategory/file-1760536063484-582868247.jpg"
              />
              <h4>{category}</h4>
            </div>
              // <div key={index} className='doc-cat-new-mobile'>
              //   <div className={`cat-content ${getClassName(index)}`}>
              //     <h6>{category}</h6>
              //     <img src={abcd} alt="" />
              //   </div>
              // </div>
            ))}
          </Slider>
        </div>
      </Container>
      <Container fluid className='p-0'>
        <div className='marque-abcssd'>
          <div className='marquee-content'>
            <p>Gynaecologist</p>
            <p>Dermatology</p>
            <p>Gynaecologist</p>
            <p>Heart Specialist</p>
            <p>Diabetes Check</p>
          </div>
          {/* Duplicate for seamless loop */}
          <div className='marquee-content' aria-hidden="true">
            <p>Gynaecologist</p>
            <p>Dermatology</p>
            <p>Gynaecologist</p>
            <p>Heart Specialist</p>
            <p>Diabetes Check</p>
          </div>
        </div>
      </Container>
      <div className='bookwithus' style={{ background: 'white' }}>
        <div className='text-center'>
          <h2 className='testimonial-heading'>Why Book With Us</h2>
        </div>
        <Container>
          <div className="row mt-4 center-items">
            <div className="col-lg-12">
              <p>
                As a trusted health As a trusted healthcare provider in our community, we
                are passionate about promoting health and wellness beyond the clinic. We
                actively engage in community outreach programs, health fairs, and
                educational workshop.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className='mb-5 mt-3'>
        <div className='stepper-to-chose'>
          <Row>
            <Col lg={4} md={6} xs={4}>
              <div className='stepper-to-choose'>
                <h4>1</h4>
                <p>Lorem Ipsum is simply dummy text of the printing</p>
              </div>
            </Col>
            <Col lg={4} md={6} xs={4}>
              <div className='stepper-to-choose' style={{ background: '#17A2B80D' }}>
                <h4 style={{ background: '#17A2B8' }}>2</h4>
                <p>Lorem Ipsum is simply dummy text of the printing</p>
              </div>
            </Col>
            <Col lg={4} md={6} xs={4}>
              <div className='stepper-to-choose' style={{ background: '#1F4C5B0D' }}>
                <h4 style={{ background: '#1F4C5B' }}>3</h4>
                <p>Lorem Ipsum is simply dummy text of the printing</p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <div
        className="counter-lab-test"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #159CB2 0%, #0A6573 100%)'
        }}
      >
        <Container>
          <Row>
            <Col lg={4}>
              <div className="counter13">
                <h4>500+</h4>
                <h6>Specialised Doctor</h6>
              </div>
            </Col>
            <Col lg={4}>
              <div className="counter13">
                <h4>11M+</h4>
                <h6>Clients</h6>
              </div>
            </Col>
            <Col lg={4}>
              <div className="counter13">
                <h4>1100+</h4>
                <h6>Categories</h6>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Faqs />
    </>
  )
}

export default DoctorConsultation