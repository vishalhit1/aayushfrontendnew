import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AgoraUIKit from "agora-react-uikit";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import { API_URL } from "../../../config";
import API from "../../api/axios";
import VideoChat from "./VideoChat";

const VideoCall = ({
  role, channelName, uid,
  doctorId, bookingId, patientId,
  doctorName: propDoctorName,
  patientName: propPatientName,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [rtcProps, setRtcProps] = useState(null);
  const [videoCall, setVideoCall] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  const [doctorName, setDoctorName] = useState(propDoctorName || "Doctor");
  const [patientName, setPatientName] = useState(propPatientName || "Patient");

  const _channel = channelName || searchParams.get("channelName");
  const _uid = Number(uid || searchParams.get("uid"));
  const _doctorId = doctorId || searchParams.get("doctorId");
  const _bookingId = bookingId || searchParams.get("bookingId");
  const _patientId = patientId || searchParams.get("patientId");

console.log("doctorName",doctorName)
console.log("patientName",patientName)
  

  useEffect(() => {
    const fetchAgoraToken = async () => {
      try {
        if (!_channel || !_uid) {
          toast.error("Missing channel or UID");
          navigate(-1);
          return;
        }

        const res = await API.get(`/api/consultations/getAgoratoken`, {
          params: { channelName: _channel, uid: _uid },
        });

        const { appId, token } = res.data;
        if (!appId || !token) {
          toast.error("Invalid Agora credentials received");
          return;
        }

        setRtcProps({
          appId,
          channel: _channel,
          token,
          uid: _uid,
          role,
        });
      } catch (err) {
        console.error("Agora token fetch error:", err);
        toast.error("Failed to initialize video call");
      }
    };

    fetchAgoraToken();
  }, [_channel, _uid, role, navigate]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const callbacks = {
    EndCall: () => {
      setVideoCall(false);
      setShowFeedback(true);
      toast.info("Consultation ended — please provide feedback");
    },
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("bookingId", _bookingId);
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("givenBy", role === "doctor" ? _doctorId : _patientId);
      formData.append("givenByModel", role === "doctor" ? "Doctor" : "User");
      formData.append("toModel", role === "doctor" ? "User" : "Doctor");
      formData.append("to", role === "doctor" ? _patientId : _doctorId);

      if (files.length > 0) {
        files.forEach((file) => formData.append("prescriptions", file));
      }

      await axios.post(`${API_URL}/api/feedback/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Feedback submitted successfully!");
      setShowFeedback(false);
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    }
  };

  if (!rtcProps) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white fs-5">
        Initializing Agora...
      </div>
    );
  }

  return (
    <div className="video-call-container">
      {/* Agora Video UI */}
      <div className="video-area">

        {videoCall && (
          <>
            <AgoraUIKit
              rtcProps={rtcProps}
              callbacks={callbacks}
              styleProps={{
                UIKitContainer: { width: "100%", height: "100%" },
              }}
            />

            {/* Fullscreen Toggle */}
            <Button
              variant="dark"
              onClick={toggleFullscreen}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                opacity: "0.85",
              }}
            >
              {isFullscreen ? "Exit Full Screen" : "Full Screen"}
            </Button>
          </>
        )}
      </div>
      {/* ------------------ RIGHT: CHAT PANEL ------------------ */}
      <div className="sidebar">
        {/* Patient Info Header */}
    <div className="patient-info-box">
      <h3>{role ==  "doctor" ? patientName : doctorName}</h3>
     
    </div>
        <VideoChat
          bookingId={_bookingId}
          userType={role === "doctor" ? "doctor" : "user"}
          doctorName={doctorName}
          patientName={patientName}
          doctorId={doctorId}
          patientId={patientId}
        />

      </div>

      {/* Feedback Modal */}
      <Modal
        show={showFeedback}
        onHide={() => setShowFeedback(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Consultation Ended</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitFeedback}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>

            {role === "doctor" && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Prescription (optional)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowFeedback(false);
                  navigate(-1);
                }}
                className="me-2"
              >
                Skip
              </Button>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VideoCall;
