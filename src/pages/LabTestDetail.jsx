import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import fasting from "../assets/fasting.svg"
import report from "../assets/reporttime.svg"
import newlist from "../assets/newlist.png"

const LabTestDetail = () => {
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const fullText = `A lipid profile test is a normal blood test that gives you an insight of your cardiovascular health. Especially, if you are obese, diabetic or struggling with high blood pressure. The panel includes measurement of your cholesterol and triglycerides levels. Lipids are the fat molecules present in your blood, they play a key role in providing energy, smooth functioning, and growth to your body. So basically, a lipid profil...`;

  const previewText = fullText.slice(0, 250); // truncates to first 150 characters
  const items = [
    "Complete Blood Count (24)",
    "Liver Function Test (11)",
    "Kidney Function Test (7)",
    "Thyroid Profile (3)",
    "Lipid Profile (8)",
    "Blood Sugar Fasting (1)",
    "Vitamin B12 (1)",
    "Vitamin D (1)",
  ];

  return (
    <div>
      <div className="breadcrumb-bar mb-1">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    Lab Test
                  </li>
                  <li className="breadcrumb-item active">Full Body Test</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <img style={{width:'100%'}} src={newlist} alt="" />
      <div className='bookwithus' style={{ background: 'white' }}>
        <div className='text-center'>
          <h2 className='testimonial-heading'>Full Body Test</h2>
        </div>
        <Container className='mt-4'>
          <Row>
            <Col lg={6}>
              <div className='our-plan1'>
                <div className='our-plan'>
                  <h6>Basic</h6>
                  <div className='book-now-abcd1234'>
                    <h4>₹349/- <span style={{ textDecoration: 'line-through' }}>₹2325/-</span></h4>
                    <button>Book</button>
                  </div>
                  <div className='view-less-more'>
                    {(expanded1 ? items : items.slice(0, 2)).map((txt, i) => (
                      <h5 key={i}>
                        <i className="fa-solid fa-check"></i> {txt}
                      </h5>
                    ))}
                    {expanded1 && (
                      <button className='add-to-cart-lab-test'><i className="fa fa-cart-plus me-2"></i> Add to cart</button>
                    )}
                  </div>
                </div>
                <h4
                  className='view-more-all'
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpanded1(e => !e)}
                >
                  {expanded1 ? 'View less' : 'View more'}
                </h4>
              </div>
            </Col>
            <Col lg={6}>
              <div className='our-plan1'>
                <div className='our-plan'>
                  <h6>Regular</h6>
                  <div className='book-now-abcd1234'>
                    <h4>₹349/- <span style={{ textDecoration: 'line-through' }}>₹2325/-</span></h4>
                    <button>Book</button>
                  </div>
                  <div className='view-less-more'>
                    {(expanded2 ? items : items.slice(0, 2)).map((txt, i) => (
                      <h5 key={i}>
                        <i className="fa-solid fa-check"></i> {txt}
                      </h5>
                    ))}
                    {expanded2 && (
                      <button className='add-to-cart-lab-test'><i className="fa fa-cart-plus me-2"></i> Add to cart</button>
                    )}
                  </div>
                </div>
                <h4
                  className='view-more-all'
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpanded2(e => !e)}
                >
                  {expanded2 ? 'View less' : 'View more'}
                </h4>
              </div>
            </Col>
            <Col lg={6}>
              <div className='our-plan1'>
                <div className='our-plan'>
                  <h6>Advanced</h6>
                  <div className='book-now-abcd1234'>
                    <h4>₹349/- <span style={{ textDecoration: 'line-through' }}>₹2325/-</span></h4>
                    <button>Book</button>
                  </div>
                  <div className='view-less-more'>
                    {(expanded3 ? items : items.slice(0, 2)).map((txt, i) => (
                      <h5 key={i}>
                        <i className="fa-solid fa-check"></i> {txt}
                      </h5>
                    ))}
                    {expanded3 && (
                      <button className='add-to-cart-lab-test'><i className="fa fa-cart-plus me-2"></i> Add to cart</button>
                    )}
                  </div>
                </div>
                <h4
                  className='view-more-all'
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpanded3(e => !e)}
                >
                  {expanded3 ? 'View less' : 'View more'}
                </h4>
              </div>
            </Col>
            <Col lg={12}>
              <div className='kjsdkjd'>
                <h2>Test Details</h2>
                <div className='test-detail-labs'>
                  <div className='view-less-moree'>
                    <p>
                      {expandedDetails ? fullText : previewText}
                      {!expandedDetails && fullText.length > 250 ? "..." : ""}
                    </p>
                    {fullText.length > 150 && (
                      <Link
                        className='view-more-abcds'
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpandedDetails(prev => !prev)}
                      >
                        {expandedDetails ? "View less" : "View more"}
                      </Link>
                    )}
                  </div>
                  <div className='fastin-ancds'>
                    <Col lg={12}>
                      <Row>
                        <Col lg={6}>
                          <div className='fast-repot'>
                            <img src={report} alt="" />
                            <div className='content-test-labd'>
                              <h3>Report Time :</h3>
                              <h6>Report in 21 hours</h6>
                            </div>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className='fast-repot'>
                            <img src={fasting} alt="" />
                            <div className='content-test-labd'>
                              <h3>Fasting Req :</h3>
                              <h6>Yes</h6>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

        </Container>
      </div>
    </div>
  );
}

export default LabTestDetail;
