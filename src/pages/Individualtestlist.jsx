import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api/axios";
import newlist from "../assets/banner/homebanner.png";
import { CartContext } from "../context/CartContext"; // 👈 adjust path if different
import { LocationContext } from "../context/LocationContext.jsx";
import booksin from "../assets/icons/booksin.png"
import testincluded from "../assets/icons/testincluded.png"
import StickyBottomCart from "./StickyBottomCart.jsx";

const Individualtestlist = () => {
  const navigate = useNavigate();
  const { pincode } = useContext(LocationContext); // ✅ get pincode from context
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);


  // ✅ Use your Lab Cart Context
  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);

  // useEffect(() => {
  //   if (pincode) fetchTests();
  // }, [pincode]); // ✅ refetch whenever pincode changes


  // const fetchTests = async () => {
  //   if (!pincode) return; // skip API call if pincode not set
  //   try {
  //     setLoading(true);
  //     const res = await API.get("/api/labtests/getLabTestsWithPricing", {
  //       params: { pincode },
  //     });
  //     setTests(res.data.tests);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to fetch lab tests");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await API.get("/api/labtests");
      setTests(res.data.tests);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lab tests");
    }
  };

  const getPriceForPincode = (pricing, pincode) => {
    if (!pricing || pricing.length === 0) return null;

    return pricing.map((lab) => {
      // Try to find a pincode-specific price
      const pincodePrice = lab.pincodePricing?.find(
        (p) => p.pincode === pincode && p.status === "active"
      );

      return {
        labId: lab.labId,
        labName: lab.labName,
        price: pincodePrice?.price ?? lab.price,
        actualPrice: pincodePrice?.actualPrice ?? lab.actualPrice,
        reportTime: lab.reportTime,
      };
    });
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
    const classNames = ['cat-1', 'cat-2', 'cat-3', 'cat-4']
    return classNames[index % 4]
  }

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

      <img className="w-100 mb-4 mt-4" src={newlist} alt="Lab Tests Banner" />

      <Container>
        <div className="text-center mb-2">
          <h2 className="testimonial-heading">Individual Tests</h2>
        </div>

        <Row>
          {tests.length === 0 && (
            <p className="text-center text-muted">No tests available</p>
          )}

          {tests.map((test, index) => (
            <Col key={test._id} xl={3} lg={4} md={6} sm={6} xs={6} className="mb-2">


              <div
                className="labtest-ibndivi-test-abcds"
              >
                <div className="labtest-ibndivi-test-abcds-sliders">
                  <h4>{test.name}</h4>
                  {/* <p>{test.description?.slice(0, 40) || "Test details"}...</p> */}
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
                  <p className="test-includes-lab-test123">
                    <img
                      className="book-recently-new"
                      alt=""
                      src={booksin}
                    />
                    500+ booked recently
                  </p>
                  <div className="lab-test-content-news">
                    <h5>₹ {test.price}/-</h5>
                    {test.actualPrice && (
                      <h6 style={{ textDecoration: "line-through" }}>₹ {test.actualPrice}/-</h6>
                    )}
                  </div>
                  {test.actualPrice && test.actualPrice > test.price ? (
                    <a href="" className="percenatge-offerses">
                      {Math.round(((test.actualPrice - test.price) / test.actualPrice) * 100)}% Off
                    </a>
                  ) : (
                    <a className="percenatge-offerses" style={{ visibility: 'hidden' }}>No Show</a>
                  )}
                  <div className="labtest-indiv-test-detail">
                    <Link
                      className="pop-test-read-more1"
                      to={`/individualtestdetails/${test._id}`}
                    >
                      Read more
                    </Link>
                    <button className="book-now-labtest-actions" onClick={() => toggleBook(test,"test")}>
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

            </Col>
          ))}
        </Row>

        {/* {labCart.length > 0 && (
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={handleBook}>
              Proceed to Slot Selection ({labCart.length} Selected)
            </button>
          </div>
        )} */}
      </Container>
    </>
  );
};

export default Individualtestlist;
