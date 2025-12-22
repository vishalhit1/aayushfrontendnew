// src/pages/patient/AgoraChatConsultation.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_API_URL);

const AgoraChatConsultation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const channelName = searchParams.get("channelName");
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const doctorId = searchParams.get("doctorId");
  const bookingId = searchParams.get("bookingId");
  const doctorName = searchParams.get("doctorName");


  if (!channelName || !uid || !token || !doctorId || !bookingId) {
    toast.error("Missing chat parameters!");
    navigate(-1);
    return null;
  }

  return (
    <Chat
      role="patient"
      channelName={channelName}
      uid={uid}
      token={token}
      doctorId={doctorId}
      bookingId={bookingId}
      doctorName = {doctorName}

    />
  );
};

export default AgoraChatConsultation;
