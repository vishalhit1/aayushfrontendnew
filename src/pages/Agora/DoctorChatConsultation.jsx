// src/pages/doctor/DoctorChatConsultation.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_API_URL);

const DoctorChatConsultation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const channelName = searchParams.get("channelName");
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const patientId = searchParams.get("patientId");
  const bookingId = searchParams.get("bookingId");
  const patientName = searchParams.get("patientName");



  if (!channelName || !uid || !token || !patientId || !bookingId) {
    toast.error("Missing chat parameters!");
    navigate(-1);
    return null;
  }

  return (
    <Chat
      role="doctor"
      channelName={channelName}
      uid={uid}
      token={token}
      patientId={patientId}
      bookingId={bookingId}
      patientName = {patientName}
    />
  );
};

export default DoctorChatConsultation;
