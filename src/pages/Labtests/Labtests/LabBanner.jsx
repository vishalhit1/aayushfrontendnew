import React from "react";
import Slider from "react-slick";
import { API_URL } from "../../../../config";

const LabBanner = ({ banners = [] }) => {
  if (!banners.length) return null;

  const settings = {
    dots: false,
    autoplay: true,
    arrows: false,
    infinite: true,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1, dots: true } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  console.log("home banners",)

  return (
    <>
      <Slider {...settings}>
        {banners.map((b) => (
          <div key={b._id}>
            <img className="w-100" src={`${API_URL}${b.imageUrl}`} alt="Home Banner" style={{ width: "100%", borderRadius: "10px" }}/>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default LabBanner;
