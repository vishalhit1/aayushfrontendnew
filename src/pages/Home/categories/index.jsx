import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import cat1 from "../../../assets/category/1.png"
import cat2 from "../../../assets/category/2.png"
import cat3 from "../../../assets/category/3.png"
import cat4 from "../../../assets/category/4.png"
import { Link } from 'react-router-dom'

const Categories = () => {
  return (
    <div>
      <div className='categories-all'>
        <Container>
          <h3>Categories</h3>
          <Row className='text-center'>
            <Col lg={3} md={6} sm={6} xs={6}>
              <Link style={{ textDecoration: 'none', color: 'black' }} to="/individualtestlist">
                <img src={cat1} alt="" />
                <h4>Individual Test</h4>
              </Link>
            </Col>
            <Col lg={3} md={6} sm={6} xs={6}>
              <Link style={{ textDecoration: 'none', color: 'black' }} to="/packagetestlist">
                <img src={cat2} alt="" />
                <h4>Test Packages</h4>
              </Link>
            </Col>
            <Col lg={3} md={6} sm={6} xs={6}>
              <Link style={{ textDecoration: 'none', color: 'black' }} to="/doctors">
                <img src={cat3} alt="" />
                <h4>Specialised Doctors</h4>
              </Link>
            </Col>
            <Col lg={3} md={6} sm={6} xs={6}>
              <Link style={{ textDecoration: 'none', color: 'black' }} to="/lobby-doctor">
                <img src={cat4} alt="" />
                <h4>General Physicians</h4>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Categories
