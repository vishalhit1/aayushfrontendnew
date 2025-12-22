import React, { useState, useEffect, useRef } from 'react'
import { Col, Container } from 'react-bootstrap'
import Slider from "react-slick";
import videoimg from "../../assets/banner/media.png"
import videoimg12 from "../../assets/icons/playicon.gif"

const VideoTestimonialLabs = () => {
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
            setSlidesToShow(2.12);
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
            setSlidesToShow(5);
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


    return (
        <div className='videosection-testimonials'>
            <Slider {...settings} className="mt-5" key={slidesToShow}>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
                <div>
                    <div className="videosection-testimonials-sliders">
                        <div className="videosection-testimonials-overlay" />
                        <img className="w-100" alt="" src={videoimg} />
                        <img className='gi-f-images' src={videoimg12} alt="" />
                    </div>
                </div>
            </Slider>
        </div>
    )
}

export default VideoTestimonialLabs