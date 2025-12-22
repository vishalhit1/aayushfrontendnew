import React from 'react'
import { Heart, Microscope, Zap, Shield, Home, Wallet, Users, Building, Eye, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  const features = [
    { icon: Microscope, title: 'Modern Technology', desc: 'Advanced diagnostic technology and certified labs' },
    { icon: Heart, title: 'Preventive Care', desc: 'Early detection and comprehensive health screening' },
    { icon: Zap, title: 'Fast Results', desc: 'Quick turnaround time & digital reporting' },
    { icon: Shield, title: 'High Accuracy', desc: 'Strict quality control and certified processes' },
    { icon: Home, title: 'Home Collection', desc: 'Professional sample collection at your convenience' },
    { icon: Wallet, title: 'Affordable', desc: 'Accessible healthcare packages for all' }
  ]

  const services = [
    { icon: Users, title: 'Individuals & Families' },
    { icon: Heart, title: 'Healthcare Providers' },
    { icon: Building, title: 'Organizations' }
  ]

  return (
    <div id="about-us">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Aayush Wellness Limited</h1>
          <p className="hero-subtitle">Established in 1989 and proudly listed on the Bombay Stock Exchange (BSE), we're a trusted name in preventive healthcare, delivering comprehensive wellness packages and advanced diagnostic services.</p>
        </div>
      </div>

      {/* About Aayush Labs */}
      <div className="section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="section-title">About Aayush Labs</h2>
              <p className="section-text">A leading diagnostic provider committed to delivering accurate, reliable, and affordable laboratory testing services. Built on a strong foundation of quality, technology, and patient care.</p>
              <p className="section-text">Equipped with advanced analyzers, certified processes, and a skilled technical team, Aayush Labs ensures precision in every report. Our streamlined operations—from home sample collection to digital report delivery—provide a smooth and hassle-free experience.</p>
            </div>
            <div className="col-lg-6">
              <div className="about-image">
                <Microscope size={100} className="about-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="vision-card">
                <h3 className="card-title">
                  <Eye size={20} /> Our Vision
                </h3>
                <p className="card-text">To become one of India's most trusted and technology-driven diagnostic laboratories, committed to excellence in clinical testing and preventive healthcare.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="vision-card">
                <h3 className="card-title">
                  <Target size={20} /> Our Mission
                </h3>
                <p className="card-text">To provide high-quality, timely, and affordable diagnostic services that empower individuals to take charge of their health.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <p className="values-subtitle">Accuracy, trust, and compassion form the core of everything we do</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="section">
        <div className="container">
          <div className="row">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="col-lg-4 col-md-6 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <Icon size={24} />
                    </div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="section">
        <div className="container">
          <div className="services-container">
            <h2 className="services-title">Who We Serve</h2>
            <div className="row mb-4">
              {services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <div key={idx} className="col-lg-4 col-md-6 mb-0">
                    <div className="service-card">
                      <div className="service-icon-wrapper">
                        <Icon size={32} />
                      </div>
                      <h5 className="service-title">{service.title}</h5>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="services-description">Making high-quality diagnostics accessible to all communities and settings</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Prioritize Your Health?</h2>
          <p className="cta-subtitle">Experience trusted, accurate, and affordable diagnostic services with Aayush Labs.</p>
          <button className="cta-button"> <Link to="/lab-tests" style={{textDecoration:'none',color:'white'}}>Book a Test Today</Link></button>
        </div>
      </div>
    </div>
  )
}

export default About