import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Tabs } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import { Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { toast } from "react-toastify";
import API from "../../../api/axios";
import girlimg from '../../../assets/banner/girlimg.png'
import testincluded from '../../../assets/icons/testincluded.png'
import booksin from '../../../assets/icons/booksin.png'
import { CartContext } from "../../../context/CartContext"; // 👈 adjust path if different
import { API_URL } from "../../../../config";


const PopularTest = () => {
    const navigate = useNavigate()
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [slidesToShow1, setSlidesToShow1] = useState(3);
    const [labTests, setLabTests] = useState([]);
    const [packages, setPackages] = useState([]);

    const [loading, setLoading] = useState(false); // ✅ ADDED (nothing else changed)

    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
    // Dummy test packages data
    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
            setPackages(res.data.packages.slice(0, 8));
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch lab packages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchLabTests = async () => {
            try {
                const res = await API.get("/api/labtests");
                console.log("API response data:", res.data);
                setLabTests(res.data.tests.slice(0, 8));
            } catch (error) {
                console.error("Failed to fetch lab tests", error);
            }
        };
        fetchLabTests();
    }, []);

    const getWindowSize = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        }
        return 1200;
    };

    const updateSlidesToShow = () => {
        const width = getWindowSize();

        if (width < 576) {
            setSlidesToShow(2.11);
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
            setSlidesToShow1(1.06);
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

    const isInCart = (id) => labCart.some((item) => item._id === id);

    const toggleCart = (item, type) => {
        if (isInCart(item._id)) {
            removeFromLabCart(item._id);
            toast.info(`${item.name} removed from cart`);
        } else {
            addToLabCart(item);
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

    const settings = {
        dots: true,
        autoplay: true,
        arrows: false,
        infinite: true,
        autoplaySpeed: 3500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: false,
        variableWidth: false,
        cssEase: 'linear',
    };

    const settings1 = {
        dots: true,
        autoplay: true,
        arrows: false,
        infinite: true,
        autoplaySpeed: 3500,
        slidesToShow: slidesToShow1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: false,
        variableWidth: false,
        cssEase: 'linear',
    };

    const getClassName = (index) => {
        const classNames = ['cat-1', 'cat-2', 'cat-3']
        return classNames[index % 3]
    }

    return (
        <div className='popular-test-new mobile-css'>
            <Container>
                <Row>
                    <Col lg={6} className='test-popularws'>
                        <h3>Our Popular Tests</h3>
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
                                    <div key={test._id}>
                                        <div style={{ cursor: "pointer" }}
                                            onClick={() => window.location.href = `/individualtestdetails/${test._id}`} className="labtest-ibndivi-test-abcds">
                                            <div className="labtest-ibndivi-test-abcds-sliders">
                                                <h4>{test.name}</h4>
                                                <p className="test-includes-lab-test">
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
                                                </p>
                                                <p className="test-includes-lab-test123">
                                                    <img
                                                        className="book-recently-new"
                                                        alt=""
                                                        src={booksin}
                                                    />
                                                    500+ booked recently
                                                </p>
                                                <div className="lab-test-content-news">
                                                    <h5>₹ {test.price || 0}/-</h5>
                                                    <h6 style={{ textDecoration: "line-through" }}>₹ {test.actualPrice || 0}/-</h6>
                                                </div>
                                                {test.actualPrice && test.actualPrice > test.price ? (
                                                    <a href="" className="percenatge-offerses">
                                                        {Math.round(((test.actualPrice - test.price) / test.actualPrice) * 100)}% Off
                                                    </a>
                                                ) : (
                                                    <a className="percenatge-offerses" style={{ visibility: 'hidden' }}>No Show</a>
                                                )}
                                                <div className="labtest-indiv-test-detail">
                                                    <Link
                                                        className="pop-test-read-more1"
                                                        to={`/individualtestdetails/${test._id}`}
                                                    >
                                                        Read more
                                                    </Link>
                                                    <button className="book-now-labtest-actions" onClick={() => toggleBook(test, "test")}>
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
                                    <div style={{ cursor: "pointer" }}
                                        onClick={() => window.location.href = `/packagetestdetails/${pkg._id}`} className={`test-packages-sliders ${getClassName(index)}`}>
                                        <div className="health-card">
                                            <div className="blue-circle" />
                                            <div className="image-section">
                                                {/* <img
                                                    src={girlimg}
                                                    alt={pkg.name}
                                                /> */}
                                                <img
                                                    src={
                                                        pkg.profileImage?.[0]?.filename
                                                            ? `${API_URL}/uploads/packages/${pkg.profileImage[0].filename}`
                                                            : girlimg
                                                    }
                                                    alt={pkg.name}
                                                />
                                            </div>
                                            <div className="card-content">
                                                <h2 className="card-title">
                                                    {pkg.name}
                                                </h2>
                                                <p className="tests-info">{pkg.tests?.length || 0}+ Tests Included</p>
                                                <div className="price-section">
                                                    <span className="current-price">₹{pkg.price}/-</span>
                                                    <span className="original-price">₹{pkg.actualPrice}/-</span>
                                                </div>
                                                <button onClick={() => toggleBook(pkg, "package")} className="book-btn">
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
    )
}

export default PopularTest
