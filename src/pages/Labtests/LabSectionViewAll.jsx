import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../api/axios";
import newlist from "../../assets/newlist.png";
import { CartContext } from "../../context/CartContext";

const LabSectionViewAll = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);

  useEffect(() => {
    fetchSection();
  }, [id]);

  const fetchSection = async () => {
    try {
      const res = await API.get(`/api/cms/${id}`);
      setSection(res.data?.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load section");
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

  const getClassName = (index) => {
    const classNames = ["cat-1", "cat-2", "cat-3", "cat-4"];
    return classNames[index % 4];
  };

  if (!section) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      {/* --- Breadcrumb Banner --- */}
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
                  <li className="breadcrumb-item">Lab Section</li>
                  <li className="breadcrumb-item active">{section.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <img className="w-100 mb-4" src={newlist} alt="Lab Tests Banner" />

      <Container>
        <div className="text-center mb-2">
          <h2 className="testimonial-heading">{section.title}</h2>
          {/* {section.description && (
            <p className="text-muted">{section.description}</p>
          )} */}
        </div>

        {/* ✅ Packages */}
        {section.packages?.length > 0 && (
          <>
            <Row>
              {section.packages.map((pkg, index) => (
                <Col
                  key={pkg._id}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={6}
                  className="mb-5"
                >
                  <div
                    className={`individual-package-sliders-lis ${getClassName(
                      index
                    )}`}
                  >
                    <div className="popular-test-new-sliders">
                      <h4>{pkg.name}</h4>
                      <hr />
                      <p>{pkg.description?.slice(0, 40) || "Package details"}...</p>
                      <div className="popular-test-content">
                        <h5>₹ {pkg.price}/-</h5>
                        {pkg.actualPrice && (
                          <h6
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                            }}
                          >
                            ₹ {pkg.actualPrice}/-
                          </h6>
                        )}
                      </div>
                      <button
                        className="book-now"
                        onClick={() => toggleCart(pkg,"package")}
                      >
                        {isInCart(pkg._id) ? "Added" : "Book"}
                      </button>
                      <Link
                        className="pop-test-read-more1"
                        to={`/lab/package/${pkg._id}`}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* ✅ Tests */}
        {section.tests?.length > 0 && (
          <>
            {/* <h3 className="mb-3 text-primary mt-4">Individual Tests</h3> */}
            <Row>
              {section.tests.map((test, index) => (
                <Col
                  key={test._id}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={6}
                  className="mb-5"
                >
                  <div
                    className={`individual-package-sliders-lis ${getClassName(
                      index
                    )}`}
                  >
                    <div className="popular-test-new-sliders">
                      <h4>{test.name}</h4>
                      <hr />
                      <p>
                        {test.description?.slice(0, 40) || "Test details"}...
                      </p>
                      <div className="popular-test-content">
                        <h5>₹ {test.price}/-</h5>
                        {test.actualPrice && (
                          <h6
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                            }}
                          >
                            ₹ {test.actualPrice}/-
                          </h6>
                        )}
                      </div>
                      <button
                        className="book-now"
                        onClick={() => toggleCart(test,"test")}
                      >
                        {isInCart(test._id) ? "Added" : "Book"}
                      </button>
                      <Link
                        className="pop-test-read-more1"
                        to={`/lab/test/${test._id}`}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* ✅ Empty Case */}
        {section.packages?.length === 0 && section.tests?.length === 0 && (
          <p className="text-center text-muted mt-5">
            No packages or tests available
          </p>
        )}
      </Container>
    </>
  );
};

export default LabSectionViewAll;
