// src/components/AgoraTest.jsx
import React, { useEffect, useRef, useState } from "react";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-sdk-ng";

const appId = "8d100366d5764a7d993a85da4d31aa7d"; // Replace with your Agora App ID

const AgoraTest = ({ token, channelName, uid }) => {
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const client = useRef(createClient({ mode: "rtc", codec: "vp8" }));

  useEffect(() => {
    if (!token || !channelName) return;

    const joinChannel = async () => {
      client.current.on("user-published", async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        if (mediaType === "video") {
          const remoteVideo = document.getElementById(`remote-video-${user.uid}`);
          user.videoTrack.play(remoteVideo);
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
        setRemoteUsers(prev => [...prev, user]);
      });

      client.current.on("user-unpublished", (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

      const [microphoneTrack, cameraTrack] = await createMicrophoneAndCameraTracks();
      localVideoRef.current && cameraTrack.play(localVideoRef.current);

      await client.current.join(appId, channelName, token, uid);
      await client.current.publish([microphoneTrack, cameraTrack]);

      setJoined(true);
    };

    joinChannel();

    return () => {
      client.current.leave();
    };
  }, [token, channelName, uid]);

  return (
    <div>
      <h3>Agora Video Call Test</h3>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div>
          <p>Local Video</p>
          <div
            ref={localVideoRef}
            style={{ width: 320, height: 240, backgroundColor: "#000" }}
          ></div>
        </div>

        <div>
          <p>Remote Video</p>
          {remoteUsers.map(user => (
            <div
              key={user.uid}
              id={`remote-video-${user.uid}`}
              style={{ width: 320, height: 240, backgroundColor: "#000" }}
            ></div>
          ))}
        </div>
      </div>
      {!joined && <p>Joining channel...</p>}
    </div>
  );
};

export default AgoraTest;
