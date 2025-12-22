import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Slider from 'react-slick'
import abcd1 from "../../assets/mens.png"
import { useNavigate } from "react-router-dom";

const Healthcategories = () => {
  const [slidesToShow, setSlidesToShow] = useState(4);
  const navigate = useNavigate();
  const getWindowSize = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
    return 1200; // Default for SSR
  };

  const updateSlidesToShow = () => {
    const width = getWindowSize();

    if (width < 576) {
      // Mobile devices - 2 slides
      setSlidesToShow(2);
    } else if (width >= 576 && width < 768) {
      // Small tablets - 2 slides
      setSlidesToShow(2);
    } else if (width >= 768 && width < 992) {
      // Tablets - 3 slides
      setSlidesToShow(3);
    } else if (width >= 992 && width < 1200) {
      // Small desktops - 3 slides
      setSlidesToShow(3);
    } else {
      // Large desktops - 4 slides
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
    rows: 2,
    slidesPerRow: 1,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: false,
    variableWidth: false,
  };

  const categories = [
    { id: "68e3a11cfc7bb661bb2ac374", name: "Men", image: abcd1 },
    { id: "68e3a11cfc7bb661bb2ac36f", name: "Women", image: abcd1 },
    { id: "68e3a11cfc7bb661bb2ac379", name: "Kids", image: abcd1 },
    { id: "68e3a11cfc7bb661bb2ac382", name: "Disease", image: abcd1 },
    { id: "69088bb6e07e7a2903652ff9", name: "Organs", image: abcd1 },
    { id: "69088bdae07e7a290365301e", name: "Others", image: abcd1 },
  ];

  const handleCategoryClick = (id, name) => {
    navigate(`/labtests/category/${id}?name=${encodeURIComponent(name)}`);
  };

  const getClassName = (index) => {
    const classNames = ['cat-1', 'cat-2', 'cat-3', 'cat-4']
    return classNames[index % 4]
  }

  return (
    <div>
      <Container className='health-catgeories-all'>
        <Row>
          <Col lg={12} className='test-popularws mt-5'>
            <h3>Health Checkup Categories</h3>
          </Col>
        </Row>
        <Slider {...settings} className='mt-4' key={slidesToShow}>
          {categories.map((cat,index) => (
            <div key={cat.id} className={`health-cat-new-mobile ${getClassName(index)}`} onClick={() => handleCategoryClick(cat.id, cat.name)}>
              <div className="health-chec-categ-content">
                <h6>{cat.name}</h6>
                <img src={cat.image} alt={cat.name} />
              </div>
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  )
}

export default Healthcategories
