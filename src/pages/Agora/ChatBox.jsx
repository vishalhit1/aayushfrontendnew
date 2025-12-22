import React, { useEffect, useState } from "react";

const ChatBox = ({ channelName, uid, client }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // LOGIN REQUIRED!
        await client.login({ uid: String(uid) });

        const newChannel = client.createChannel(channelName);
        await newChannel.join();

        newChannel.on("ChannelMessage", (msg, memberId) => {
          setMessages((prev) => [
            ...prev,
            { sender: memberId, text: msg.text },
          ]);
        });

        setChannel(newChannel);
      } catch (err) {
        console.error("RTM Error:", err);
      }
    };

    init();

    return () => {
      if (channel) channel.leave();
      client.logout();
    };
  }, [channelName]);

  const sendMessage = async () => {
    if (!input.trim() || !channel) return;

    await channel.sendMessage({ text: input });

    setMessages((prev) => [...prev, { sender: uid, text: input }]);
    setInput("");
  };

  return (
    <div className="chat-panel">
      <h5 className="text-center py-2 border-bottom border-secondary m-0">
        Chat
      </h5>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.sender}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
