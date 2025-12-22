import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AudioCall from "./AudioCall";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";

const DoctorAudioCall = () => {
  const socket = io(API_URL);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [waiting, setWaiting] = useState(true);

  const channelName = searchParams.get("channelName");
  const uid = Number(searchParams.get("uid"));
  const token = searchParams.get("token");
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const bookingId = searchParams.get("bookingId");
  const patientName = searchParams.get("patientName");

  useEffect(() => {
    if (!doctorId || !bookingId) return;

    socket.emit("doctorJoinAudioConsultation", { patientId, bookingId, doctorId });
    console.log("🩺 Doctor joined consultation:", { doctorId, bookingId });

    socket.on("participantJoined", (data) => {
      if (data.role === "patient") {
        console.log("✅ Patient joined");
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
    // navigate(-1);
    return null;
  }

  return waiting ? (
    <div className="audio-waiting-screen audio-doctor-side">
      <div className="audio-waiting-card">
        <div className="audio-pulse-icon audio-doctor-pulse">
          <div className="audio-icon">📞</div>
        </div>
        <h2>Waiting for patient to join...</h2>
        <p>
          Please keep this window open. The audio consultation will begin automatically once the patient joins.
        </p>
        <div className="audio-loader-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  ) : (
    <AudioCall
      role="doctor"
      channelName={channelName}
      uid={uid}
      token={token}
      patientId={patientId}
      doctorId={doctorId}
      bookingId={bookingId}
      patientName = {patientName}
    />
  );
};


export default DoctorAudioCall;
