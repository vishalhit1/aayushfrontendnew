import React, { useState, useEffect } from 'react'
import Slider from "react-slick";
import media from "../../../assets/banner/media.png"
import { Container } from 'react-bootstrap';

const MediaJourney = () => {
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
        <div className='media-journey-section new-section-dots-media-journey'>
            <Container>
                <div className='media-journey'>
                    <h3>Experience Our Journey Through Media</h3>
                    <Slider {...settings} className='mt-5' key={slidesToShow}>
                        <div>
                            <div className='media-journey-sliders'>
                                <div className='media-overlay'></div>
                                <img className="w-100" src={media} alt="" />
                                <h4>Event 1</h4>
                            </div>
                        </div>
                        <div>
                            <div className='media-journey-sliders'>
                                <div className='media-overlay'></div>
                                <img className="w-100" src={media} alt="" />
                                <h4>Event 2</h4>
                            </div>
                        </div>
                        <div>
                            <div className='media-journey-sliders'>
                                <div className='media-overlay'></div>
                                <img className="w-100" src={media} alt="" />
                                <h4>Event 3</h4>
                            </div>
                        </div>
                        <div>
                            <div className='media-journey-sliders'>
                                <div className='media-overlay'></div>
                                <img className="w-100" src={media} alt="" />
                                <h4>Event 4</h4>
                            </div>
                        </div>
                        <div>
                            <div className='media-journey-sliders'>
                                <div className='media-overlay'></div>
                                <img className="w-100" src={media} alt="" />
                                <h4>Event 5</h4>
                            </div>
                        </div>
                        <div>
                            <div className='media-journey-sliders'>
                                <div className='media-overlay'></div>
                                <img className="w-100" src={media} alt="" />
                                <h4>Event 6</h4>
                            </div>
                        </div>
                    </Slider>
                    <button className='explore-more'>Explore More</button>
                </div>
            </Container>
        </div>
    )
}

export default MediaJourney