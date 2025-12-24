import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Tabs } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import { Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import API from "../../../api/axios";
import girlimg from '../../../assets/banner/girlimg.png'
import booksin from "../../../assets/icons/booksin.png"
import testincluded from "../../../assets/icons/testincluded.png"
import { CartContext } from "../../../context/CartContext";
import { toast } from "react-toastify";
import { API_URL } from "../../../../config";

const MostBooked = () => {
    const navigate = useNavigate()

    const [slidesToShow, setSlidesToShow] = useState(3);
    const [slidesToShow1, setSlidesToShow1] = useState(3);
    const [labTests, setLabTests] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);


    useEffect(() => {

        fetchLabTests();
        fetchPackages();
    }, []);

    const fetchLabTests = async () => {
        try {
            setLoading(true)
            const res = await API.get("/api/labtests/getActiveLabTests");
            console.log("API response data:", res.data);
            // Show only eight lab tests at a time
            setLabTests(res.data.tests.slice(0, 8));
        } catch (error) {
            console.error("Failed to fetch lab tests", error);
        } finally {
            setLoading(false)
        }
    };

    const fetchPackages = async () => {
        try {
            setLoading(true)
            const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
            // Show only six packages at a time
            setPackages(res.data.packages.slice(0, 6));
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch lab packages");
        } finally {
            setLoading(false)
        }
    };

    const getWindowSize = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        }
        return 1200;
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
    };

    const toggleBook = (item, type) => {
        if (isInCart(item._id)) {
            removeFromLabCart(item._id)
        } else {
            addToLabCart(item, type);
            navigate("/cart");
        }
    };



    const updateSlidesToShow = () => {
        const width = getWindowSize();

        if (width < 576) {
            setSlidesToShow(2.1);
        } else if (width >= 576 && width < 768) {
            setSlidesToShow(2);
        } else if (width >= 768 && width < 992) {
            setSlidesToShow(2);
        } else if (width >= 992 && width < 1200) {
            setSlidesToShow(3);
        } else {
            setSlidesToShow(4);
        }
    };

    useEffect(() => {
        updateSlidesToShow();

        let timeoutId = null;
        const handleResizeDebounced = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                updateSlidesToShow();
            }, 150);
        };

        window.addEventListener('resize', handleResizeDebounced);
        window.addEventListener('orientationchange', updateSlidesToShow);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener('resize', handleResizeDebounced);
            window.removeEventListener('orientationchange', updateSlidesToShow);
        };
    }, []);

    const updateSlidesToShow1 = () => {
        const width = getWindowSize();

        if (width < 576) {
            setSlidesToShow1(1.08);
        } else if (width >= 576 && width < 768) {
            setSlidesToShow1(1);
        } else if (width >= 768 && width < 992) {
            setSlidesToShow1(1);
        } else if (width >= 992 && width < 1200) {
            setSlidesToShow1(3);
        } else {
            setSlidesToShow1(3);
        }
    };

    useEffect(() => {
        updateSlidesToShow1();

        let timeoutId = null;
        const handleResizeDebounced = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                updateSlidesToShow1();
            }, 150);
        };

        window.addEventListener('resize', handleResizeDebounced);
        window.addEventListener('orientationchange', updateSlidesToShow1);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener('resize', handleResizeDebounced);
            window.removeEventListener('orientationchange', updateSlidesToShow1);
        };
    }, []);

    const settings = {
        dots: true,
        autoplay: false,
        arrows: false,
        infinite: false,
        autoplaySpeed: 3500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: false,
        variableWidth: false,
    };

    const settings1 = {
        dots: true,
        infinite: false,
        autoplay: false,
        arrows: false,
        loop: false,
        autoplaySpeed: 3500,
        slidesToShow: slidesToShow1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: false,
        variableWidth: false,
    };


    if (loading) {
        return (
            <div style={{ padding: "20px" }}>
                <div className="container">

                    <div className="row">
                        {[...Array(6)].map((_, index) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={index}>
                                <div className="skeleton skeleton-card"></div>
                                <div className="skeleton skeleton-title"></div>
                                <div className="skeleton skeleton-text" style={{ width: "80%" }}></div>
                                <div className="skeleton skeleton-text" style={{ width: "60%" }}></div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }


    return (
        <div className='most-boooked-health'>
            <div className='popular-test-new'>
                <Container>
                    <Row>
                        <Col lg={12} className='test-popularws mb-2'>
                            <h3>Most Booked Health Checkups</h3>
                        </Col>
                    </Row>
                    <Tabs
                        defaultActiveKey="individual-test"
                        id="uncontrolled-tab-example"
                        className="mt-2"
                    >
                        <Tab eventKey="individual-test" title="Individual Test">
                            <Slider {...settings} className='margin-popular-test' key={slidesToShow}>
                                {labTests.length > 0 ? (
                                    labTests.map((test, index) => (
                                        <div className="labtest-ibndivi-test-abcds" key={test._id}>
                                            <div style={{ cursor: "pointer" }}
                                                onClick={() => window.location.href = `/individualtestdetails/${test._id}`}
                                                className="labtest-ibndivi-test-abcds-sliders">
                                                <h4>{test.name}</h4>
                                                {/* <p className="test-includes-lab-test">
                                                    {test?.includedTests?.length > 0 ? (
                                                        <>
                                                            <img className="test-includes-new" src={testincluded} alt="" />
                                                            {test.includedTests.length} Tests Included
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img className="test-includes-new" src={testincluded} alt="" />
                                                            Single Test Included
                                                        </>
                                                    )}
                                                </p> */}
                                               <p className="tests-info">{test.nooftest}+ Tests Included</p>
                                                <p className="test-includes-lab-test123">
                                                    <img
                                                        className="book-recently-new"
                                                        alt=""
                                                        src={booksin}
                                                    />
                                                    {test.recentlyBooked || "0"} booked recently
                                                </p>
                                                <div className="lab-test-content-news">
                                                    <h5>₹{test.price || 0}/-</h5>
                                                    <h6 style={{ textDecoration: "line-through" }}>₹{test.actualPrice || 0}/-</h6>
                                                </div>
                                                {test.actualPrice && test.actualPrice > test.price ? (
                                                    <a href="" className="percenatge-offerses" onClick={e => e.stopPropagation()}>
                                                        {Math.round(((test.actualPrice - test.price) / test.actualPrice) * 100)}% Off
                                                    </a>
                                                ) : (
                                                    <a className="percenatge-offerses" style={{ visibility: 'hidden' }} onClick={e => e.stopPropagation()}>No Show</a>
                                                )}
                                                <div className="labtest-indiv-test-detail">
                                                    <a
                                                        className="pop-test-read-more1"
                                                        style={{ textDecoration: "underline", color: "#2D8187", cursor: "pointer" }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            window.location.href = `/individualtestdetails/${test._id}`;
                                                        }}
                                                    >
                                                        Read more
                                                    </a>
                                                    <button
                                                        className='book-now-labtest-actions'
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            toggleBook(test, "test");
                                                        }}
                                                    >
                                                        {isInCart(test._id) ? (
                                                            <>
                                                                <i className="fa fa-minus" aria-hidden="true"></i> Added
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-plus" aria-hidden="true"></i> Book
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                ) : (
                                    <p>No lab tests available currently.</p>
                                )}
                            </Slider>

                            <Link to="/individualtestlist" className="most-book-view-all">View All</Link>
                        </Tab>
                        <Tab eventKey="test-packages" className='test-packages123' title="Test Packages">
                            <Slider {...settings1} className='margin-popular-test' key={slidesToShow1}>
                                {packages.map((pkg, index) => (
                                    <div key={pkg._id}>
                                        <div className="test-packages-sliders">
                                            <div className="health-card">
                                                <div className="blue-circle" />
                                                <div className="image-section">
                                                    <img
                                                        src={girlimg}
                                                        alt={pkg.name}
                                                    />
                                                </div>
                                                <div style={{ cursor: "pointer" }}
                                                    onClick={() => window.location.href = `/packagetestdetails/${pkg._id}`} className="card-content">
                                                    <h2 className="card-title">
                                                        {pkg.name} ({pkg.tier})
                                                    </h2>
                                                    <p className="tests-info">{pkg.nooftest}+ Tests Included</p>
                                                    {/* <p className="tests-info">{pkg.tests?.length || 0}+ Tests Included</p> */}
                                                    <div className="price-section">
                                                        <span className="current-price">₹{pkg.price}/-</span>
                                                        <span className="original-price">₹{pkg.actualPrice}/-</span>
                                                    </div>
                                                    <button className='book-now-labtest-actions' onClick={() => toggleBook(pkg, "package")}>
                                                        {isInCart(pkg._id) ? (
                                                            <>
                                                                <i className="fa fa-minus" aria-hidden="true"></i> Added
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-plus" aria-hidden="true"></i> Book
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                            <Link to="/packagetestlist" className="most-book-view-all">View All</Link>
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        </div>
    )
}

export default MostBooked
