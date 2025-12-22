import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import testbanner from "../../../assets/banner/testbanner.png"

const AnyTest = () => {
  return (
    <div className='test-new'>
        <Container>
            <Row>
                <Col lg={4}>
                    <div className='test-new-img'>
                        <img src={testbanner} alt="" />
                    </div>
                </Col>
                <Col lg={6}>
                    <div className='test-new-content'>
                        <h4>Need a Cancer Test ?</h4>
                        <h5>Click here to book now</h5>
                        <button>Book</button>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default AnyTest
