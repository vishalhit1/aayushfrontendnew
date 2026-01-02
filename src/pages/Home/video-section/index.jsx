import React, { useState } from 'react'
import videoimg from "../../../assets/icons/banner.png"
import videoimgicon from "../../../assets/icons/playicon.gif"

const VideoSection = ({ videos = [] }) => {
  const [showModal, setShowModal] = useState(false)

  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // youtu.be/xxxx
    if (url.includes("youtu.be/")) {
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
    }

    // youtube.com/watch?v=xxxx
    if (url.includes("watch?v=")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
    }

    // already embed
    if (url.includes("/embed/")) {
      return url;
    }

    return "";
  };



  return (
    <>
      <div className='video-sections'>
        {/* <img
          className='videoimgicon'
          src={videoimgicon}
          alt="Play video"
          onClick={handleShow}
          style={{ cursor: 'pointer' }}
        />
        <img className='videoimg' src={videoimg} alt="" /> */}
        {videos.map((v) => (
          <iframe
            width="100%"
            height="400px"
            src={getEmbedUrl(v.youtubeUrl)}
            title={v.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className='videoimgicon'
          />


        ))}
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
                    {videos.map((v) => (
                      <iframe
                        width="100%"
                        height="400px"
                        key={v._id}
                        src={v.youtubeUrl}
                        title={v.title}
                        allowFullScreen
                      />
                    ))}
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