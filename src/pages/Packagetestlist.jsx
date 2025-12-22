import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";
import newlist from "../assets/banner/homebanner.png";
import { CartContext } from "../context/CartContext"; // 👈 adjust path if different
import StickyBottomCart from "./StickyBottomCart";

const Packagetestlist = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);


  // ✅ Use your Lab Cart Context
  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/labtestpackage/getAllActiveTestPackages");
      setPackages(res.data.packages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lab packages");
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (id) => labCart.some((item) => item._id === id);

  const toggleCart = (item,type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id);
      toast.info(`${item.name} removed from cart`);
    } else {
      addToLabCart(item,type);
      toast.success(`${item.name} added to cart`);
    }
  };

  const toggleBook = (item,type) => {
    if (isInCart(item._id)) {
      removeFromLabCart(item._id)
    } else {
      addToLabCart(item,type);
      navigate("/cart");
    }
  };

  const handleBook = () => {
    if (labCart.length === 0) return toast.error("Please select at least one test");
    const totalAmount = labCart.reduce((acc, t) => acc + t.price, 0);
    navigate("/lab/slot", {
      state: {
        selectedTests: labCart,
        totalAmount,
      },
    });
  };

  const getClassName = (index) => {
    const classNames = ['cat-1', 'cat-2', 'cat-3']
    return classNames[index % 3]
  }

  if (loading) {
    return (
      <div className="fullpage-loader">
        <div className="spinner"></div>
      </div>
    );
  }


  return (
    <>
      <StickyBottomCart/>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Lab Test</li>
                  <li className="breadcrumb-item active">Individual Test</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <img className="w-100 mb-4" src={newlist} alt="Lab Tests Banner" />

      <Container>
        <div className="text-center mb-2">
          <h2 className="testimonial-heading">Test Package List</h2>
        </div>

        <Row>
          {packages.length === 0 && (
            <p className="text-center text-muted">No Test Package Available</p>
          )}

          {packages.map((test, index) => (
            <Col key={test._id} xl={3} lg={3} md={6} sm={6} xs={6} className="mb-5">
              <div className={`popular-test-new-sliders121 ${getClassName(index)}`}>
                <div className='popular-test-content' style={{ cursor: "pointer" }} onClick={() => window.location.href = `/packagetestdetails/${test._id}`}>
                  <h4>{test.name}</h4>
                  <p>{test.description?.slice(0, 40) || "Test details"}...</p>
                  <div className="price-lab-test">
                    <h5>₹ {test.price}/-</h5>
                    <h6 style={{ textDecoration: 'line-through' }}>₹ {test.actualPrice}/-</h6>
                  </div>
                </div>
                <div className="button-latst-conte">
                  <Link className="pop-test-read-more" to={`/packagetestdetails/${test._id}`}>
                    Read more
                  </Link>
                  <button onClick={() => toggleBook(test,"package")}>
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
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Packagetestlist;
