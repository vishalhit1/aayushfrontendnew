import React, { useEffect, useState, useContext } from "react";
import { Col, Container, Row, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import Diabtes from "../../assets/diabetes.png";
import API from "../../api/axios";
import { CartContext } from "../../context/CartContext";
import { API_URL } from "../../../config";

const Popularhealthpackages = () => {
  const navigate = useNavigate()
  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);

  const [slidesToShow, setSlidesToShow] = useState(3);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState([]); // holds all tiers
  const [labData, setLabData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------- GROUP BY NAME ------------
  const groupPackages = (packages) => {
    const grouped = {};
    packages.forEach((pkg) => {
      if (!grouped[pkg.name]) grouped[pkg.name] = [];
      grouped[pkg.name].push(pkg);
    });
    return grouped;
  };
  // --------------------------------------

  // Fetch data from backend
  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const res = await API.get(`/api/labtestsdata/segregated`);
        if (res.data.success) {
          // **Group Packages**
          const updated = res.data.data.map((cat) => ({
            ...cat,
            subCategories: cat.subCategories.map((sub) => ({
              ...sub,
              groupedPackages: groupPackages(sub.packages),
            })),
          }));

          setLabData(updated);
        }
      } catch (error) {
        console.error("Error fetching lab data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabData();
  }, []);

  const handleClose = () => setShowOffcanvas(false);

  // When clicking card — send ALL tiers to Offcanvas
  const handleShow = (groupArray) => {
    setSelectedGroup(groupArray);
    setShowOffcanvas(true);
  };

  const getWindowSize = () => {
    if (typeof window !== "undefined") {
      return (
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      );
    }
    return 1200;
  };

  const updateSlidesToShow = () => {
    const width = getWindowSize();
    if (width < 576) setSlidesToShow(3.2);
    else if (width >= 576 && width < 768) setSlidesToShow(2);
    else if (width >= 768 && width < 992) setSlidesToShow(2);
    else if (width >= 992 && width < 1200) setSlidesToShow(3);
    else setSlidesToShow(6);
  };

  useEffect(() => {
    updateSlidesToShow();
    let timeoutId = null;
    const handleResizeDebounced = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSlidesToShow, 150);
    };

    window.addEventListener("resize", handleResizeDebounced);
    window.addEventListener("orientationchange", updateSlidesToShow);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResizeDebounced);
      window.removeEventListener("orientationchange", updateSlidesToShow);
    };
  }, []);

  const isInCart = (id) => labCart.some((item) => item._id === id);

  const toggleBook = (item, type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id)
    } else {
      addToLabCart(item, type);
      navigate("/cart");
    }
  };

  const settings = {
    dots: false,
    autoplay: false,
    arrows: false,
    infinite: false,
    autoplaySpeed: 3500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    adaptiveHeight: false,
    centerMode: false,
    variableWidth: false,
  };

  // Clicking card opens offcanvas with grouped tiers
  const PackageCard = ({ pkgGroup }) => {
    const first = pkgGroup[0]; // show only one package card UI
    return (
      // <div
      //   className="popular-health-new"
      //   onClick={() => handleShow(pkgGroup)}
      //   style={{ cursor: "pointer" }}
      // >
      <div
        className="popular-health-new"
        onClick={() => {
          if (pkgGroup.length > 1) {
            // multiple tiers → open offcanvas
            handleShow(pkgGroup);
          } else {
            // single tier → redirect to detail page
            navigate(`/Packagetestdetails/${pkgGroup[0]._id}`);
          }
        }}
        style={{ cursor: "pointer" }}
      >

        <div className="popular-health-new-content">
          {/* <img src={first.image || Diabtes} alt={first.name} /> */}
          <img
            src={
              first.profileImage?.[0]?.filename
                ? `${API_URL}/uploads/packages/${first.profileImage[0].filename}`
                : Diabtes
            }
            alt={first.name}
          />
          <h4>{first.name}</h4>
          <h6>
            500+ booked
            <br />
            recently
          </h6>
        </div>
      </div>
    );
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

  const tierStyles = {
    Basic: {
      bg: "#E7F0F2",
      color: "#245963",
      btn: "#46AAA0",
    },
    Regular: {
      bg: "#EAF3F4",
      color: "#245963",
      btn: "#2D8187",
    },
    Advanced: {
      bg: "#EAF3F4",
      color: "#245963",
      btn: "#245963",
    },
  };

  return (
    <div>
      <Container>
        <div className="popular-test-new12">
          <Row>
            <Col lg={6} className="test-popularws">
              <h3>Lab Test Packages</h3>
            </Col>
            <Col lg={6} xs={8} className="text-end">
              <Link to="/Packagetestlist">View all</Link>
            </Col>
          </Row>

          {/* Tabs */}
          <div className="horizontal-scroll-tabs mt-3">
            <Tabs defaultActiveKey={labData[0]?.category} id="popular-lab-tabs">
              {labData.map((cat, idx) => (
                <Tab eventKey={cat.category} title={cat.category} key={idx}>
                  <Slider {...settings} className="mt-4" key={slidesToShow}>
                    {cat.subCategories.flatMap((sub) =>
                      Object.keys(sub.groupedPackages).map((name, i) => (
                        <PackageCard
                          key={i}
                          pkgGroup={sub.groupedPackages[name]}
                        />
                      ))
                    )}
                  </Slider>
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      </Container>

      {/* Offcanvas for ALL tiers */}
      <Offcanvas
        className="offcanvas-bottom-diabtes"
        show={showOffcanvas}
        onHide={handleClose}
        placement="bottom"
      >
        <Offcanvas.Body>
          {selectedGroup.length > 0 && (
            <>
              <div className="bookwithus pt-5" style={{ background: "white" }}>
                <div className="text-center">
                  <h2 className="testimonial-heading">
                    {selectedGroup[0].name}
                  </h2>
                </div>

                <div className="mt-4 container">
                  <div className="row">
                    {selectedGroup.map((tier, index) => {
                      const style = tierStyles[tier.tier] || {};
                      return (
                        <div className="col-lg-6" key={index}>
                          <div className="our-plan1 mb-5">
                            <div
                              className="our-plan"
                              style={{
                                backgroundColor: style.bg,
                                color: style.color,
                              }}
                            >
                              <h6>{tier.tier || "Base Price"}</h6>

                              <div className="book-now-abcd1234">
                                <div className="d-block">
                                  <h4>
                                    ₹{tier.price || "-"}/-
                                    {tier.actualPrice && (
                                      <span
                                        style={{ textDecoration: "line-through" }}
                                      >
                                        ₹{tier.actualPrice}
                                      </span>
                                    )}
                                  </h4>


                                  <div className="view-less-more">
                                    <h5 style={{ color: style.color }}>
                                      {tier.tests?.length || 0} Tests Included
                                    </h5>
                                  </div>

                                  <Link className="read-more-buttonss" to={`/Packagetestdetails/${tier._id}`}>
                                    Read More
                                  </Link>
                                </div>
                                <button
                                  onClick={() => toggleBook(tier, "package")}
                                  style={{ backgroundColor: style.btn, borderColor: style.btn }}
                                >
                                  Book
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Popularhealthpackages;