import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { API_URL } from "../../../../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import videoimg from "../../../assets/banner/media.png"
import videoimg12 from "../../../assets/icons/playicon.gif"

const VideoTestimonials = ({ videos = [] }) => {
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
            setSlidesToShow(1.12);
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

    console.log("video testimonial", videos)

    return (
        <Slider {...settings} className="mt-5" key={slidesToShow}>
            {videos.map((t) => (
                <div key={t._id}>
                    <div className="videosection-testimonials-sliders123">
                        <div className="videosection-testimonials-overlay123" />
                        <video
                            controls
                            preload="metadata"
                            className="w-100"
                            src={`${API_URL}${t.videoUrl}`}
                        />
                    </div>
                </div>
            ))}
        </Slider>
    );
};

export default VideoTestimonials;
