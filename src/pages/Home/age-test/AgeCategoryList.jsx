import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

import booksin from "../../../assets/icons/booksin.png";
import testincluded from "../../../assets/icons/testincluded.png";
import API from "../../../api/axios";
import { CartContext } from "../../../context/CartContext";
import { LocationContext } from "../../../context/LocationContext";
import HomeSearch from "../../Search/HomeSearch";

const AgeCategoryList = () => {
  const navigate = useNavigate()

    const { gender, range } = useParams();

    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
    const { pincode } = useContext(LocationContext);

    const [tests, setTests] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    const isInCart = (id) => labCart.some((item) => item._id === id);

    const toggleCart = (test) => {
        if (isInCart(test._id)) {
            removeFromLabCart(test._id);
            toast.info(`${test.name} removed from cart`);
        } else {
            addToLabCart(test);
            toast.success(`${test.name} added to cart`);
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

    useEffect(() => {
        fetchAgeBasedData();
    }, [gender, range, pincode]);

    const fetchAgeBasedData = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/api/labtestsdata/age-based`, {
                params: { gender, range, pincode }
            });

            setTests(res.data.tests || []);
            setPackages(res.data.packages || []);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    const EmptyState = ({ title, subtitle }) => (
        <div className="empty-state-container text-center">
            <img
                src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                alt="No data"
                className="empty-state-img"
            />
            <h4 className="mt-3">{title}</h4>
            <p className="text-muted">{subtitle}</p>

            <button
                onClick={fetchAgeBasedData}
                className="refresh-offers12w"
            >
                Refresh
            </button>
        </div>
    );


    if (loading) return <div className="fullpage-loader">
        <div className="spinner"></div>
    </div>;

    return (
        <>
            <HomeSearch />
            <Container className="age-categhory-newass">
                <div className="text-center">
                    <h2 className="testimonial-heading">{gender.toUpperCase()} – {range} Years</h2>
                </div>
                <h4 className="rececereder">Recommended Tests</h4>
                <Row>
                    {tests.length === 0 ? (
                        <EmptyState
                            title="No Tests Found"
                            subtitle="We couldn’t find any tests matching this age and gender. Try adjusting the filters."
                        />
                    ) : (
                        <>
                            {tests.map((test) => (
                                <Col key={test._id} xl={3} lg={4} md={6} sm={6} xs={6} className="mb-2">
                                    <div className="labtest-ibndivi-test-abcds">
                                        <div className="labtest-ibndivi-test-abcds-sliders">
                                            <h4>{test.name}</h4>

                                            <p className="test-includes-lab-test">
                                                <img className="test-includes-new" src={testincluded} alt="" />
                                                {/* {test?.includedTests?.length || 1} Tests Included */}
                                                {test?.nooftest} Tests Included
                                            </p>

                                            <p className="test-includes-lab-test123">
                                                <img className="book-recently-new" src={booksin} alt="" />
                                                500+ booked recently
                                            </p>

                                            <div className="lab-test-content-news">
                                                <h5>₹ {test.price}/-</h5>
                                                {test.actualPrice && (
                                                    <h6 style={{ textDecoration: "line-through" }}>
                                                        ₹ {test.actualPrice}/-
                                                    </h6>
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
                                </Col>
                            ))}
                        </>
                    )}
                </Row>

                <h4 className="rececereder">Recommended Packages</h4>
                <Row>
                    {packages.length === 0 ? (
                        <EmptyState
                            title="No Packages Found"
                            subtitle="No recommended health packages available for this selection."
                        />
                    ) : (
                        <>
                            {packages.map((pkg) => (
                                <Col key={pkg._id} xl={3} lg={4} md={6} sm={6} xs={6} className="mb-2">
                                    <div className="labtest-ibndivi-test-abcds">
                                        <div className="labtest-ibndivi-test-abcds-sliders">
                                            <h4>{pkg.name}</h4>

                                            <p className="test-includes-lab-test">
                                                <img className="test-includes-new" src={testincluded} alt="" />
                                                {pkg.testsCount} Tests Included
                                            </p>

                                            <div className="lab-test-content-news">
                                                <h5>₹ {pkg.price}/-</h5>
                                                {pkg.actualPrice && (
                                                    <h6 style={{ textDecoration: "line-through" }}>
                                                        ₹ {pkg.actualPrice}/-
                                                    </h6>
                                                )}
                                            </div>

                                            <Link className="pop-test-read-more1" to={`/packagedetails/${pkg._id}`}>
                                                Read more
                                            </Link>

                                            <button
                                                className="book-now-labtest-actions"
                                                onClick={() => toggleBook(pkg, "package")}
                                            >
                                                {isInCart(pkg._id) ? "Added" : "Book"}
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default AgeCategoryList;
