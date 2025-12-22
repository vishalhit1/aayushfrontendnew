import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import API from '../../../api/axios'; // your axios instance
import { API_URL } from '../../../../config';
import { useNavigate } from 'react-router-dom';

const SellingPackages = () => {
    const navigate = useNavigate()
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch best-selling packages
  const fetchBestSellingPackages = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/labtestpackage/getAllBestSellingTestPackages');
      if (res.data.success) {
        setPackages(res.data.packages);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellingPackages();
  }, []);

  console.log("selling packages",packages)

  return (
    <div className="selling-pack-sec mt-4">
      <Container>
        <div className="selling-packages" >
          <h3>Best Selling Packages</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row>
              {packages.map((pkg) => (
                <Col lg={6} key={pkg._id}>
                  <div style={{ cursor: "pointer" }} className="packages-one" onClick={()=> navigate(`/packagetestdetails/${pkg._id}`)}>
                    <Row>
                      <Col lg={3}>
                        <img
                          src={`${API_URL}/uploads/packages/${pkg.profileImage.map(file => file.filename)}` || '/default-package.png'} // fallback if no image
                          alt={pkg.name}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col lg={7}>
                        <h4>{pkg.name}</h4>
                        <p>{pkg.description || 'No description available'}</p>
                        <h6>{pkg.tests?.length || 0}+ Tests</h6>
                      </Col>
                      <Col lg={2}>
                        <button className="read-more" onClick={()=> navigate(`/packagetestdetails/${pkg._id}`)}>Read More</button>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SellingPackages;
