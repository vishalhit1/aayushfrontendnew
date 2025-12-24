import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { CartContext } from "../../context/CartContext";
import booksin from "../../assets/icons/booksin.png";
import testincluded from "../../assets/icons/testincluded.png";
import kidney from "../../assets/icons/kidney.png";
import girlimg from "../../assets/banner/girlimg.png";

const LabSections = () => {
  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [cmsSections, setCmsSections] = useState([]);
  const [loading, setLoading] = useState(false);


  // Separate states for slidesToShow for packages and tests
  const [slidesToShowPackages, setSlidesToShowPackages] = useState(4);
  const [slidesToShowTests, setSlidesToShowTests] = useState(4);

  // Update function for packages slider slides count based on window width
  const updateSlidesToShowPackages = () => {
    const width = window.innerWidth;
    if (width < 576) setSlidesToShowPackages(1.08); // example custom value for small screens
    else if (width < 992) setSlidesToShowPackages(2);
    else setSlidesToShowPackages(3);
  };

  // Update function for tests slider slides count based on window width
  const updateSlidesToShowTests = () => {
    const width = window.innerWidth;
    if (width < 576) setSlidesToShowTests(2.1);
    else if (width < 992) setSlidesToShowTests(3);
    else setSlidesToShowTests(4);
  };

  useEffect(() => {
    fetchCmsSections();
    updateSlidesToShowPackages();
    updateSlidesToShowTests();
    const handleResize = () => {
      updateSlidesToShowPackages();
      updateSlidesToShowTests();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch CMS sections dynamically
  const fetchCmsSections = async () => {
    try {
      setLoading(true)
      const res = await API.get("/api/cms/active");
      setCmsSections(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch CMS sections");
    } finally {
      setLoading(false)
    }
  };

  // Slider settings for packages slider
  const sliderSettingsPackages = {
    dots: true,
    autoplay: true,
    arrows: true,
    infinite: true,
    autoplaySpeed: 3500,
    slidesToShow: slidesToShowPackages,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  // Slider settings for tests slider
  const sliderSettingsTests = {
    dots: true,
    autoplay: true,
    arrows: true,
    infinite: true,
    autoplaySpeed: 3500,
    slidesToShow: slidesToShowTests,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

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
    <div className="lab-sections-wrapper pt-5 pb-3">
      {cmsSections.length === 0 ? (
        null
      ) : (
        cmsSections.map((section) => (
          <Container key={section._id} className="mb-5 aayush-new-packages">
            <Row>
              <Col lg={12} className="test-popularws">
                <h3>{section.title}</h3>
              </Col>
            </Row>

            {/* Packages slider */}

            <div className="mobile-slider-margin">
              {section.packages?.length > 0 && (
                <Slider {...sliderSettingsPackages} className="mt-4" key={slidesToShowPackages}>
                  {section.packages.map((pkg) => (
                    <div key={pkg._id}>
                      <div style={{ cursor: "pointer" }}
                        onClick={() => window.location.href = `/packagetestdetails/${pkg._id}`} className="test-packages-sliders">
                        <div className="health-card">
                          <div className="blue-circle" />
                          <div className="image-section">
                            <img alt="Package" src={girlimg} />
                          </div>
                          <div className="card-content">
                            <h2 className="card-title">{pkg.name}</h2>
                            {/* <p className="tests-info">{pkg.testsIncluded || pkg.tests?.length || 0}+ Tests Included</p> */}
                            <p className="tests-info">{pkg.nooftest}+ Tests Included</p>
                            <div className="price-section">
                              <span className="current-price">₹{pkg.price}/-</span>
                              {pkg.actualPrice && (
                                <span className="original-price">₹{pkg.actualPrice}/-</span>
                              )}
                            </div>
                            <button onClick={() => toggleBook(pkg, "package")} className="book-btn">
                              {isInCart(pkg._id) ? (
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
                    </div>
                  ))}
                </Slider>
              )}
            </div>

            {/* Tests slider */}
            <div className="mobile-slider-margin12">
              {section.tests?.length > 0 && (
                <Slider {...sliderSettingsTests} className="mt-4" key={slidesToShowTests}>
                  {section.tests.map((test) => (
                    <div key={test._id}>
                      <div style={{ cursor: "pointer" }}
                        onClick={() => window.location.href = `/individualtestdetails/${test._id}`} className="labtest-ibndivi-test-abcds">
                        <div className="labtest-ibndivi-test-abcds-sliders">
                          <img className="test-images-1232122" src={kidney} alt="" />
                          <h4 style={{ height: "auto" }}>{test.name}</h4>
                          {/* <p className="test-includes-lab-test">
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
                          </p> */}
                          {/* <p className="test-includes-lab-test">
                            {test.nooftest && test.nooftest > 0
                              ? `${test.nooftest} Test${test.nooftest > 1 ? 's' : ''} Included`
                              : '0 Test Included'}
                          </p> */}
                          <p className="test-includes-lab-test">{test.nooftest}+ Tests Included</p>
                          <p className="test-includes-lab-test123">
                            <img className="book-recently-new" src={booksin} alt="" />500+ booked recently
                          </p>
                          <div className="lab-test-content-news">
                            <h5>₹ {test.price}/-</h5>
                            <h6 style={{ textDecoration: "line-through" }}>₹ {test.actualPrice}/-</h6>
                          </div>
                          <div className="labtest-indiv-test-detail">
                            <Link className="pop-test-read-more1" to={`/individualtestdetails/${test._id}`}>
                              Read more
                            </Link>
                            <button className="book-now-labtest-actions" onClick={() => toggleBook(test, "test")}>
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
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </Container>
        ))
      )}
    </div>
  );
};

export default LabSections;