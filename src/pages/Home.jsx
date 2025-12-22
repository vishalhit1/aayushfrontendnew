import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

import HomeBanner from '../pages/Home/homebanner'
import Categories from '../pages/Home/categories'
import SellingPackages from '../pages/Home/selling-packages'

import banner from "../assets/banner/banner.svg"
import banner2 from "../assets/banner/banner2.svg"
import doctorbutton from "../assets/doctorbutton.png"
import labtestbutton from "../assets/booktestbutton.png"
import banner3 from "../assets/banner/banner3.svg"
import { Col, Container, Row } from 'react-bootstrap'
import DoctorConsult from '../pages/Home/doctor-consult'
import BasicInfo from '../pages/Home/basic-info'
import AgeTest from '../pages/Home/age-test'
import PopularTest from '../pages/Home/popular-test'
import AnyTest from '../pages/Home/any-test'
import VideoSection from '../pages/Home/video-section'
import Blogs from '../pages/Home/blogs'
import Faqs from '../pages/Home/faqs'
import MediaJourney from '../pages/Home/media-journey'
import Testimonials from '../pages/Home/testimonials'
import BasedTests from '../pages/Home/based-tests'
import BookWithUs from '../pages/Home/book-with-us'
import HomeSearch from './Search/HomeSearch'
import NextUpcomingBooking from './Home/NextUpcomingBooking.js'
import { Link } from 'react-router-dom'
import StickyBottomCart from "./StickyBottomCart.jsx";

const Homepage = () => {

  return (
    <div>
      <StickyBottomCart/>
      <HomeSearch />
      <HomeBanner />
      <NextUpcomingBooking />
      <Container className='mt-3 mb-3 mobile-view d-none'>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <Link to="/lab-tests">
              <img className='w-100' src={labtestbutton} alt="" />
            </Link>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <Link to="/doctor-consultation">
              <img className='w-100' src={doctorbutton} alt="" />
            </Link>
          </Col>
        </Row>
      </Container>
      <Categories />
      <SellingPackages />

      <Container>
        <img src={banner} style={{ width: '100%' }} />
      </Container>

      <DoctorConsult />

      <BasicInfo />

      <Container>
        <img src={banner2} style={{ width: '100%' }} />
      </Container>

      <PopularTest />

      <Container>
        <img src={banner3} style={{ width: '100%' }} />
      </Container>

      <AgeTest />

      <AnyTest />

      <BasedTests />

      <VideoSection />

      <BookWithUs />

      <Testimonials />

      <MediaJourney />

      <Blogs />

      <Faqs />
    </div>
  )
}

export default Homepage


