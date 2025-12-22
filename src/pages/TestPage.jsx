import React, { useState } from "react";
import AgoraTest from "./AgoraTest";
import axios from "axios";

const TestPage = () => {
  const [channelName, setChannelName] = useState("");
  const [uid, setUid] = useState(Math.floor(Math.random() * 100000));
  const [token, setToken] = useState("");

  const generateToken = async () => {
    if (!channelName) return alert("Enter channel name");
    const { data } = await axios.get(`/api/agora/token?channelName=${channelName}&uid=${uid}`);
    setToken(data.token);
  };

  return (
    <div>
      <h2>Agora Test Page</h2>
      <input
        placeholder="Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <button onClick={generateToken}>Generate Token & Start Call</button>

      {token && channelName && (
        <AgoraTest token={token} channelName={channelName} uid={uid} />
      )}
    </div>
  );
};

export default TestPage;
