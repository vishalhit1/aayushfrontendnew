import React from 'react'
import HomeSearch from './Search/HomeSearch'
import { Container, Row, Col } from 'react-bootstrap'

import abcd from "../assets/abcd.png"

const DoctorCategoryList = () => {
  const categories = [
    'Cough & Cold',
    'Heart Specialist',
    'Diabetes Check',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold',
    'Cough & Cold'
  ]

  const getClassName = (index) => {
    const classNames = ['cat-1', 'cat-2', 'cat-3']
    return classNames[index % 3]
  }

  return (
    <div>
      <HomeSearch />
      <Container>
        <div className='category-list-all mb-5'>
          <h3>Categories</h3>
          <Row>
            {categories.map((category, index) => (
              <Col lg={3} md={6} sm={6} xs={6} key={index} className='mb-4'>
                <div className={`doc-sliders ${getClassName(index)}`}>
                  <img
                    className="w-100"
                    alt=""
                    src="https://ayushlabsapi.handsintechnology.in/uploads/doctorcategory/file-1760536063484-582868247.jpg"
                  />
                  <h4>{category}</h4>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default DoctorCategoryList
