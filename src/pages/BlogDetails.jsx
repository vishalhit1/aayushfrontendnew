import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await API.get(`/api/blogs/${id}`);
      setBlog(res.data.data);
    } catch (err) {
      console.error("Failed to fetch blog", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="fullpage-loader">
  <div className="spinner"></div>
</div>;
  if (!blog) return <p className="text-center mt-5">Blog not found</p>;

  return (
    <Container>
      <Row>
        <Col lg={12}>
          <div className="blog-sliders">
            {blog.thumbnail && (
              <img
                src={
                  blog.thumbnail
                    ? `${API.defaults.baseURL}${blog.thumbnail}`
                    : blog
                }
                alt={blog.title}
                className="w-70"
                style={{ display: "block", margin: "auto" }}
              />
            )}

            <div className="blog-content mt-4">
              <h2>{blog.title}</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: blog.content,
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogDetails;
