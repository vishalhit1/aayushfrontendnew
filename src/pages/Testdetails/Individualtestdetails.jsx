import React, { useRef, useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Accordion, Col, Container, Row, Modal } from "react-bootstrap";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";
import testincluded from "../../assets/icons/testincluded.png";
import cat1 from "../../assets/category/1.png"
import repo1 from "../../assets/repo1.png"
import repo2 from "../../assets/repo2.png"
import repo3 from "../../assets/repo3.png"
import sample from "../../assets/sample.svg";
import reports from "../../assets/reports.svg";
import threeline from "../../assets/threeline.svg";
import banner3 from "../../assets/banner/banner3.svg";
import male from "../../assets/male.svg";
import booked from "../../assets/booked.svg";
import Individualtest from "../Labtests/Individualtest";
import Ourpackages from "../Labtests/Ourpackages";
import BookTogether from "./BookTogether";
import LabtestReviews from "./LabtestReviews";
import StickyBottomCart from "../StickyBottomCart";

const Individualtestdetails = () => {

  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const accordionRef = useRef(null);
  const [counters, setCounters] = useState({
    tests: 0,
    orders: 0,
    clients: 0,
  });
  const { id } = useParams();
  const userId = JSON.parse(localStorage.getItem('user'))?.id

  const [test, setTest] = useState(null);
  const [specificCoupons, setSpecificCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);

    // Optional: small toast or alert
    alert(`Copied: ${code}`);
  };

  const [expandedDetails, setExpandedDetails] = useState(false);
  const startCounterAnimation = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const incrementTests = 1100 / steps;
    const incrementOrders = 1100 / steps;
    const incrementClients = 1100 / steps;
    let currentStep = 0;

    const counterInterval = setInterval(() => {
      currentStep++;
      setCounters({
        tests: Math.min(Math.floor(incrementTests * currentStep), 1100),
        orders: Math.min(Math.floor(incrementOrders * currentStep), 11),
        clients: Math.min(Math.floor(incrementClients * currentStep), 1100),
      });
      if (currentStep >= steps) clearInterval(counterInterval);
    }, duration / steps);
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get(`/api/coupons/user-specific?type=lab&userId=${userId}`);
      if (data.success) setSpecificCoupons(data.lab);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await API.get(`/api/labtestmaster/${id}`);
        setTest(data.test);
      } catch (err) {
        console.error("Error fetching test:", err);
      }
    };
    startCounterAnimation();
    fetchTest();
    fetchCoupons()
  }, [id]);

  if (!test) {
    return (
      <div className="fullpage-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleCardClick = () => {
    if (accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveAccordion('1');
  };

  

  const faqData = [
    {
      id: 0,
      question: `What is the ${test.name}${test.packageName ? " (" + test.packageName + ")" : ""}?`,
      answer:
        `This test measures specific health parameters related to your ${test.organSystem || "<organ/system>"}. It helps diagnose, monitor, and evaluate your overall health condition.`,
    },
    {
      id: 1,
      question: `Why is the ${test.name}${test.packageName ? " (" + test.packageName + ")" : ""} done?`,
      answer:
        `It is recommended for individuals showing symptoms such as ${test.symptoms || "<symptoms-related>"}, or for regular health checkups and treatment monitoring. `,
    },
    {
      id: 2,
      question: "Do I need to fast before this test?",
      answer:
        test.fastingRequired
          ? "Fasting is required for this test. Please fast for 8–12 hours, or as per the test-specific instructions on the page."
          : "Fasting is not required unless otherwise instructed. Please check the test-specific instructions on the page.",
    },
    {
      id: 3,
      question: "How is the sample collected?",
      answer: test.sampleCollection || "A trained phlebotomist collects the sample from your home.",
    },
    {
      id: 4,
      question: "How long will it take to get the reports?",
      answer:
        test.reportTime
          ? `Reports are typically available within ${test.reportTime}.`
          : "Reports are typically available within 6–24 hours, depending on the nature of the test.",
    },
    {
      id: 5,
      question: "Is the test painful?",
      answer:
        "No. Only a small blood sample is taken, which causes minimal discomfort.",
    },
    {
      id: 6,
      question: "Are there any precautions to follow after the test?",
      answer:
        test.postTestPrecautions ||
        "No major precautions are required. You can resume normal activities immediately.",
    },
    {
      id: 7,
      question: "Can pregnant women take this test?",
      answer:
        "Yes, but for certain tests, doctor guidance is recommended.",
    },
    {
      id: 8,
      question: "What do abnormal results mean? ",
      answer:
        "Abnormal values may indicate underlying health conditions. A doctor consultation is advised for interpretation.",
    },
    {
      id: 9,
      question: "Can I consult a doctor after getting my report?",
      answer:
        "Yes, you can book an online consultation directly through Aayush Labs",
    },
  ];

  const toggleAccordion = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  const fullText =
    test.description ||
    "No description available for this test.";
  const previewText = fullText.slice(0, 250);

  const isInCart = (id) => labCart.some((item) => item._id === id);

  const toggleCart = (item, type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id);
      // toast.info(`${item.name} removed from cart`);
    } else {
      addToLabCart(item, type);
      // toast.success(`${item.name} added to cart`);
    }
  };

  const toggleBook = (item, type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id)
    } else {
      addToLabCart(item, type);
      navigate("/cart");
    }
  };

  console.log("test>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", test)

  return (
    <div>
      <StickyBottomCart />
      <div className="bookwithus" style={{ background: "white" }}>
        <Container>
          <div className='text-center'>
            <h2 className='testimonial-heading'>{test.name}</h2>
          </div>
          <div className="recenly-male-female">
            <Row>
              <Col lg={4} md={12} xs={6}>
                <h3><img src={booked} alt="" /> {test.recentlyBooked || "0"} booked recently</h3>
              </Col>
              <Col lg={4} md={12} xs={6}>
                <h3><img src={male} alt="" /> For Male & female</h3>
              </Col>
            </Row>
          </div>
          <div className="new-lba-testas">
            <div className="rupee-cart-both">
              <h4>
                ₹{test.price}/-
                <span style={{ textDecoration: "line-through" }}>
                  ₹{test.actualPrice || test.price}/-
                </span>
                {/* <h6 className="basic-panantest">Basic</h6> */}
              </h4>
            </div>
            {test.actualPrice && test.actualPrice > test.price && (
              <button className="off-percent-price">
                {Math.round(((test.actualPrice - test.price) / test.actualPrice) * 100)}% Off
              </button>
            )}
          </div>
          <div className="report-and-fasting-info">
            <Row>
              <Col lg={4} md={12} xs={4}>
                <div className="fast-repot">
                  <img src={repo1} alt="" />
                  <div className="content-test-labd">
                    <h3>Report Time :</h3>
                    <h6>{test.reportTime || "Within 24 hours"}</h6>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={12} xs={4}>
                <div className="fast-repot">
                  <img src={repo2} alt="" />
                  <div className="content-test-labd">
                    <h3>Fasting Req :</h3>
                    <h6>{test.fastingRequired ? "Yes" : "No"}</h6>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={12} xs={4}>
                <div className="fast-repot" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                  <img src={repo3} alt="" />
                  <div className="content-test-labd">
                    <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Total Tests <span><i className="fa fa-angle-right"></i></span></h3>
                    <h6>{test?.includedTests ? test.includedTests.length : 0} Tests</h6>
                  </div>
                </div>
              </Col>

            </Row>
          </div>
        </Container>
        {/* <Container>
          <div className="test-docvered">
            <h3>Test Covered</h3>
            <Row>
              <Col lg={10} md={12} xs={8}>
                <ul className="test-cobered-list-all">
                  {test?.includedTests?.map((t) => (
                    <li key={t._id}>{t.name}</li>
                  ))}

                </ul>
              </Col>
              <Col lg={2} md={12} xs={4}>
                {test?.includedTests && (
                  <button className="view-more-all-test-list" onClick={handleShow}>
                    View more
                  </button>
                )}
              </Col>
            </Row>
          </div>
        </Container> */}
        <Container className="mt-3 coupons-labtest-edetails">
          <Row style={{ justifyContent: "center" }}>
            <Col lg={6} md={12} sm={12} xs={12}>

              {specificCoupons?.map((c) => (
                <div key={c._id} className="custom-coupon">
                  <div className="coupon-card mx-auto my-4">

                    {/* LEFT LABEL */}
                    <div className="coupon-left">
                      <h5>Coupon</h5>
                    </div>

                    {/* CONTENT */}
                    <div className="coupon-content">
                      <div className="coupon-title">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}% OFF`
                          : `Flat ₹${c.discountValue} OFF`}
                      </div>

                      <div className="coupon-code">{c.code}</div>

                      <div className="coupon-desc">
                        Min order ₹{c.minOrderValue} • Max discount ₹{c.maxDiscount}
                      </div>
                    </div>

                    {/* COPY ICON */}
                    <div
                      className="copy-coupons"
                      onClick={() => copyCode(c.code)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-solid fa-copy"></i>
                    </div>

                  </div>
                </div>
              ))}

            </Col>
          </Row>
        </Container>

        <div>
          <Container className="mt-3">
            <Row>
              <Col lg={6} md={12} xs={6}>
                <div className="sample-fast-repot">
                  <img src={sample} alt="" />
                  <div className="sample-content-test-labd">
                    <h3>Samples Required</h3>
                    <h6>{test.sampleType}</h6>
                  </div>
                </div>
              </Col>
              <Col lg={6} md={12} xs={6}>
                <div className="sample-fast-repot">
                  <img src={reports} alt="" />
                  <div className="sample-content-test-labd">
                    <h3 style={{ color: '#1F545D', fontWeight: '500' }}>FREE Report </h3>
                    <h6 style={{ color: '#1F545D', fontWeight: '500' }}>Counselling</h6>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="add-book-buttons" ref={accordionRef}>
          <Container>
            <Row style={{ justifyContent: 'center' }}>
              <Col lg={3} md={6} xs={6}>
                <button className="cart-sss" onClick={() => toggleCart(test, "test")}>
                  {isInCart(test._id) ? (
                    <>
                      <i className="fa fa-minus" aria-hidden="true"></i> Added
                    </>
                  ) : (
                    <>
                      <i className="fa fa-plus" aria-hidden="true"></i> Add to cart
                    </>
                  )}
                </button>
              </Col>
              <Col lg={3} md={6} xs={6}>
                <button className="book-sss" onClick={() => toggleBook(test, "test")}>
                  Book
                </button>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="full-test-details-overall">
          <Container>
            <Accordion activeKey={activeAccordion} onSelect={(eventKey) => setActiveAccordion(eventKey)}>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <img className="asasawqwqw" src={testincluded} alt="icon" /> Full Test Details
                </Accordion.Header>

                <Accordion.Body>
                  {/* {test?.includedTests?.length > 0 ? (
                    test.includedTests.map((t) => (
                      <div key={t._id} className="full-test-block">
                
                        <p>
                          <strong>{t.name}</strong>
                        </p>

                        {t?.includedTests?.length > 0 ? (
                          <ul className="test-parameters-list">
                            {t.includedTests.map((p, index) => (
                              <li key={index}>{p}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-params">Single Test</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No tests available in this package.</p>
                  )} */}
                    <p className="text-start">{test.description}</p>
                    <p className="text-start">{test.parameters}</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Container>
        </div>
        <Container className="mt-4">
          <Row>
          <Col lg={12}>
                        <div className="test-detail-labs">
                            <div className="view-less-moree">
                                <h4>Know more about this test</h4>

                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: expandedDetails
                                            ? test.fulltestdetails
                                            : test.fulltestdetails?.substring(0, 250) +
                                            (test.fulltestdetails?.length > 250 ? "..." : "")
                                    }}
                                />

                                {test.fulltestdetails?.length > 250 && (
                                    <span
                                        className="view-more-abcds"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setExpandedDetails(prev => !prev)}
                                    >
                                        {expandedDetails ? "View less" : "View more"}
                                    </span>
                                )}
                            </div>

                        </div>
                    </Col>
          </Row>
      </Container>
      </div>

      <LabtestReviews />
      <hr />
      <div className="pt-5 pb-2 mb-5" style={{ background: '#F2FAF9' }}>
        <Ourpackages />
      </div>
      <Container className="mt-1 mb-1">
        <img src={banner3} style={{ width: "100%" }} alt="" />
      </Container>
      <Individualtest />
      <div className="book-teoghter-all" style={{ background: '#F2FAF9' }}>
        <BookTogether />
      </div>
      <div className='bookwithus' style={{ background: 'white' }}>
        <div className='text-center'>
          <h2 className='testimonial-heading'>Why Choose Us</h2>
        </div>
        <Container>
          <div className="row mt-2 center-items">
            <div className="col-lg-12">
              <div className="labtest-section-header">
                <h2> Aayush Wellness offers a complete online health platform designed to make your healthcare journey effortless, convenient, and truly hassle-free
                </h2>
              </div>
            </div>
            <Col lg={4} md={6} sm={6} xs={12}>
              <div className="labtest-steps-new">
                <div className="row">
                  <Col lg={3} md={6} sm={6} xs={3}>
                    <img src={cat1} alt="" />
                  </Col>
                  <Col lg={9} md={6} sm={6} xs={9}>
                    <h3>Premium Care at Pocket-Friendly Prices</h3>
                    <h6>Enjoy high-quality diagnostic tests without stretching your budget. We believe healthcare should be accessible for everyone, offering the best services at the most affordable rates.</h6>
                  </Col>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={6} xs={12}>
              <div className="labtest-steps-new">
                <div className="row">
                  <Col lg={3} md={6} sm={6} xs={3}>
                    <img src={cat1} alt="" />
                  </Col>
                  <Col lg={9} md={6} sm={6} xs={9}>
                    <h3>Accuracy You Can Rely On—Every Single Time</h3>
                    <h6>Low cost doesn’t mean low quality. All tests are processed through trusted, certified partner labs using advanced technology to deliver precise, dependable results.</h6>
                  </Col>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={6} xs={12}>
              <div className="labtest-steps-new">
                <div className="row">
                  <Col lg={3} md={6} sm={6} xs={3}>
                    <img src={cat1} alt="" />
                  </Col>
                  <Col lg={9} md={6} sm={6} xs={9}>
                    <h3>Home Collection at Your Convenience</h3>
                    <h6>Skip the travel, avoid the queues, and save both time and money. Our trained phlebotomists visit your home at your convenience, ensuring a smooth, safe, and minimal-cost sample collection experience.</h6>
                  </Col>
                </div>
              </div>
            </Col>
          </div>
        </Container>
      </div>
      <div className="counter-lab-test">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="counter13">
                <h4>{counters.tests}+</h4>
                <h6>Individual Tests</h6>
              </div>
            </Col>
            <Col lg={4}>
              <div className="counter13">
                <h4>{counters.orders}M +</h4>
                <h6>Orders Delivered</h6>
              </div>
            </Col>
            <Col lg={4}>
              <div className="counter13">
                <h4>{counters.clients}+</h4>
                <h6>Clients</h6>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* FAQs Section */}
      <div className="faqs" style={{ background: 'white' }}>
        <Container>
          <h3>Everything You Need to Know</h3>
          <div className="accordion">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                style={{
                  border: "1px solid #CFCFCF",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="heading-faqs"
                  style={{
                    backgroundColor: activeIndex === faq.id ? "#f8f9fa" : "#fff",
                  }}
                >
                  {faq.question} <span>{activeIndex === faq.id ? "−" : "+"}</span>
                </button>
                <div
                  style={{
                    maxHeight: activeIndex === faq.id ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                    backgroundColor: "#fff",
                  }}
                >
                  <div className="faqs-answer">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Tests Covered List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {test?.includedTests?.length > 0 ? (
            test.includedTests.map((t) => (
              <div key={t._id} className="covered-section">
                {/* Section Header */}
                <div className="covered-header">
                  <h5 className="covered-title">
                    {t.name}
                    <span className="count-chip">
                      {t?.includedTests?.length > 0 ? t.includedTests.length : "Single Test"}
                    </span>
                  </h5>
                </div>

                {/* Only show nested tests if present */}
                {t?.includedTests?.length > 0 && (
                  <ul className="covered-list">
                    {t.includedTests.map((inner) => (
                      <li key={inner._id}>{inner.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-3 text-muted">
              No tests included in this package.
            </div>
          )}
        </Modal.Body>
      </Modal>


    </div>
  );
};

export default Individualtestdetails;
