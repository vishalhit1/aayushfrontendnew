import React, { useState } from 'react'
import { Container } from 'react-bootstrap'

const Faqs = () => {
    const [activeIndex, setActiveIndex] = useState(null)

    const faqData = [
        {
            id: 0,
            question: 'What is Aayush Labs?',
            answer: 'Aayush Labs is a unified healthcare and diagnostics platform offering lab tests, health packages, doctor consultations, medical logistics, and home sample collection services.'
        },
        {
            id: 1,
            question: 'Do you provide a home sample collection?',
            answer: 'Yes, we offer fast and convenient home sample collection across multiple locations with trained phlebotomists.'
        },
        {
            id: 2,
            question: 'How do I book a test or consultation?',
            answer: 'You can easily book through our website, mobile app, Call, or WhatsApp by selecting the service, choosing your slot, and confirming your details.'
        },
        {
            id: 3,
            question: 'Are the test reports accurate and reliable?',
            answer: 'Absolutely. All tests are performed in NABL-certified partner labs with strict quality control measures.'
        },
        {
            id: 4,
            question: 'How long will it take to receive my reports?',
            answer: 'Most reports are delivered within 6–24 hours, depending on the test. Some advanced tests may take longer. '
        },
        {
            id: 5,
            question: 'Do you offer full body checkups or preventive health packages?',
            answer: 'Yes, we offer comprehensive preventive health packages designed for all age groups and health needs.'
        },
        {
            id: 6,
            question: 'What payment methods do you accept?',
            answer: 'We support UPI, credit/debit cards, net banking, wallets, and Pay On Collection , paying for your tests is completely safe, we have secure payment gateways, platform audits and payment security certificates in place.'
        },
        {
            id: 7,
            question: 'How do you provide tests at such affordable prices?',
            answer: 'We provide tests at affordable prices because we work on high volumes, have direct tie-ups with certified labs, use efficient technology, and eliminate middlemen—allowing us to pass the savings directly to you.'
        }
    ]

    const toggleAccordion = (id) => {
        setActiveIndex(activeIndex === id ? null : id)
    }

    return (
        <div>
            <div className='faqs'>
                <Container>
                    <h3>
                        Everything You Need to Know
                    </h3>

                    <div className='accordion'>
                        {faqData.map((faq) => (
                            <div
                                key={faq.id}
                                style={{
                                    border: '1px solid #CFCFCF',
                                    borderRadius: '10px',
                                    marginBottom: '20px',
                                    overflow: 'hidden',
                                    background:'white'
                                }}
                            >
                                <button
                                    onClick={() => toggleAccordion(faq.id)}
                                    className='heading-faqs'
                                    style={{
                                        backgroundColor: activeIndex === faq.id ? '#f8f9fa' : '#fff',
                                    }}
                                >
                                   
                                    {faq.question} 
                                    <span>
                                        {activeIndex === faq.id ? '−' : '+'}
                                    </span>
                                </button>

                                <div
                                    style={{
                                        maxHeight: activeIndex === faq.id ? '500px' : '0',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.3s ease',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <div className='faqs-answer'>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Faqs