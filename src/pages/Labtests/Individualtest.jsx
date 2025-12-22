import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Container, Row, Col } from "react-bootstrap";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../../context/CartContext";

import booksin from "../../assets/icons/booksin.png"
import testincluded from "../../assets/icons/testincluded.png"

const Individualtest = () => {
  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [expandedPackages, setExpandedPackages] = useState({});

  const [slidesToShow, setSlidesToShow] = useState(3);
  const [slidesToShow1, setSlidesToShow1] = useState(3);

  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(false);


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
      setSlidesToShow(2.1);
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
      setSlidesToShow(4);
    }
  };

  useEffect(() => {
    console.log("Component mounted");
    fetchTests();
    // fetchPackages();
  }, [])

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

  const updateSlidesToShow1 = () => {
    const width = getWindowSize();

    if (width < 576) {
      // Mobile devices
      setSlidesToShow1(2);
    } else if (width >= 576 && width < 768) {
      // Small tablets
      setSlidesToShow1(1);
    } else if (width >= 768 && width < 992) {
      // Tablets
      setSlidesToShow1(1);
    } else if (width >= 992 && width < 1200) {
      // Small desktops
      setSlidesToShow1(3);
    } else {
      // Large desktops
      setSlidesToShow1(4);
    }
  };

  useEffect(() => {
    // Set initial value
    updateSlidesToShow1();

    // Debounce function
    let timeoutId = null;
    const handleResizeDebounced = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        updateSlidesToShow1();
      }, 150);
    };

    // Add event listener
    window.addEventListener('resize', handleResizeDebounced);
    window.addEventListener('orientationchange', updateSlidesToShow1);

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResizeDebounced);
      window.removeEventListener('orientationchange', updateSlidesToShow1);
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

  const fetchTests = async () => {
    try {
      setLoading(true)
      const res = await API.get("/api/labtests/getActiveLabTests");
      setTests(res.data.tests.slice(0, 8));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lab tests");
    } finally {
      setLoading(false)
    }
  };

  // const fetchPackages = async () => {
  //   try {
  //     const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
  //     setPackages(res.data.packages);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to fetch lab packages");
  //   }
  // };

  const isInCart = (id) => labCart.some((item) => item._id === id);

  const toggleCart = (item, type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id);
      toast.info(`${item.name} removed from cart`);
    } else {
      addToLabCart(item, type);
      toast.success(`${item.name} added to cart`);
    }
  };

  const toggleBook = (item, type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id)
    } else {
      addToLabCart(item, type);
      navigate("/cart");
    }
  };

  const togglePackage = (packageName) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageName]: !prev[packageName],
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <div className="container">

          <div className="row">
            {[...Array(6)].map((_, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text" style={{ width: "80%" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "60%" }}></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }




  return (
    <div>
      <div className='popular-test-new arrow-new-abcss'>
        <Container>
          <Row>
            <Col lg={6} className='test-popularws'>
              <h3>Individual Test</h3>
            </Col>
            <Col lg={6} xs={8} className='text-end'>
              <Link to="/individualtestlist">View all</Link>
            </Col>
          </Row>
          <div className="mobile-slider-margin123">
            <Slider {...settings} className='mt-4' key={slidesToShow}>
              {tests?.map((test, index) => (
                <div className="labtest-ibndivi-test-abcds">
                  <div style={{ cursor: "pointer" }}
                    onClick={() => window.location.href = `/individualtestdetails/${test._id}`} className='labtest-ibndivi-test-abcds-sliders' key={test._id}>
                    <h4>{test.name}</h4>
                    <p className="test-includes-lab-test">
                      {test?.includedTests?.length > 0 ? (
                        <>
                          <img className="test-includes-new" src={testincluded} alt="" />
                          {test.includedTests.length} Tests Included
                        </>
                      ) : (
                        <>
                          <img className="test-includes-new" src={testincluded} alt="" />
                          Single Test Included
                        </>
                      )}
                    </p>
                    <p className="test-includes-lab-test123"><img className="book-recently-new" src={booksin} alt="" />500+ booked recently</p>

                    <div className='lab-test-content-news'>
                      <h5>₹ {test.price}/-</h5>
                      <h6 style={{ textDecoration: 'line-through' }}>₹ {test.actualPrice}/-</h6>
                    </div>
                    {test.actualPrice && test.actualPrice > test.price ? (
                      <a href="" className="percenatge-offerses">
                        {Math.round(((test.actualPrice - test.price) / test.actualPrice) * 100)}% Off
                      </a>
                    ) : (
                      <a className="percenatge-offerses" style={{ visibility: 'hidden' }}>No Show</a>
                    )}
                    <div className="labtest-indiv-test-detail">
                      <Link className="pop-test-read-more1" to={`/individualtestdetails/${test._id}`}>
                        Read more
                      </Link>
                      <button className='book-now-labtest-actions' onClick={() => toggleBook(test, "test")}>
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
                </div>
              ))}
            </Slider>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Individualtest