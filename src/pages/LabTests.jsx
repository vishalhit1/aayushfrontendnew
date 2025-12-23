import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import testbanner from "../assets/banner/testbanner.svg";
import banner123 from "../assets/banner/banner.svg";
import homebanner from "../assets/banner/homebanner.png";
import "../styles/lobbyDoctor.css";
import Slider from "react-slick";
import { Container, Row, Col } from "react-bootstrap";
import API from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import HomeSearch from "./Search/HomeSearch";
import Healthcategories from "./Labtests/Healthcategories";
import Popularhealthpackages from "./Labtests/Popularhealthpackages";
import Individualtest from "./Labtests/Individualtest";
import Ourpackages from "./Labtests/Ourpackages";
import banner3 from "../assets/banner/banner3.svg";
import oneline from "../assets/oneline.svg";
import twoline from "../assets/twoline.svg";
import threeline from "../assets/threeline.svg";
import LabSections from "./Labtests/LabSections";
import cat1 from "../assets/category/1.png"
import CalltoActions from "./Labtests/Labtests/CalltoActions";
import ThreeTests from "./Labtests/Labtests/ThreeTests";
import BasicInfo from "./Home/basic-info";
import Packagesforlifestyle from "./Labtests/Labtests/Packagesforlifestyle";
import VacationatHome from "./Labtests/Labtests/Vacationathome";
import Aayushhhostlic from "./Labtests/Labtests/Aayushhhostlic";
import ScreenTest from "./Labtests/Labtests/ScreenTest";
import MostBooked from "./Labtests/Labtests/MostBooked";
import TestimonailsLab from "./Labtests/Labtests/TestimonailsLab";

// ---- StickyCart now receives 'totalAmount' prop and shows it ----
const StickyCart = ({ count, totalAmount, visible }) => {
  return (
    <div
      className={`sticky-lab-cart${visible ? " show" : ""}`}
      style={{
        position: "fixed",
        bottom: "0px",
        left: 0,
        right: 0,
        margin: "0 auto",
        zIndex: 9,
        width: "100%",
        display: visible ? "initial" : "none",
        alignItems: "center",
        background: "radial-gradient(50% 50% at 50% 50%, #EDF4F5 0%, #FFFFFF 100%)",
        boxShadow: "0px 4px 4px 0px #00000040",
        borderRadius: "0px",
        padding: "15px",
        borderTop: "3px solid #0a6573",
        justifyContent: "center",
      }}
    >
      <div className="sticky-cart-all">
        <div className="numbers-abcd">
          <h3>
            {count} {count === 1 ? "item" : "items"} in cart
          </h3>
          {/* Show total amount */}
          <h6>
            ₹{totalAmount}
          </h6>
        </div>
        <Link to="/cart" className="go-to-cart-news">Go to Cart <i className="fa fa-chevron-right ms-1"></i></Link>
      </div>
    </div>
  );
};

const LabTests = () => {
  const { labCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [expandedPackages, setExpandedPackages] = useState({});
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [counters, setCounters] = useState({
    tests: 0,
    orders: 0,
    clients: 0,
  });

  const [cmsSections, setCmsSections] = useState([]);

  useEffect(() => {
    fetchTests();
    fetchPackages();
    startCounterAnimation();
    fetchCmsSections();
  }, []);

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

  const faqData = [
    {
      id: 0,
      question: "How do I choose the right test for my symptoms?",
      answer:
        "Each test page includes a detailed description, parameters covered, indications, and who should take it. You can also consult our doctors for recommendations.",
    },
    {
      id: 1,
      question: "Can I book multiple tests in one appointment?",
      answer:
        "Yes, you can add multiple tests or packages to your cart and schedule them together.",
    },
    {
      id: 2,
      question: "Is fasting required before my test?",
      answer:
        "Some tests require fasting (e.g., lipid profile, fasting blood sugar). Fasting instructions are provided on each test page.",
    },
    {
      id: 3,
      question: "How is the sample collected?",
      answer:
        "A trained phlebotomist collects blood, urine, or swab samples at your home.",
    },
    {
      id: 4,
      question: "Are there any hidden charges?",
      answer:
        "No. All prices listed on the website are final, and you see the total amount before checkout.",
    },
    {
      id: 5,
      question: "Can I track my sample and report status?",
      answer:
        "Yes, once your sample is collected, you will receive real-time updates via SMS/WhatsApp.",
    },
    {
      id: 6,
      question: "How will I receive my reports?",
      answer:
        "Reports are shared through SMS, WhatsApp, email, and directly inside your Aayush Labs account dashboard and Hard Copy(Add-on payment).",
    },
  ];

  const toggleAccordion = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  const fetchTests = async () => {
    try {
      const res = await API.get("/api/labtests/getActiveLabTests");
      setTests(res.data.tests);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lab tests");
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
      setPackages(res.data.packages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lab packages");
    }
  };

  const handleBook = () => {
    if (labCart.length === 0) return toast.error("Please select at least one item");
    const totalAmount = labCart.reduce((acc, t) => acc + t.price, 0);
    navigate("/lab/slot", {
      state: {
        selectedTests: labCart,
        totalAmount,
      },
    });
  };

  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.name]) acc[pkg.name] = [];
    acc[pkg.name].push(pkg);
    return acc;
  }, {});

  const allItems = packages;
  const categories = [
    ...new Map(
      allItems
        .filter((item) => item.category && item.category._id)
        .map((item) => [item.category._id, item.category])
    ).values(),
  ];

  const filteredTests = tests.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? t.category?._id === categoryFilter : true;
    const matchesPrice = t.price >= priceRange[0] && t.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredPackageGroups = Object.entries(groupedPackages).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchCmsSections = async () => {
    try {
      const res = await API.get("/api/cms/active");
      setCmsSections(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch homepage sections");
    }
  };

  // Compute totalAmount for sticky cart and booking
  const totalAmount = labCart && labCart.length > 0
    ? labCart.reduce((acc, t) => acc + (t.price || 0), 0)
    : 0;

  // Do not show sticky cart if empty
  const showStickyCart = labCart && labCart.length > 0;

  console.log("cmsSection>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", cmsSections)

  return (
    <div className="labtest-new-all">
      {/* Sticky Cart Bar */}
      <StickyCart
        count={labCart.length}
        totalAmount={totalAmount}
        visible={showStickyCart}
      />

      <HomeSearch />
      <CalltoActions />
      <Container>
        <div className="banner-new-labtest mb-5">
          <img src={banner123} style={{ width: "100%" }} alt="" />
        </div>
      </Container>
      {/* <Healthcategories /> */}
      <ThreeTests />
      <Popularhealthpackages />
      <MostBooked />
      <BasicInfo />
      <Ourpackages />
      <Container>
        <div className="banner-new-labtest mb-5">
          <img src={homebanner} style={{ width: "100%", borderRadius: "10px" }} alt="" />
        </div>
      </Container>
      <LabSections />

      <Packagesforlifestyle />

      <div className="test-new mt-5">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="test-new-img">
                <img src={testbanner} alt="" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="test-new-content">
                <h4>Need a Cancer Test?</h4>
                <h5>Click here to book now</h5>
                <button>Book</button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* <VacationatHome /> */}
      <Aayushhhostlic />
      <Individualtest />
      <ScreenTest />
      <TestimonailsLab />
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
                  {faq.question}
                  <span>{activeIndex === faq.id ? "−" : "+"}</span>
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
    </div>
  );
};

export default LabTests;