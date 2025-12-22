import React, { useState, useEffect, useRef } from 'react'
import { Col, Container } from 'react-bootstrap'
import Slider from "react-slick";
import API from '../../../api/axios';
import { API_URL } from '../../../../config';
import VideoTestimonialLabs from '../VideoTestimonialLabs';
const TestimonailsLab = () => {
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const res = await API.get("/api/labtestimonial");
                setTestimonials(res.data.data || []);
            } catch (err) {
                console.log("Error loading testimonials");
            }
        })();
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
            setSlidesToShow(1.06);
        } else if (width >= 576 && width < 768) {
            // Small tablets
            setSlidesToShow(1);
        } else if (width >= 768 && width < 992) {
            // Tablets
            setSlidesToShow(2);
        } else if (width >= 992 && width < 1200) {
            // Small desktops
            setSlidesToShow(3);
        } else {
            // Large desktops
            setSlidesToShow(3);
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
        dots: false,
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
    const [counts, setCounts] = useState({
        doctors: 0,
        specialities: 0,
        bookings: 0,
        labTests: 0,
        testPackages: 0
    });
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateCounters();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [hasAnimated]);
    const animateCounters = () => {
        const targets = {
            doctors: 500,
            specialities: 18,
            bookings: 3000,
            labTests: 317,
            testPackages: 97
        };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounts({
                doctors: Math.floor(targets.doctors * progress),
                specialities: Math.floor(targets.specialities * progress),
                bookings: Math.floor(targets.bookings * progress),
                labTests: Math.floor(targets.labTests * progress),
                testPackages: Math.floor(targets.testPackages * progress)
            });
            if (step >= steps) {
                clearInterval(timer);
                setCounts(targets);
            }
        }, interval);
    };
    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num;
    };
    return (
        <div className='testi-sasxs labtest-testimonails'>
            <Container>
                <div className='testimonails-section' ref={sectionRef}>
                    <h2 className='testimonial-heading'>Testimonials</h2>
                    <h3>15k Users Trust Aayush Wellness Limited Worldwide</h3>
                    <VideoTestimonialLabs/>
                    <Slider {...settings} className="mt-4" key={slidesToShow}>
                        {testimonials?.map((item, index) => (
                            <div key={index}>
                                <div className='testimonials-sliders'>
                                    <div className="testimonail-card">
                                        <div className="card-body">
                                            {/* Rating */}
                                            <div className="d-flex align-items-center mb-4">
                                                <div className="rating d-flex">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`fa ${i < item.rating ? "fa-star" : "fa-star-o"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Title */}
                                            {/* <h6 className="heading-testii">{item.heading || "Excellent Service"}</h6> */}
                                            {/* Review Content */}
                                            <p className="test-content">
                                                {item.content}
                                            </p>
                                            {/* User Info */}
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-lg">
                                                    <img
                                                        src={item.avatar ? `${API_URL}${item.avatar}` : "https://p7.hiclipart.com/preview/782/114/405/5bbc3519d674c.jpg"}
                                                        className="rounded-circle"
                                                        alt="img"
                                                    />
                                                </a>
                                                <div className="ms-2">
                                                    <h6 className="mb-1">
                                                        <a href="javascript:void(0);">{item.name}</a>
                                                    </h6>
                                                    <p className="fs-14 mb-0">{item.role}</p>
                                                </div>
                                            </div>
                                        </div>
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
export default TestimonailsLab