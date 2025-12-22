import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../config";

const WAITING_TIME = 300; // seconds
const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // ms
const socket = io(API_URL, { transports: ["websocket"], reconnection: true });

const AudioCall = ({ role, channelName, uid, doctorId, patientId, bookingId, patientName, doctorName }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Extract params from props or query
  const _channel = channelName || searchParams.get("channelName");
  const _uid = Number(uid || searchParams.get("uid"));
  const _doctorId = doctorId || searchParams.get("doctorId");
  const _patientId = patientId || searchParams.get("patientId");
  const _bookingId = bookingId || searchParams.get("bookingId");

  // Agora client and states
  const [client] = useState(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localTrack, setLocalTrack] = useState(null);
  const [micMuted, setMicMuted] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [timer, setTimer] = useState(WAITING_TIME);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Feedback
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  // Refs
  const mounted = useRef(true);
  const remoteUsersRef = useRef([]);
  const audioElsRef = useRef({});
  const retryCountRef = useRef(0);
  const timerRef = useRef(null);

  /** -------------------------------
   * 🕒 Waiting Countdown
   --------------------------------*/
  useEffect(() => {
    if (!isWaiting) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          toast.error("No response. Call ended.");
          handleEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isWaiting]);

  /** -------------------------------
   * 🚀 Initialize Call
   --------------------------------*/
   useEffect(() => {
    if (!_channel || !_uid || !_bookingId) {
      toast.error("Missing call details!");
      navigate(-1);
      return;
    }
  
    mounted.current = true;
  
    const fetchAgoraToken = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/consultations/getAgoratoken`, {
          params: { channelName: _channel, uid: _uid },
        });
  
        const { appId, token } = res.data;
        if (!appId || !token) throw new Error("Invalid Agora credentials");
  
        await startCall(appId, token);
      } catch (err) {
        console.error("Agora token fetch error:", err);
        toast.error("Failed to initialize audio call");
        navigate(-1);
      }
    };
  
    const startCall = async (appId, token) => {
      try {
        await client.join(appId, _channel, token, _uid);
        const mic = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalTrack(mic);
        await client.publish([mic]);
  
        // Notify server
        socket.emit(
          role === "doctor"
            ? "doctorJoinAudioConsultation"
            : "patientJoinAudioConsultation",
          { doctorId: _doctorId, patientId: _patientId, bookingId: _bookingId, uid: _uid }
        );
  
        // Agora remote user handling...
        client.on("user-published", async (user, mediaType) => {
          if (!mounted.current) return;
          await client.subscribe(user, mediaType);
  
          if (mediaType === "audio") {
            const audioEl = document.createElement("audio");
            audioEl.autoplay = true;
            user.audioTrack.play(audioEl);
            audioElsRef.current[user.uid] = audioEl;
          }
  
          if (!remoteUsersRef.current.includes(user.uid)) {
            remoteUsersRef.current.push(user.uid);
          }
          setCallActive(true);
          setIsWaiting(false);
        });
  
        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType !== "audio") return;
          const audioEl = audioElsRef.current[user.uid];
          if (audioEl) {
            audioEl.remove();
            delete audioElsRef.current[user.uid];
          }
          remoteUsersRef.current = remoteUsersRef.current.filter((id) => id !== user.uid);
          if (remoteUsersRef.current.length === 0) {
            setCallActive(false);
            setIsWaiting(true);
          }
        });
  
        // Agora reconnect listener
        client.on("connection-state-change", async (cur, prev) => {
          if (cur === "DISCONNECTED" && callActive) await handleReconnect();
          if (cur === "CONNECTED" && isReconnecting) {
            socket.emit(
              role === "doctor"
                ? "doctorJoinAudioConsultation"
                : "patientJoinAudioConsultation",
              { doctorId: _doctorId, patientId: _patientId, bookingId: _bookingId }
            );
            setIsReconnecting(false);
          }
        });
  
        // Socket events
        socket.on("participantJoined", ({ bookingId }) => {
          if (bookingId === _bookingId) {
            setCallActive(true);
            setIsWaiting(false);
          }
        });
  
        socket.on("participantLeft", ({ bookingId }) => {
          if (bookingId === _bookingId) {
            toast.info("Other participant left.");
            setCallActive(false);
            setIsWaiting(true);
          }
        });
  
        socket.on("connect", () => {
          console.log("🔄 Socket reconnected!");
          socket.emit(
            role === "doctor"
              ? "doctorJoinAudioConsultation"
              : "patientJoinAudioConsultation",
            { doctorId: _doctorId, patientId: _patientId, bookingId: _bookingId }
          );
        });
      } catch (err) {
        console.error("Join call error:", err);
        toast.error("Could not connect. Please wait or refresh.");
      }
    };
  
    // ✅ Only call once here — not inside startCall again
    fetchAgoraToken();
  
    return () => {
      mounted.current = false;
      socket.off("connect");
      socket.off("participantJoined");
      socket.off("participantLeft");
      client.removeAllListeners();
      handleEndCall(false);
    };
    // eslint-disable-next-line
  }, [_channel, _uid, _doctorId, _patientId, _bookingId]);
  

  /** -------------------------------
   * ♻️ Handle Reconnect
   --------------------------------*/
   const handleReconnect = async () => {
    if (retryCountRef.current >= MAX_RETRIES) {
      toast.error("Failed to reconnect. Ending call.");
      handleEndCall();
      return;
    }

    setIsReconnecting(true);
    retryCountRef.current += 1;
    toast.warn(`Connection lost. Reconnecting... (${retryCountRef.current}/${MAX_RETRIES})`);

    try {
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL));
      await client.reconnect();
      setIsReconnecting(false);
      retryCountRef.current = 0;
      toast.success("Reconnected successfully!");
    } catch (err) {
      console.error("Reconnect error:", err);
      handleReconnect();
    }
  };

  /** -------------------------------
   * ❌ End Call
   --------------------------------*/
  const handleEndCall = async (showMsg = true) => {
    try {
      if (localTrack) {
        await localTrack.stop();
        await localTrack.close();
      }
      await client.leave();

      Object.values(audioElsRef.current).forEach((a) => a.remove());
      audioElsRef.current = {};
      remoteUsersRef.current = [];

      setCallActive(false);
      setIsWaiting(false);
      if (showMsg) toast.info("Call ended.");
      setShowFeedback(true);
    } catch (err) {
      console.error("End call error:", err);
      navigate(-1);
    }
  };

  /** -------------------------------
   * 🎤 Mute / Unmute
   --------------------------------*/
  const toggleMute = () => {
    if (!localTrack) return;
    const newMuted = !micMuted;
    localTrack.setEnabled(!newMuted);
    setMicMuted(newMuted);
  };

  /** -------------------------------
   * ⏱ Format Timer
   --------------------------------*/
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /** -------------------------------
   * 📝 Submit Feedback
   --------------------------------*/
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

      files.forEach((file) => formData.append("prescriptions", file));

      await axios.post(`${API_URL}/api/feedback/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Feedback submitted successfully!");
      setShowFeedback(false);
      navigate(-1);
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to submit feedback");
    }
  };

  /** -------------------------------
   * 🖥️ UI
   --------------------------------*/
  return (
    <>
      <div className="audio-call-container">
        <div className="audio-card">
          <div className="profile-section">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="User Avatar"
              className="avatar-img"
            />
            <h3>{role === "doctor" ? patientName : doctorName}</h3>
            <p className="status-text">
              {isWaiting
                ? "Waiting for other participant..."
                : callActive
                  ? "Call in progress"
                  : "Call ended"}
            </p>
          </div>

          {isWaiting && (
            <>
              <div className="wave-loader">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <p className="timer-text">Time left: {formatTime(timer)}</p>
              <button className="end-btn" onClick={handleEndCall}>End Call</button>
            </>
          )}

          {callActive && (
            <div className="controls">
              <button
                className={`mute-btn ${micMuted ? "muted" : ""}`}
                onClick={toggleMute}
              >
                {micMuted ? "🔇 Unmute" : "🎤 Mute"}
              </button>
              <button className="end-btn" onClick={handleEndCall}>
                End Call
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal show={showFeedback} onHide={() => setShowFeedback(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Consultation Ended</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitFeedback}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select value={rating} onChange={(e) => setRating(e.target.value)} required>
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} ⭐</option>
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
              <Button variant="secondary" onClick={() => setShowFeedback(false)} className="me-2">
                Skip
              </Button>
              <Button type="submit" variant="primary">Submit</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AudioCall;
