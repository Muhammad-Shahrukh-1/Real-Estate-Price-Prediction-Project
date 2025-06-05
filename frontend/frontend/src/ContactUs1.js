import React from "react";

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
  return (
    <div style={contactStyle}>
      <form style={formStyle}>
        <h1>Contact Us</h1>
        <input type="text" placeholder="Your Name" style={inputStyle} required />
        <input type="email" placeholder="Your Email" style={inputStyle} required />
        <textarea placeholder="Your Message" rows="5" style={inputStyle} required></textarea>
        <button
          type="submit"
          style={{
            ...inputStyle,
            backgroundColor: "#f39c12",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactUs;
