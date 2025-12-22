import React, { useState } from 'react'
import videoimg from "../../../assets/icons/banner.png"
import videoimgicon from "../../../assets/icons/playicon.gif"

const VideoSection = () => {
  const [showModal, setShowModal] = useState(false)

  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  return (
    <>
      <div className='video-sections'>
        <img 
          className='videoimgicon' 
          src={videoimgicon} 
          alt="Play video" 
          onClick={handleShow}
          style={{ cursor: 'pointer' }}
        />
        <img className='videoimg' src={videoimg} alt="" />
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <>
          <div 
            className="modal fade show" 
            style={{ display: 'block' }} 
            tabIndex="-1"
            onClick={handleClose}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title">Video</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Replace with your video URL */}
                  <div className="ratio ratio-16x9">
                    <iframe 
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                      title="Video player" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  )
}

export default VideoSection