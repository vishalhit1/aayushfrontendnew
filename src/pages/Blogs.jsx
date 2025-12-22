import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import blog from "../assets/blogs/blog.jpg"
import { Link } from 'react-router-dom'
import API from '../api/axios'
const Blogs = () => {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchPublishedBlogs();
  }, []);


  const fetchPublishedBlogs = async () => {
    try {
      const res = await API.get("/api/blogs/status/published");
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch blogs");
    }
  };

  return (
    <div>
      <div style={{
        background: '#F2FAF9',
        color: 'black',
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0, marginBottom: '10px' }}>
          Our Blogs
        </h1>
      </div>

      <Container>
        <Row>
          {blogs.length === 0 && <p className="mt-4">No blogs found.</p>}

          {blogs.map((item) => (
            <Col lg={4}>
              <div className='blog-sliders mt-4 mb-0 pb-0'>
                <img
                  className="w-100"
                  src={
                    item.thumbnail
                      ? `${API.defaults.baseURL}${item.thumbnail}`
                      : blog
                  }
                  alt={item.title}
                />
                <div className='blog-content'>
                  <h4>{item.title}</h4>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: item.content.slice(0, 120) + "...",
                    }}
                  />
                  <Link to={`/blogs/${item._id}`}>Read More</Link>

                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Blogs
