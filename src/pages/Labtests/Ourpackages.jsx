import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import API from "../../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";


const Ourpackages = () => {
    const navigate = useNavigate()
    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);

    const [slidesToShow, setSlidesToShow] = useState(3);

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log("Component mounted");
        fetchPackages();
    }, [])

    const fetchPackages = async () => {
        try {
            setLoading(true)
            const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
            // Show only six packages at a time
            setPackages(res.data.packages.slice(0, 8));
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
        return 1200; // Default for SSR
    };


    const updateSlidesToShow = () => {
        const width = getWindowSize();

        if (width < 576) {
            // Mobile devices
            setSlidesToShow(2.1);
        } else if (width >= 576 && width < 768) {
            // Small tablets
            setSlidesToShow(2);
        } else if (width >= 768 && width < 992) {
            // Tablets
            setSlidesToShow(2);
        } else if (width >= 992 && width < 1200) {
            // Small desktops
            setSlidesToShow(3);
        } else {
            // Large desktops
            setSlidesToShow(4);
        }
    };

    useEffect(() => {
        // Set initial value
        updateSlidesToShow();
        // Debounce function
        let timeoutId = null;
        const handleResizeDebounced = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                updateSlidesToShow();
            }, 150);
        };

        // Add event listener
        window.addEventListener('resize', handleResizeDebounced);
        window.addEventListener('orientationchange', updateSlidesToShow);

        // Cleanup
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener('resize', handleResizeDebounced);
            window.removeEventListener('orientationchange', updateSlidesToShow);
        };
    }, []);


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
    };

    const getClassName = (index) => {
        const classNames = ['cat-1', 'cat-2', 'cat-3']
        return classNames[index % 3]
    }


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
        <div>
            <Container className='mb-3 pb-4 aayush-new-packages'>
                <Row>
                    <Col lg={6} className='test-popularws'>
                        <h3>Recommended For You</h3>
                    </Col>
                    <Col lg={6} className='text-end'>
                        <Link to="/Packagetestlist">View all</Link>
                    </Col>
                </Row>
                <div className="mobile-slider-margin123">
                    <Slider {...settings} className='mt-4' key={slidesToShow}>
                        {packages.map((pkg, index) => (
                            <div key={pkg._id}>
                                <div style={{ cursor: "pointer" }}
                                    onClick={() => window.location.href = `/packagetestdetails/${pkg._id}`} className={`popular-test-new-sliders121 ${getClassName(index)}`}>
                                    <div className='popular-test-content'>
                                        <h4>{pkg.name} ({pkg.tier})</h4>
                                        <p>{pkg.tests?.length || 0}+ Tests Included</p>
                                        <div className="price-lab-test">
                                            <h5>₹ {pkg.price}/-</h5>
                                            <h6 style={{ textDecoration: 'line-through' }}>₹ {pkg.actualPrice}/-</h6>
                                        </div>
                                    </div>
                                    <div className="button-latst-conte">
                                        <Link className="pop-test-read-more" to={`/Packagetestdetails/${pkg._id}`}>
                                            Read more
                                        </Link>
                                        <button onClick={() => toggleBook(pkg, "package")}>
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
                        ))}
                    </Slider>
                </div>
            </Container>
        </div>
    )
}


export default Ourpackages