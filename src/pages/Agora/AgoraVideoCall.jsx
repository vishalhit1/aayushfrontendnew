import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";

const AgoraVideoCall = () => {
  const socket = io(API_URL);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [waiting, setWaiting] = useState(true);

  const channelName = searchParams.get("channelName");
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const doctorId = searchParams.get("doctorId");
  const bookingId = searchParams.get("bookingId");
  const type = searchParams.get("type");
  const patientId = searchParams.get("patientId");
  const doctorName = searchParams.get("doctorName");

  useEffect(() => {
    if (!doctorId || !bookingId || !patientId) return;

    socket.emit("patientJoinVideoConsultation", { doctorId, bookingId, patientId });
    console.log("🔗 Patient joined consultation:", { doctorId, bookingId, patientId });

    socket.on("participantJoined", (data) => {
      console.log("Patient side data ➤", data);
      if (data.role === "doctor") {
        console.log("✅ Doctor joined!");
        setWaiting(false);
      }
    });

    socket.on("consultationStarted", () => setWaiting(false));

    return () => {
      socket.off("participantJoined");
      socket.off("consultationStarted");
    };
  }, [doctorId, bookingId, patientId]);

  // Check for missing params
  if (!channelName || !uid || !token || !doctorId || !bookingId) {
    alert("Missing consultation parameters!");
    // navigate(-1);
    return null;
  }

  return waiting ? (
    <div className="waiting-screen">
      <div className="waiting-card">
        <div className="pulse-icon">
          <div className="icon">🩺</div>
        </div>
  
        <h2>Waiting for your doctor to join...</h2>
        <p>
          Please keep this window open. Your consultation will begin automatically once the doctor joins.
        </p>
  
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
  
      <p className="footer-note">
        Powered by <strong>Ayush Wellness Limited</strong>
      </p>
    </div>
  ) : (
    <VideoCall
      role="patient"
      channelName={channelName}
      uid={Number(uid)}
      token={token}
      doctorId={doctorId}
      bookingId={bookingId}
      type={type}
      doctorName = {doctorName}

    />
  );
  
  };  

export default AgoraVideoCall;
