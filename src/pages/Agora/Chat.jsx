import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../../api/axios";
import { API_URL } from "../../../config";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const socket = io(API_URL);

const Chat = ({
  role,
  bookingId,
  doctorId,
  patientId,
  doctorName: propDoctorName,
  patientName: propPatientName,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const _bookingId = bookingId || searchParams.get("bookingId");
  const _role = role;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const [doctorName, setDoctorName] = useState(propDoctorName || "Doctor");
  const [patientName, setPatientName] = useState(propPatientName || "Patient");

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);


  const typingTimeout = useRef(null);
  const isMounted = useRef(true);
  const messagesEndRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // ✅ Fetch doctor/patient names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        if (doctorId) {
          const res = await API.get(`/api/doctors/${doctorId}`);
          setDoctorName(res.data?.doctor?.name || "Doctor");
        }
        if (patientId) {
          const res = await API.get(`/api/users/patient/${patientId}`);
          setPatientName(res.data?.patient?.name || "Patient");
        }
      } catch (err) {
        console.error("Error fetching names", err);
      }
    };
    fetchNames();
  }, [doctorId, patientId]);

  // ✅ Fetch chat messages
  useEffect(() => {
 
    fetchMessages();
  }, [_bookingId, _role, doctorName, patientName]);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/api/consultations/chat/messages/${_bookingId}`);
      if (isMounted.current && res.data.success) {
        setMessages(
          res.data.messages.map((msg) => ({
            sender:
              msg.sender === _role
                ? "You"
                : msg.sender === "doctor"
                  ? doctorName
                  : patientName,
            text: msg.text,
            fileName: msg.fileName || null,
            type: msg.type || "text",
            timestamp: msg.timestamp,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Socket setup
  useEffect(() => {
    if (!_bookingId || !_role) {
      alert("Missing chat parameters!");
      navigate(-1);
      return;
    }

    isMounted.current = true;
    socket.emit("joinChat", { bookingId: _bookingId, role: _role });

    socket.on("chatMessage", ({ senderRole, text, type, fileName }) => {
      if (!isMounted.current) return;
      const senderName =
        senderRole === _role
          ? "You"
          : senderRole === "doctor"
            ? doctorName
            : patientName;
      setMessages((prev) => [
        ...prev,
        { 
          sender: senderName, 
          text, 
          type: type || "text",
          fileName: fileName || null,
          timestamp: new Date().toISOString() },
      ]);
    });

    socket.on("typing", ({ role: senderRole }) => {
      if (senderRole !== _role) setTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1000);
    });

    socket.on("chatEnded", ({ bookingId: endedId }) => {
      if (endedId === _bookingId) {
        toast.info("Chat has been ended by the other participant.");
        setShowFeedback(true);
      }
    });

    return () => {
      isMounted.current = false;
      socket.off("chatMessage");
      socket.off("typing");
      socket.off("chatEnded");
      socket.emit("leaveChat", { bookingId: _bookingId, role: _role });
    };
  }, [_bookingId, _role, doctorName, patientName, navigate]);

  const handleTyping = () => {
    socket.emit("typing", { bookingId: _bookingId, role: _role });
  };

  const sendMessage = async () => {
    const msg = newMessage.trim();
    if (!msg) return;

    socket.emit("sendMessage", { bookingId: _bookingId, role: _role, text: msg });

    try {
      await API.post(`/api/consultations/chat/saveMessage`, {
        bookingId: _bookingId,
        sender: _role,
        text: msg,
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    setNewMessage("");
    fetchMessages()
  };

  // --- file upload handler ---
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bookingId", _bookingId);
    formData.append("sender", _role);

    try {
      setUploading(true);
      const res = await API.post("/api/consultations/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.url;

      // Send file message through socket
      socket.emit("sendMessage", {
        bookingId: _bookingId,
        role: _role,
        text: fileUrl,
        type: "file",
        fileName: file.name,
      });

      // Save file message to DB
      await API.post(`/api/consultations/chat/saveMessage`, {
        bookingId: _bookingId,
        sender: _role,
        text: fileUrl,
        type: "file",
        fileName: file.name,
      });

      setUploading(false);
      toast.success("File uploaded!");
    } catch (err) {
      console.error("File upload failed:", err);
      toast.error("File upload failed");
      setUploading(false);
    }
  };


  const endChat = () => {
    socket.emit("endChat", { bookingId: _bookingId });
    setShowFeedback(true);
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

  return (
    <div className="chat-container">
      <div className="chat-header d-flex justify-content-between align-items-center">
        <h5 className="m-0">Consultation Chat</h5>
        <button className="btn btn-danger btn-sm" onClick={endChat}>
          End Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.sender === "You" ? "sent" : "received"}`}
          >
            <div className="bubble">
              <div className="sender">{msg.sender}</div>

              <div className="text">
                {msg.type == "file" ? (
                  /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.text) ? (
                    <a href={msg.text} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.text}
                        alt={msg.fileName || "attachment"}
                        style={{
                          maxWidth: "150px",
                          borderRadius: "8px",
                          marginTop: "4px",
                        }}
                      />
                    </a>
                  ) : (
                    <a
                      href={msg.text}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        textDecoration: "none",
                        color: "#007bff",
                        fontWeight: 500,
                      }}
                    >
                      📎 {msg.fileName || "View File"}
                    </a>
                  )
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>

              <div className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>


      {typing && <div className="typing-indicator">Typing...</div>}

      {/* <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div> */}


      <div className="chat-input d-flex align-items-center">

        <input
          type="text"
          className="flex-grow-1"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder={uploading ? "Uploading..." : "Type a message..."}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={uploading}
        />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <button
          className="btn btn-light me-2"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
         <i className="fa fa-paperclip"></i>
        </button>
        <button onClick={sendMessage} className="btn btn-primary ms-2" disabled={uploading}>
          Send
        </button>
      </div>


      {/* ✅ Feedback Modal */}
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

export default Chat;
