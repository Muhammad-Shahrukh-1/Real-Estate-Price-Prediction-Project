import React, { useEffect, useState } from "react";
import { FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import GetMessage from "./GetMessage"

// Gradient background for entire app
const appStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #BF7587, #993EBB)",
  padding: 20,
  fontFamily: "'Segoe UI', sans-serif",
};

// Semi-transparent container for readable UI
const containerStyle = {
  maxWidth: 900,
  margin: "auto",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [propertyType, setPropertyType] = useState("House");
  const [floor, setFloor] = useState(1);
  const [bedrooms, setBedrooms] = useState(3);
  const [areaSqYards, setAreaSqYards] = useState(200);
  const bathrooms = bedrooms;

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [adjustedPrice, setAdjustedPrice] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/areas")
      .then((res) => res.json())
      .then((data) => {
        setAreas(data.uniqueAreas || []);
        if (data.uniqueAreas?.length > 0) {
          setSelectedArea(data.uniqueAreas[0]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedArea) return;
    const payload = {
      selectedArea,
      propertyType,
      floor: propertyType === "Flat" ? floor : 0,
      bedrooms,
      areaSqYards,
    };

    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setPredictedPrice(data.predictedPrice || null);
        setAdjustedPrice(data.adjustedPrice || null);
        setRecommendations(data.recommendations || []);
      })
      .catch(console.error);
  }, [selectedArea, propertyType, floor, bedrooms, areaSqYards]);

  const navStyle = {
    display: "flex",
    justifyContent: "center",
    gap: 30,
    marginBottom: 20,
    borderBottom: "2px solid #ccc",
    paddingBottom: 10,
  };

  const tabStyle = (tab) => ({
    padding: 10,
    cursor: "pointer",
    borderBottom: activeTab === tab ? "3px solid #fff" : "none",
    color: activeTab === tab ? "#993EBB" : "#555",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: activeTab === tab ? "bold" : "normal",
    transition: "all 0.3s ease",
    backgroundColor: activeTab === tab ? "#fff" : "transparent",
    borderRadius: 8,
  });

  const predictionContainer = {
    backgroundColor: "#f1c40f",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    marginTop: 30,
  };

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        {/* Tabs Navigation */}
        <div style={navStyle}>
          <div style={tabStyle("dashboard")} onClick={() => setActiveTab("dashboard")}>
            <FaHome /> Dashboard
          </div>
          <div style={tabStyle("about")} onClick={() => setActiveTab("about")}>
            <FaInfoCircle /> About Us
          </div>
          <div style={tabStyle("contact")} onClick={() => setActiveTab("contact")}>
            <FaEnvelope /> Contact Us
          </div>

          <div style={tabStyle("get_message")} onClick={() => setActiveTab("get_message")}>
            <FaEnvelope /> View Message
          </div>


        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <>
            <div
              style={{
                textAlign: "center",
                fontSize: 32,
                fontWeight: "bold",
                color: "#2c3e50",
                marginBottom: 20,
              }}
            >
              Real Estate Price Prediction
            </div>

            <h3>Select Area:</h3>
            {areas.length === 0 ? (
              <div>Loading areas...</div>
            ) : (
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ width: "100%", padding: 8, fontSize: 16 }}
              >
                {areas.map((area, idx) => (
                  <option key={idx} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            <h3 style={{ marginTop: 20 }}>Select Property Type:</h3>
            <label>
              <input
                type="radio"
                name="propertyType"
                value="House"
                checked={propertyType === "House"}
                onChange={() => setPropertyType("House")}
              />{" "}
              House
            </label>
            <label style={{ marginLeft: 20 }}>
              <input
                type="radio"
                name="propertyType"
                value="Flat"
                checked={propertyType === "Flat"}
                onChange={() => setPropertyType("Flat")}
              />{" "}
              Flat
            </label>

            {propertyType === "Flat" && (
              <div style={{ marginTop: 20 }}>
                <h3>Select Floor:</h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={floor}
                  onChange={(e) => setFloor(parseInt(e.target.value))}
                />
                <div>Floor: {floor}</div>
              </div>
            )}

            <h3 style={{ marginTop: 20 }}>Enter Property Details:</h3>
            <label>
              Bedrooms: {bedrooms}
              <input
                type="range"
                min="1"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
            <div>Bathrooms (auto-set): {bathrooms}</div>

            <label style={{ marginTop: 20 }}>
              Area (sq yards): {areaSqYards}
              <input
                type="range"
                min="50"
                max="1000"
                value={areaSqYards}
                onChange={(e) => setAreaSqYards(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>

            {adjustedPrice !== null && (
              <div style={predictionContainer}>
                <h2>
                  Estimated Price for {propertyType} in {selectedArea}:
                </h2>
                <h2>
                  Rs.{" "}
                  {adjustedPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
            )}

            <div style={{ marginTop: 30 }}>
              <h3>Recommended Similar Properties:</h3>
              <table
                style={{ width: "100%", borderCollapse: "collapse" }}
                border="1"
                cellPadding="8"
              >
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, idx) => (
                      <tr key={idx}>
                        <td>{rec.Address}</td>
                        <td>Rs. {rec.Price.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        No recommendations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "about" && <AboutUs />}
        {activeTab === "contact" && <ContactUs />}
        {activeTab === "get_message" && <GetMessage />}
      </div>
    </div>
  );
}

export default App;
