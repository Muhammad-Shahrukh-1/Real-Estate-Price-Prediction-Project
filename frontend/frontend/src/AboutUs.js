import React from "react";

const aboutStyle = {
  position: "relative",
  height: "60vh",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "60px 20px",
  borderRadius: "10px",
  overflow: "hidden",
};

const backgroundImageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "brightness(0.4)",
  zIndex: 1,
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  maxWidth: "700px",
  margin: "auto",
  lineHeight: "1.6",
  fontSize: "20px",
  textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
  textAlign: "center",
};

function AboutUs() {
  return (
    <div style={aboutStyle}>
      <div style={backgroundImageStyle}></div>
      <div style={contentStyle}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>About Us</h1>
        <p>
          <strong>Real Estate Price Prediction and Recommendation System</strong> is a powerful
          platform that helps users make better decisions by predicting property prices based on
          location, type, and features. Our goal is to bring AI-powered insights to the real estate
          industry, making it easier for everyone to buy and sell property with confidence.
        </p>

        {/* New centered bold line below the description */}
        <p style={{ fontSize: "24px", fontWeight: "bold", marginTop: "30px" }}>
          Buy Low, Predict Like a Pro.🏡😎
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
