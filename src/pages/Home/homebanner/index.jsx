import React from 'react'
import Slider from "react-slick";

import homebanner from "../../../assets/banner/homebanner.png"

const HomeBanner = () => {
    const settings = {
        dots: false,
        autoplay: true,
        arrows: false,
        infinite: true,
        autoplaySpeed: 3500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div>
            <section className="home-banner">
                <Slider {...settings}>
                    <div>
                        <img className="w-100" src={homebanner} alt="" />
                    </div>
                    <div>
                        <img className="w-100" src={homebanner} alt="" />
                    </div>
                    <div>
                        <img className="w-100" src={homebanner} alt="" />
                    </div>
                    <div>
                        <img className="w-100" src={homebanner} alt="" />
                    </div>
                    <div>
                        <img className="w-100" src={homebanner} alt="" />
                    </div>
                </Slider>
            </section>
        </div>
    )
}

export default HomeBanner