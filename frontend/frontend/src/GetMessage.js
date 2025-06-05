import React, { useEffect, useState } from "react";
import axios from "axios";

const messageStyle = {
  backgroundColor: "rgba(0,0,0,0.7)",
  color: "#fff",
  padding: "20px",
  margin: "10px auto",
  maxWidth: "600px",
  borderRadius: "8px",
  border: "1px solid #f39c12",
};

function GetMessage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/get_all_messages");
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>All Contact Messages</h1>
      {messages.map((msg) => (
        <div key={msg._id} style={messageStyle}>
          <p><strong>Name:</strong> {msg.name}</p>
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Message:</strong> {msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default GetMessage;
