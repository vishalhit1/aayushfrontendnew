import React, { useEffect, useState } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";

const DoctorVideoCall = () => {
  const socket = io(API_URL)

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [waiting, setWaiting] = useState(true);
  const [starting, setStarting] = useState(false);

  const channelName = searchParams.get("channelName");
  const uid = Number(searchParams.get("uid"));
  const token = searchParams.get("token");
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const bookingId = searchParams.get("bookingId");
  const patientName = searchParams.get("patientName");

  console.log("channelName",channelName)
  console.log("uid",uid)
  console.log("token",token)
  console.log("patientId",patientId)
  console.log("doctorId",doctorId)
  console.log("bookingId",bookingId)


  useEffect(() => {
    if (!doctorId || !bookingId) return;
  
    socket.emit("doctorJoinVideoConsultation", { patientId, bookingId, doctorId });
    console.log("🩺 Doctor joined consultation:", { doctorId, bookingId });
  
    socket.on("participantJoined", (data) => {
      console.log("Doctor side data ➤", data);
      if (data.role === "patient") {
        console.log("✅ patient joined!");
        setWaiting(false);
      }
    });
  
    socket.on("consultationStarted", () => {
      console.log("🚀 Consultation started!");
      setWaiting(false);
      setStarting(true);
  
      // Smooth transition
      setTimeout(() => setStarting(false), 1500);
    });
  
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

 console.log("doctor waiting?????????????????????????????????", waiting)

 return waiting ? (
  <div className="waiting-screen doctor-side">
    <div className="waiting-card">
      <div className="pulse-icon doctor-pulse">
        <div className="icon">👩‍⚕️</div>
      </div>

      <h2>Waiting for your patient to join...</h2>
      <p>
        Please keep this window open. The consultation will begin automatically once the patient joins.
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

export default DoctorVideoCall;
