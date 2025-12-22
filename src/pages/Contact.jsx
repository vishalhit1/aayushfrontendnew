import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'

const Contact = () => {
  return (
    <div>
      <div style={{
        background: '#F2FAF9',
        color: 'black',
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0, marginBottom: '10px' }}>
          Contact Us
        </h1>
      </div>
      <div className='form-contact-mew'>
        
        <Container>
          <Row>
            <Col lg={4}>
              <div className='contact-new-sections'>
              <i className="fa-solid fa-phone"></i>
                <h4>Call Now</h4>
                <p>
                  <a href="tel:+918433732988" style={{ textDecoration: 'none', color: 'inherit' }}>
                    +91 84337 32988
                  </a>
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div className='contact-new-sections'>
              <i className="fa-brands fa-whatsapp"></i>
                <h4>WhatsApp</h4>
                <p>
                  <a
                    href="https://wa.me/918433732988"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    +91 84337 32988
                  </a>
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div className='contact-new-sections'>
              <i className="fa fa-envelope" aria-hidden="true"></i>
                <h4>Email</h4>
                <p>
                  <a
                    href="mailto:connect@aayushwellness.com"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    connect@aayushwellness.com
                  </a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col lg={6}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.709354010812!2d72.8503223!3d19.1641957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b753253ebf63%3A0x96f76a1648eb40ed!2sAayush%20Wellness%20Limited!5e0!3m2!1sen!2sin!4v1765778831649!5m2!1sen!2sin"
                width="100%"
                height={650}
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

            </Col>
            <Col lg={6}>
              <div className='form-section'>
                <h3>Get in Touch</h3>
                <p className="subtitle">We'd love to hear from you. Send us a message!</p>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="email" placeholder="Enter Subject" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Message</Form.Label>
                    <Form.Control style={{height:'auto'}} placeholder="Enter Message" as="textarea" rows={3} />
                  </Form.Group>
                  <button className='form-submit-new'>Submit Query</button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Contact
