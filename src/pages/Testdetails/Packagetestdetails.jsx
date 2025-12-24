import React, { useRef, useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Accordion, Col, Container, Row, Modal } from "react-bootstrap";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";
import testincluded from "../../assets/icons/testincluded.png";
import pres from "../../assets/pres.gif";
import time from "../../assets/time.gif";
import sample from "../../assets/sample.svg";
import reports from "../../assets/reports.svg";
import cat1 from "../../assets/category/1.png"
import repo1 from "../../assets/repo1.png"
import repo2 from "../../assets/repo2.png"
import repo3 from "../../assets/repo3.png"
import banner3 from "../../assets/banner/banner3.svg";
import male from "../../assets/male.svg";
import booked from "../../assets/booked.svg";
import Individualtest from "../Labtests/Individualtest";
import Ourpackages from "../Labtests/Ourpackages";
import BookTogether from "./BookTogether";
import LabtestReviews from "./LabtestReviews";
import StickyBottomCart from "../StickyBottomCart";
import LabtestPackageReviews from "./LabtestPackageReviews";

const Packagetestdetails = () => {
    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
    const navigate = useNavigate();
    const accordionRef = useRef(null);
    const userId = JSON.parse(localStorage.getItem('user'))?.id

    const [activeIndex, setActiveIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [expandedTests, setExpandedTests] = useState({});
    const [expandedDetails, setExpandedDetails] = useState(false);


    const [counters, setCounters] = useState({
        tests: 0,
        orders: 0,
        clients: 0,
    });

    const { id } = useParams();
    const [pkg, setPkg] = useState(null);
    const [pkgList, setPkgList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [specificCoupons, setSpecificCoupons] = useState([]);
    const [copiedCode, setCopiedCode] = useState("");

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);

        // Optional: small toast or alert
        alert(`Copied: ${code}`);
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const startCounterAnimation = () => {
        const duration = 2000;
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

    const toggleExpand = (testId) => {
        setExpandedTests((prev) => ({
            ...prev,
            [testId]: !prev[testId],
        }));
    };

    const handleCardClick = () => {
        if (accordionRef.current) {
            accordionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActiveAccordion('1');
    };

    useEffect(() => {
        startCounterAnimation();
        fetchPackage();
        fetchPackagesList();
        fetchCoupons()
    }, [id]);

    const fetchPackage = async () => {
        try {
            const { data } = await API.get(`/api/labtestpackage/${id}`);
            setPkg(data.package);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load package details");
        } finally {
            setLoading(false);
        }
    };

    const fetchPackagesList = async () => {
        try {
            const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
            setPkgList(res.data.packages);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch lab packages");
        }
    };

    const fetchCoupons = async () => {
        try {
            const { data } = await API.get(`/api/coupons/user-specific?type=lab&userId=${userId}`);
            if (data.success) setSpecificCoupons(data.lab);
        } catch (err) {
            console.error("Error fetching coupons:", err);
        }
    };

    console.log("specificCoupons", specificCoupons)

    if (!pkg) {
        return (
            <div className="fullpage-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    const faqData = [
        {
            id: 0,
            question: `What is the ${pkg.name}${pkg.packageName ? " (" + pkg.packageName + ")" : ""}?`,
            answer:
                `This test measures specific health parameters related to your ${pkg.organSystem || "<organ/system>"}. It helps diagnose, monitor, and evaluate your overall health condition.`,
        },
        {
            id: 1,
            question: `Why is the ${pkg.name}${pkg.packageName ? " (" + pkg.packageName + ")" : ""} done?`,
            answer:
                `It is recommended for individuals showing symptoms such as ${pkg.symptoms || "<symptoms-related>"}, or for regular health checkups and treatment monitoring. `,
        },
        {
            id: 2,
            question: "Do I need to fast before this test?",
            answer:
                pkg.fastingRequired
                    ? "Fasting is required for this test. Please fast for 8–12 hours, or as per the test-specific instructions on the page."
                    : "Fasting is not required unless otherwise instructed. Please check the test-specific instructions on the page.",
        },
        {
            id: 3,
            question: "How is the sample collected?",
            answer: pkg.sampleCollection || "A trained phlebotomist collects the sample from your home.",
        },
        {
            id: 4,
            question: "How long will it take to get the reports?",
            answer:
                pkg.reportTime
                    ? `Reports are typically available within ${pkg.reportTime}.`
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
                pkg.postTestPrecautions ||
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

    const isInCart = (id) => labCart.some((item) => item._id === id);

    const toggleCart = (item, type) => {
        if (isInCart(item._id)) {
            removeFromLabCart(item._id);
            toast.info(`${item.name} removed from cart`);
        } else {
            addToLabCart(item, type);
            toast.success(`${item.name} added to cart`);
        }
    }; ``

    const toggleBook = (item, type) => {
        if (isInCart(item._id)) {
            removeFromLabCart(item._id)

        } else {
            addToLabCart(item, type);
            navigate("/cart");
        }
    };

    const tierStyles = {
        Basic: {
            bg: "#E7F0F2",
            color: "#245963",
            btn: "#46AAA0",
        },
        Regular: {
            bg: "#EAF3F4",
            color: "#245963",
            btn: "#2D8187",
        },
        Advanced: {
            bg: "#EAF3F4",
            color: "#245963",
            btn: "#245963",
        },
    };

    const otherTiers = pkgList
        ?.filter((p) => p?.name === pkg?.name && p?._id !== pkg?._id)
        ?.sort((a, b) => a.price - b.price); // optional sorting


    return (
        <div>
            <StickyBottomCart />
            <div className="bookwithus" style={{ background: "white", paddingBottom: '0px' }}>
                <Container>
                    <div className='text-center'>
                        <h2 className='testimonial-heading'>{pkg.name}</h2>
                    </div>

                    {/* Recently booked section */}
                    <div className="recenly-male-female">
                        <Row>
                            <Col lg={4} md={12} xs={6}>
                                <h3><img src={booked} alt="" /> {pkg.recentlyBooked || "500+"} booked recently</h3>
                            </Col>
                            <Col lg={4} md={12} xs={6}>
                                {/* <h3><img src={male} alt="" /> For Male & female</h3> */}
                                <h3><img src={male} alt="" /> For {pkg.subCategories.gender == "women" ? "female" : pkg.subCategories.gender == "men" ? "Male" : "Male & female"}</h3>
                            </Col>
                        </Row>
                    </div>

                    {/* Price and discount */}
                    <div className="new-lba-testas">
                        <div className="rupee-cart-both">
                            <h4>
                                ₹{pkg.price}/-
                                <span style={{ textDecoration: "line-through" }}>
                                    ₹{pkg.actualPrice || pkg.price}/-
                                </span>
                                <h6 className="basic-panantest">{pkg.tier} Plan</h6>
                            </h4>
                        </div>
                        {pkg.actualPrice && pkg.actualPrice > pkg.price && (
                            <button className="off-percent-price">
                                {Math.round(((pkg.actualPrice - pkg.price) / pkg.actualPrice) * 100)}% Off
                            </button>
                        )}
                    </div>

                    {/* Report and Fasting info */}
                    <div className="report-and-fasting-info">
                        <Row>
                            <Col lg={4} md={12} xs={4}>
                                <div className="fast-repot">
                                    <img src={repo1} alt="" />
                                    <div className="content-test-labd">
                                        <h3>Report Time :</h3>
                                        <h6>{pkg.reportTime || "Within 24 hours"}</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={12} xs={4}>
                                <div className="fast-repot">
                                    <img src={repo2} alt="" />
                                    <div className="content-test-labd">
                                        <h3>Fasting Req :</h3>
                                        <h6>{pkg.fastingRequired ? "Yes" : "No"}</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={12} xs={4}>
                                <div className="fast-repot" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                                    <img src={repo3} alt="" />
                                    <div className="content-test-labd">
                                        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Total Tests <span><i className="fa fa-angle-right"></i></span></h3>
                                        <h6>{pkg?.nooftest} Tests</h6>
                                        {/* <h6>{pkg.tests ? pkg.tests.length : 0} Tests</h6> */}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
                {/* <Container className="mt-3 coupons-labtest-edetails">
                    <Row style={{ justifyContent: 'center' }}>
                        <Col lg={6} md={12} sm={12} xs={12}>
                            <div className="custom-coupon">
                                <div className="coupon-card mx-auto my-4">
                                    <div className="coupon-left">
                                        <h5>Coupon</h5>
                                    </div>
                                    <div className="coupon-content">
                                        <div className="coupon-title">Flat ₹25 off*</div>
                                        <div className="coupon-code">FINFIRST25</div>
                                        <div className="coupon-desc">Save ₹25 on all transactions</div>
                                    </div>
                                    <div className="copy-coupons">
                                        <i className="fa-solid fa-copy"></i>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
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

                {/* Sample type + Free report */}
                <div>
                    <Container className="mt-3">
                        <Row>
                            <Col lg={6} md={12} xs={6}>
                                <div className="sample-fast-repot">
                                    <img src={sample} alt="" />
                                    <div className="sample-content-test-labd">
                                        <h3>Samples Required</h3>
                                        <h6>{pkg.sampleType}</h6>
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

                {/* Buttons */}
                <div className="add-book-buttons">
                    <Container>
                        <Row style={{ justifyContent: 'center' }}>
                            <Col lg={3} md={6} xs={6}>
                                <button className="cart-sss" onClick={() => toggleCart(pkg, "package")}>
                                    {isInCart(pkg._id) ? (
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
                                <button className="book-sss" onClick={() => toggleBook(pkg, "package")}>
                                    Book
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            {/* Full Test Details */}
            <div className="full-test-details-overall" ref={accordionRef}>
                <Container>
                    <Accordion activeKey={activeAccordion} onSelect={(eventKey) => setActiveAccordion(eventKey)}>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <img className="asasawqwqw" src={testincluded} alt="icon" /> Full Test Details
                            </Accordion.Header>

                            <Accordion.Body>
                                {/* {pkg?.tests?.length > 0 ? (
                                    pkg.tests.map((t) => {
                                        const isExpanded = expandedTests[t._id] || false;
                                        const hasParams = t?.includedTests?.length > 0;

                                        const visibleParams = hasParams
                                            ? isExpanded
                                                ? t.includedTests
                                                : t.includedTests.slice(0, 2)
                                            : [];

                                        return (
                                            <div key={t._id} className="full-test-block">
                                                <p className="test-title">
                                                    <strong>{t.name}</strong>
                                                </p>
                                                {hasParams ? (
                                                    <p className="test-parameters-list">
                                                        {t.includedTests.map(p => p.name || "Unnamed Test").join(", ")}
                                                    </p>
                                                ) : (
                                                    <p className="no-params">Single Test</p>
                                                )}


                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted">No tests available in this package.</p>
                                )} */}
                                <p className="text-start">{pkg.description}</p>
                                <p className="text-start">{pkg.parameters}</p>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Container>
            </div>

            {/* Know more about test */}
            <Container className="mt-4">
                <Row>
                    <Col lg={12}>
                        <div className="test-detail-labs">
                            <div className="view-less-moree">
                                <h4>Know more about this test</h4>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: expandedDetails
                                            ? pkg.fulltestdetails
                                            : pkg.fulltestdetails?.substring(0, 550) +
                                            (pkg.fulltestdetails?.length > 255500 ? "..." : "")
                                    }}
                                />
                                {pkg.fulltestdetails?.length > 550 && (
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

            <LabtestPackageReviews />

            <hr className="mt-3" />

            {otherTiers?.length > 0 && (
                <div className="compare-other-plans">
                    <Container>
                        <h3>Compare with Other Plans</h3>
                        <Row>
                            {otherTiers.map((plan, index) => {
                                const style = tierStyles[plan.tier] || {};
                                return (
                                    <div className="col-lg-6" key={index}>
                                        <div
                                            className="our-plan1 mb-5"
                                            style={{ background: style.bg }}
                                        >
                                            <div className="our-plan">
                                                <h6 style={{ color: style.color }}>
                                                    {plan.tier}
                                                </h6>

                                                <div className="book-now-abcd1234">
                                                    <div className="d-block">
                                                        <h4>
                                                            ₹{plan.price}/-
                                                            <span style={{ textDecoration: "line-through" }}>
                                                                ₹{plan.actualPrice}/-
                                                            </span>
                                                        </h4>
                                                        <div className="view-less-more">
                                                            <h5 style={{ color: style.color }}>
                                                                {plan.tests.length} Tests Included
                                                            </h5>
                                                        </div>

                                                        <Link className="read-more-buttonss" to={`/Packagetestdetails/${plan._id}`}>
                                                            Read More
                                                        </Link>
                                                    </div>
                                                    <div className="">

                                                        <button style={{ background: style.btn }} onClick={() => toggleBook(plan, "package")}>
                                                            Book
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Row>
                    </Container>
                </div>
            )}

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
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Test Covered List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pkg?.tests?.length > 0 ? (
                        pkg.tests.map((t) => (
                            <div key={t._id}>
                                <h3 className="testcovered-list-all">{t.name} ({t?.includedTests?.length > 0 ? t.includedTests.length : "Single Test"})</h3>
                                {t?.includedTests?.length > 0 && (
                                    <ul className="test-cobered-list-all">
                                        {t.includedTests.map((inner) => (
                                            <li key={inner._id}>{inner.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))) : (
                        <div className="text-center py-3 text-muted">
                            No tests included in this package.
                        </div>
                    )
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Packagetestdetails;