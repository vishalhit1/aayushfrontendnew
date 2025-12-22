import React, { useState, useEffect, useContext } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import { API_URL } from "../../../../config";
import { DoctorFilterContext } from "../../../context/DoctorFilterContext";
import API from '../../../api/axios'

const DoctorConsult = () => {
    const { searchTerm, setSearchTerm, specialtyFilter, setSpecialtyFilter, ratingFilter, setRatingFilter, clearFilters } = useContext(DoctorFilterContext); // updated
    const navigate = useNavigate();
    const [labTests, setLabTests] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [featuredDoctors, setFeaturedDoctors] = useState([]);
    const [popularTests, setPopularTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [slidesToShow, setSlidesToShow] = useState(3);

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
            setSlidesToShow(2.11);
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
            setSlidesToShow(5);
        }
    };

    useEffect(() => {
        const fetchLabTests = async () => {
            try {
                const res = await API.get("/api/labtests"); // GET /api/lab-tests
                setLabTests(res.data.tests || []);
                // Popular tests - top 3 cheapest or based on a "popular" flag
                setPopularTests(res.data.tests?.slice(0, 3) || []);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchCategories = async () => {
            try {
                const res = await API.get("/api/category/getActiveCategories");
                setCategories((res.data.categories || []).slice(0, 9));
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        const fetchDoctors = async () => {
            try {
                const res = await API.get("/api/doctors"); // GET /api/doctors
                setDoctors(res.data.doctors || []);
                // Featured doctors - top 3 rated
                const sorted = res.data.doctors?.sort((a, b) => b.rating - a.rating).slice(0, 3);
                setFeaturedDoctors(sorted || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLabTests();
        fetchDoctors();
        fetchCategories()
    }, []);

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
        autoplaySpeed: 1500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: false,
        variableWidth: false,
        cssEase: "linear",
    };

    const getClassName = (index) => {
        const classNames = ['cat-1', 'cat-2', 'cat-3','cat-4']
        return classNames[index % 4]
    }
    return (
        <div>
            <div className='doctor-consult new-section-dots-doctores'>
                <Container>
                    <Row>
                        <Col lg={6} className='test-popularws'>
                            <h3>Consult a Doctor</h3>
                        </Col>
                        <Col lg={6} xs={8} className='text-end'>
                            <Link to="/doctors">View all</Link>
                        </Col>
                    </Row>
                    <Slider {...settings} key={slidesToShow} className='margin-consult-doctors'>
                        {categories.map((cat,index) => (
                            <div key={cat._id} >
                                <div className={`doc-sliders ${getClassName(index)}`} onClick={() => { setSpecialtyFilter(cat._id);navigate(`/doctors`) }}>
                                    <img className="w-100" src={`${API_URL}/uploads/doctorcategory/${cat.thumbnail?.map(val => val.filename)}`} alt="" />
                                    <h4>{cat.name}</h4>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </Container>
            </div>
        </div>
    )
}

export default DoctorConsult
