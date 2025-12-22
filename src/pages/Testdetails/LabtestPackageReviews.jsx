import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Slider from "react-slick"
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../api/axios'
import { API_URL } from '../../../config'
const LabtestPackageReviews = () => {
    const { id } = useParams();
    console.log()
    const [slidesToShow, setSlidesToShow] = useState(3)
    const [reviews, setReviews] = useState([])
    const getWindowSize = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        }
        return 1200
    }
    const updateSlidesToShow = () => {
        const width = getWindowSize()
        if (width < 576) setSlidesToShow(1.09)
        else if (width >= 576 && width < 768) setSlidesToShow(1)
        else if (width >= 768 && width < 992) setSlidesToShow(2)
        else setSlidesToShow(3)
    }
    useEffect(() => {
        updateSlidesToShow()
        let timeoutId = null
        const handleResizeDebounced = () => {
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = setTimeout(() => updateSlidesToShow(), 150)
        }
        window.addEventListener('resize', handleResizeDebounced)
        window.addEventListener('orientationchange', updateSlidesToShow)
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            window.removeEventListener('resize', handleResizeDebounced)
            window.removeEventListener('orientationchange', updateSlidesToShow)
        }
    }, [])
    const settings = {
        dots: true,
        autoplay: false,
        arrows: false,
        infinite: true,
        autoplaySpeed: 3500,
        slidesToShow,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerMode: false,
        variableWidth: false,
    }
    // Fetch reviews for the current test
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await API.get(`/api/labTestPackageReviewRoutes/test/${id}`)
                console.log("res.data.reviews", res.data.reviews)
                setReviews(res.data.reviews || [])
            } catch (err) {
                toast.error("Failed to fetch reviews")
            }
        }
        if (id) fetchReviews()
    }, [id])
    return (
        <div className='testi-sasxs labtest-testimonails' style={{ paddingBottom: '40px' }}>
            <Container>
                <div className='testimonails-section'>
                    <h2 className='testimonial-heading'>User Reviews</h2>
                    <Slider {...settings} className='mt-3' key={slidesToShow}>
                        {reviews.length === 0 ? (
                            <div>No reviews found</div>
                        ) : (
                            reviews.map((r) => (
                                <div key={r._id}>
                                    <div className="single-testimonial">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="rating d-flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fa ${i < r.rating ? 'fa-star' : 'fa-star-o'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p>{r.content}</p>
                                        <div className="client-info">
                                            <div className="client-video">
                                                <a href="#">
                                                    <img
                                                         src={r.avatar ? `${API_URL}${r.avatar}` : "https://p7.hiclipart.com/preview/782/114/405/5bbc3519d674c.jpg"}
                                                        alt={r.name}
                                                        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                </a>
                                            </div>
                                            <div className="client-details">
                                                <h6>{r.name}</h6>
                                                <span>{r.role || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Slider>
                </div>
            </Container>
        </div>
    )
}
export default LabtestPackageReviews