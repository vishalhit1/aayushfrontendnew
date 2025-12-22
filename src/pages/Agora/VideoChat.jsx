import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../../api/axios";
import { API_URL } from "../../../config";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { IoSend } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";

const socket = io(API_URL);

const VideoChat = ({
    bookingId,
    userType,
    doctorName: propDoctorName,
    patientName: propPatientName,
    doctorId,
    patientId,
}) => {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();


    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const [uploading, setUploading] = useState(false);

    const [doctorName, setDoctorName] = useState(propDoctorName || "Doctor");
    const [patientName, setPatientName] = useState(propPatientName || "Patient");

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const isMounted = useRef(true);

    const _bookingId = bookingId || searchParams.get("bookingId");
    const _role = userType;

    console.log("_role", _role)

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(scrollToBottom, [messages]);


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

        socket.on("chatMessage", ({ senderRole, text  }) => {
            console.log("senderRole", senderRole)
            console.log("_role", _role)

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




    // ---------------- SEND MESSAGE ----------------
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
            fetchMessages()
        } catch (err) {
            console.error("File upload failed:", err);
            toast.error("File upload failed");
            setUploading(false);
        }
    };

    return (
        <div className="video-call-chat-container">
            {/* --------- Messages --------- */}
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat-bubble ${msg.sender === "You" ? "self" : "other"}`}

                    >
                        <div className="bubble">
                            <div className="sender">{msg.sender}</div>
                            <div className="text">

                                {/* File messages */}
                                {msg.type === "file" ? (
                                    /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.text) ? (
                                        <a href={msg.text} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={msg.text}
                                                alt={msg.fileName}
                                                style={{
                                                    maxWidth: "150px",
                                                    borderRadius: "8px",
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

            {/* --------- Input Bar --------- */}
            <div className="chat-input-bar">
                <input
                    type="text"
                    placeholder="Type a message…"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
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

                <button className="send-btn" onClick={sendMessage} disabled={uploading}>
                    <IoSend size={22} />
                </button>
            </div>
        </div>
    );
};

export default VideoChat;
