import React, { useState, useEffect, useContext } from 'react'
import { Container } from 'react-bootstrap'
import Slider from "react-slick";

import media from "../../../assets/banner/based.png"
import API from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { API_URL } from '../../../../config';

const BasedTests = () => {

    const navigate = useNavigate()
    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);

    const [slidesToShow, setSlidesToShow] = useState(3);
    const [loading, setLoading] = useState(false)
    const [testdata, setTestData] = useState([])

    // Test data array
    // const testData = [
    //     {
    //         id: 1,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 3,
    //         price: 399,
    //         originalPrice: 2325,
    //         image: media
    //     },
    //     {
    //         id: 2,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 5,
    //         price: 499,
    //         originalPrice: 1500,
    //         image: media
    //     },
    //     {
    //         id: 3,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 8,
    //         price: 599,
    //         originalPrice: 2000,
    //         image: media
    //     },
    //     {
    //         id: 4,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 6,
    //         price: 449,
    //         originalPrice: 1800,
    //         image: media
    //     },
    //     {
    //         id: 5,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 4,
    //         price: 349,
    //         originalPrice: 1200,
    //         image: media
    //     },
    //     {
    //         id: 6,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 12,
    //         price: 299,
    //         originalPrice: 900,
    //         image: media
    //     },
    //     {
    //         id: 7,
    //         title: "Thyroid Function Test",
    //         testsIncluded: 2,
    //         price: 799,
    //         originalPrice: 2500,
    //         image: media
    //     }
    // ];

    const CATEGORY_ID = "68e3a11cfc7bb661bb2ac382";

    useEffect(() => {
        const fetchLabData = async () => {
            try {
                const res = await API.get(`/api/labtestsdata/category/${CATEGORY_ID}`);
                if (res.data.success) {
                    setTestData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching lab data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabData();
    }, []);

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
            setSlidesToShow(2);
        } else if (width >= 576 && width < 768) {
            // Small tablets
            setSlidesToShow(2);
        } else if (width >= 768 && width < 992) {
            // Tablets
            setSlidesToShow(1);
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
        cssEase: 'linear',
    };

    const allTests = testdata.flatMap(item => item.tests || []);
    console.log("tests>>>>>>>>>>>>>>>", allTests)

    const isInCart = (id) => labCart.some((item) => item._id === id);

    const toggleBook = (item, type) => {
        if (isInCart(item._id)) {
            removeFromLabCart(item._id)
        } else {
            addToLabCart(item, type);
            navigate("/cart");
        }
    };

    console.log("test", allTests)

    return (
        <div>
            <div className='based-test new-section-dots-based-tests'>
                <Container>
                    <h3>Disease - Based Tests</h3>
                    <Slider {...settings} className='margin-disease-test' key={slidesToShow}>
                        {allTests.map((test, index) => (
                            <div key={test._id}>
                                <div style={{ cursor: "pointer" }}
                                    onClick={() => window.location.href = `/individualtestdetails/${test._id}`} className="based-test-sliders">

                                    <img
                                        src={
                                            test.profileImage?.[0]?.filename
                                                ? `${API_URL}/uploads/labtests/${test.profileImage[0].filename}`
                                                : media
                                        }
                                        alt={test.name}
                                    />


                                    <div className='based-slider-content'>
                                        <h4>{test.name}</h4>

                                        {/* <h5>
                                            {test.includedTests?.length > 0
                                                ? `${test.includedTests.length} Tests Included`
                                                : "Single Test"}
                                        </h5> */}
                                        <h5>
                                            {test.nooftest && test.nooftest > 0
                                                ? `${test.nooftest} Test${test.nooftest > 1 ? 's' : ''} Included`
                                                : '0 Test Included'}
                                        </h5>
                                        <div className="style-1">
                                            <ins>
                                                <span className="amount amos">₹ {test.price}/-</span>
                                            </ins>
                                            <del>
                                                <span className="amount">₹ {test.actualPrice}/-</span>
                                            </del>
                                        </div>

                                        {/* SAMPLE TYPE */}
                                        <p className="sample-type sasaqwerty">
                                            Sample: {test.sampleType?.join(", ")}
                                        </p>
                                    </div>

                                    <button className='test-book-now' onClick={() => toggleBook(test, "test")}>
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
                        ))}
                    </Slider>
                </Container>
            </div>
        </div>
    )
}

export default BasedTests
