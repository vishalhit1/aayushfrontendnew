import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Col, Row, Tabs, Tab } from 'react-bootstrap'

import searchimg from '../assets/searchimg.gif';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    if (query) fetchResults(query);
  }, [searchParams]);

  const fetchResults = async (query) => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/api/search?query=${encodeURIComponent(query)}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (url) => {
    if (!url) return;
    const finalUrl = url.startsWith("/") ? url : `/${url}`;
    navigate(finalUrl);
  };

  // Group search results
  const groupedResults = searchResults.reduce((acc, item) => {
    const type = item.type || "others";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        Search Results for "<span className="text-primary">{searchQuery}</span>"
      </h2>

      {loading && (
        <div className="fullpage-loader">
          <div className="spinner"></div>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      {!loading && searchResults.length === 0 && !error && (
        <p className="text-muted">No results found for "{searchQuery}"</p>
      )}

      {/* ⭐ TABS ADDED HERE */}
      <Tabs defaultActiveKey="labTest" id="search-tabs" className="mb-4">

        {/* --------------------- LAB TESTS TAB --------------------- */}
        <Tab eventKey="labTest" title="Lab Tests">
          <Row>
            {(groupedResults.labTest || []).map((item) => (
              <Col lg={6} key={item._id}>
                <div
                  className='search-resul'
                  onClick={() => handleItemClick(item.url)}
                  style={{ cursor: 'pointer' }}
                >
                  <Row>
                    <Col lg={10} xs={9}>
                      <div className='abcd-search-res'>
                        <h3>{item.name}</h3>
                        <h5>3 Tests Included</h5>
                        <div className='price-lab-testea'>
                          <p>₹349/-</p>
                          <p className='discount-pricmes'>₹349/-</p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={2} xs={3}>
                      <img className='serach-giff' src={searchimg} alt="" />
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* --------------------- DOCTORS TAB --------------------- */}
        <Tab eventKey="doctor" title="Doctors">
          <Row>
            {(groupedResults.doctor || []).map((item) => (
              <Col lg={6} key={item._id}>
                <div
                  className='search-resul'
                  onClick={() => handleItemClick(item.url)}
                  style={{ cursor: 'pointer' }}
                >
                  <Row>
                    <Col lg={10} xs={9}>
                      <div className='abcd-search-res'>
                        <h3>{item.name}</h3>
                        {item.specialization && (
                          <p className="text-muted mb-2">
                            Specialty: {item.specialization}
                          </p>
                        )}
                      </div>
                    </Col>
                    <Col lg={2} xs={3}>
                      <img className='serach-giff' src={searchimg} alt="" />
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* --------------------- CATEGORIES TAB --------------------- */}
        <Tab eventKey="category" title="Categories">
          <Row>
            {(groupedResults.category || []).map((item) => (
              <Col lg={6} key={item._id}>
                <div
                  className='search-resul'
                  onClick={() => handleItemClick(item.url)}
                  style={{ cursor: 'pointer' }}
                >
                  <Row>
                    <Col lg={10} xs={9}>
                      <div className='abcd-search-res'>
                        <h3>{item.name}</h3>
                      </div>
                    </Col>
                    <Col lg={2} xs={3}>
                      <img className='serach-giff' src={searchimg} alt="" />
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        </Tab>

      </Tabs>

    </div>
  );
};

export default SearchResults;
