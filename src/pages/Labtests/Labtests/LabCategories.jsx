import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import API from "../../../api/axios";
import abcd1 from "../../../assets/mens.png";

const LabCategories = () => {
    const { id } = useParams();
    const { search } = useLocation();
    const navigate = useNavigate();
    const categoryName = new URLSearchParams(search).get("name") || "Category";

    const [tests, setTests] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/api/labtestsdata/category/${id}`);
                if (data.success) {
                    const allTests = [];
                    const allPackages = [];
                    data.data.forEach((sub) => {
                        if (sub.tests?.length) allTests.push(...sub.tests);
                        if (sub.packages?.length) allPackages.push(...sub.packages);
                    });
                    setTests(allTests);
                    setPackages(allPackages);
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [id]);

    const handleBookNow = (item, type) => {
        navigate("/cart", { state: { selectedItem: item, itemType: type } });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="popular-test-new py-5">
            <Container>
                {/* Packages Section */}
                {packages.length > 0 && (
                    <>
                        <Row>
                            <Col lg={6}>
                                <h3>Popular Packages</h3>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            {packages.map((pkg) => (
                                <Col lg={4} md={6} sm={12} key={pkg._id} className="mb-4">
                                    <div className="popular-test-new-sliders text-center">
                                        <img
                                            src={abcd1}
                                            alt={pkg.name}
                                            className="mx-auto mb-3 w-20 h-20 object-contain"
                                        />
                                        <h4 className="font-semibold">{pkg.name}</h4>
                                        <p className="text-gray-600 text-sm">{pkg.description}</p>
                                        <div className="popular-test-content">
                                            <h5>₹ {pkg.price}</h5>
                                            <button className="book-now">Book</button>
                                            <Link
                                                className="pop-test-read-more1"
                                                to={`/package/${pkg._id}`}
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}

                {/* Tests Section */}
                {tests.length > 0 && (
                    <>
                        <Row className="mt-5">
                            <Col lg={6}>
                                <h3>Individual Tests</h3>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            {tests.map((test) => (
                                <Col lg={4} md={6} sm={12} key={test._id} className="mb-4">
                                    <div className="popular-test-new-sliders text-center">
                                        <img
                                            src={abcd1}
                                            alt={test.name}
                                            className="mx-auto mb-3 w-20 h-20 object-contain"
                                        />
                                        <h4 className="font-semibold">{test.name}</h4>
                                        <p className="text-gray-600 text-sm">{test.description}</p>
                                        <div className="popular-test-content">
                                            <h5>₹ {test.price}</h5>
                                            <button className="book-now">Book</button>
                                            <Link
                                                className="pop-test-read-more1"
                                                to={`/individualtestdetails/${test._id}`}
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}

                {tests.length === 0 && packages.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">
                        No tests or packages found for this category.
                    </p>
                )}
            </Container>
        </div>
    );
};

export default LabCategories;
