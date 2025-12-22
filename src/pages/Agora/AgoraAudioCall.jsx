import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AudioCall from "./AudioCall";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";

const AgoraAudioCall = () => {
  const socket = io(API_URL);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [waiting, setWaiting] = useState(true);

  const channelName = searchParams.get("channelName");
  const uid = Number(searchParams.get("uid"));
  const token = searchParams.get("token");
  const doctorId = searchParams.get("doctorId");
  const bookingId = searchParams.get("bookingId");
  const patientId = searchParams.get("patientId");
  const doctorName = searchParams.get("doctorName");

  useEffect(() => {
    if (!doctorId || !bookingId || !patientId) return;

    socket.emit("patientJoinAudioConsultation", { doctorId, bookingId, patientId });
    console.log("👤 Patient joined consultation:", { doctorId, bookingId, patientId });

    socket.on("participantJoined", (data) => {
      if (data.role === "doctor") {
        console.log("✅ Doctor joined");
        setWaiting(false);
      }
    });

    socket.on("consultationStarted", () => setWaiting(false));

    return () => {
      socket.off("participantJoined");
      socket.off("consultationStarted");
    };
  }, [doctorId, bookingId, patientId]);

  if (!channelName || !uid || !token || !doctorId || !bookingId) {
    alert("Missing consultation details!");
    navigate(-1);
    return null;
  }

  return waiting ? (
    <div className="audio-waiting-screen patient-side">
      <div className="audio-waiting-card">
        <div className="audio-pulse-icon">
          <div className="audio-icon">🎧</div>
        </div>
        <h2>Waiting for your doctor to join...</h2>
        <p>
          Please keep this window open. The audio consultation will begin automatically once the doctor connects.
        </p>
        <div className="audio-loader-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  ) : (
    <AudioCall
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

export default AgoraAudioCall;
