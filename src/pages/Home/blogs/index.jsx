import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import blog from "../../../assets/blogs/blog.jpg"
import { Container } from 'react-bootstrap';
import API from '../../../api/axios';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {
    const navigate = useNavigate()
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [blogs, setBlogs] = useState([]);



    const fetchPublishedBlogs = async () => {
        try {
            const res = await API.get("/api/blogs/status/published");
            setBlogs(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch blogs");
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
        fetchPublishedBlogs();
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

    return (
        <div className='blogs-section new-section-dots-blogs'>
            <Container>
                <div className='our-blogs'>
                    <h3>Stay Updated With Our Latest Blogs</h3>
                    <Slider {...settings} className='mt-5' key={slidesToShow}>
                        {blogs.map((item) => (
                            <div>
                                <div className='blog-sliders'>
                                    <div className='date'>
                                        <h6>{new Date(item.createdAt).getDate()}</h6>
                                        <span>
                                            {new Date(item.createdAt).toLocaleString("en-IN", {
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <img
                                        className="w-100"
                                        src={
                                            item.thumbnail
                                                ? `${API.defaults.baseURL}${item.thumbnail}`
                                                : blog
                                        }
                                        alt={item.title}
                                    />
                                    <div className='blog-content'>
                                        <h4>{item.title}</h4>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: item.content.slice(0, 120) + "...",
                                            }}
                                        />
                                        <a href={`/blogs/${item.slug || item._id}`}>Read More</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    <button className='view-all-blogs' onClick={(e)=> navigate("/blogs")}>
                        View All Blogs
                    </button>
                </div>
            </Container>
        </div>
    )
}

export default Blogs