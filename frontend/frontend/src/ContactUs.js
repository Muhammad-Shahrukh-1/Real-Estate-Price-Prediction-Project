import React, { useState } from "react";
import axios from "axios";



const contactStyle = {
  backgroundImage: "url('https://images.unsplash.com/photo-1581090700227-1e8a1b1a9365')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "60px 20px",
  color: "#fff",
  textShadow: "1px 1px 2px black",
  borderRadius: "10px",
};

const formStyle = {
  maxWidth: 600,
  margin: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  padding: 30,
  borderRadius: 10,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  margin: "10px 0",
  borderRadius: 5,
  border: "none",
  fontSize: 16,
};
function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/post_contact_data", formData);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  return (
    <div style={contactStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1>Contact Us</h1>
        <input type="text" name="name" placeholder="Your Name" style={inputStyle} value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" style={inputStyle} value={formData.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" rows="5" style={inputStyle} value={formData.message} onChange={handleChange} required></textarea>
        <button type="submit" style={{ ...inputStyle, backgroundColor: "#f39c12", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactUs;