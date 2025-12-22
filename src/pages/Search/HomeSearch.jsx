import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import API from '../../api/axios';
import { Link, useNavigate, useLocation } from "react-router-dom";

const HomeSearch = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('Mumbai');

    const [items, setItems] = useState([]);

    const handleSearch = async (string) => {
        if (!string.trim()) return;

        try {
            const res = await API.get(`/api/search?query=${string}`);

            // Ensure each item has a unique id
            const itemsWithIds = res.data.data.map((item, index) => ({
                ...item,
                id: item.id || item._id || `item-${Date.now()}-${index}`, // Use existing id, _id, or create unique one
                name: item.name || item.title || '', // Ensure name field exists
                url: item.url || item.link || '#' // Ensure url field exists
            }));

            setItems(itemsWithIds);
        } catch (error) {
            console.error('Search error:', error);
            setItems([]);
        }
    };

    const handleSelect = (item) => {
        if (item && item.url) {
            navigate(item.url);
        }
    };

    return (
        <div className="mobileserach d-none" style={{ touchAction: 'manipulation' }}>
            <div className="container">
                <Row style={{ alignItems: 'center', width: '100%', margin: 0 }}>
                    <Col lg={3} xs={2} style={{ padding: 0 }}>
                        <div className="location-section">
                            <svg
                                className="location-icon"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ width: '24px', height: '24px' }}
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <h2 className="location-text">{location}</h2>
                        </div>
                    </Col>
                    <Col lg={9} xs={10} style={{ padding: 0 }}>
                        <div style={{ width: '100%', touchAction: 'manipulation' }}>
                            <ReactSearchAutocomplete
                                items={items}
                                className="search-inputsasas"
                                placeholder="Search for Cardiology, Lab Tests..."
                                onSearch={handleSearch}
                                onSelect={handleSelect}
                                fuseOptions={{
                                    keys: ["name", "title"],
                                    threshold: 0.3
                                }}
                                resultStringKeyName="name"
                                inputDebounce={300}
                                styling={{
                                    zIndex: 9999,
                                    height: "45px",
                                    borderRadius: "10px",
                                    backgroundColor: "white",
                                    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                                    border: "1px solid #e0e0e0",
                                    fontSize: "14px",
                                    touchAction: "manipulation"
                                }}
                                formatResult={(item) => (
                                    <div style={{ padding: '8px 10px', touchAction: 'manipulation' }}>
                                        <span>{item.name || item.title}</span>
                                    </div>
                                )}
                                autoFocus
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            <style>{`
                .search-inputsasas input {
                    font-size: 16px !important;
                    touch-action: manipulation !important;
                }
                
                .search-inputsasas input:focus {
                    font-size: 16px !important;
                }
                
                .search-inputsasas {
                    touch-action: manipulation !important;
                }
                
                .reactSearchAutocomplete {
                    touch-action: manipulation !important;
                }
                
                input[type="text"] {
                    touch-action: manipulation !important;
                }
                
                @media (max-width: 768px) {
                    .search-inputsasas input {
                        font-size: 16px !important;
                        touch-action: manipulation !important;
                    }
                    
                    body {
                        touch-action: manipulation !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default HomeSearch;