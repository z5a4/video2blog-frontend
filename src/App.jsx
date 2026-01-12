import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./components/LandingPage";
import OTPSignupPage from "./components/OTPSignupPage"; // Changed from SignupPage
import OTPLoginPage from "./components/OTPLoginPage"; // Changed from LoginPage
import Dashboard from "./components/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [hasHashnode, setHasHashnode] = useState(false); // Optional: store Hashnode status

  const navigateTo = (page) => setCurrentPage(page);

  const handleLogin = (jwt, apiKeyStatus = {}) => {
  setToken(jwt);
  localStorage.setItem("token", jwt);
  // You can store API key status in localStorage or context if needed
  if (apiKeyStatus.hasHashnode) {
    localStorage.setItem("hasHashnode", "true");
  }
  if (apiKeyStatus.hasGroqApiKey) {
    localStorage.setItem("hasGroqApiKey", "true");
  }
  setCurrentPage("dashboard");
};

  const handleLogout = () => {
    setToken(null);
    setHasHashnode(false); // Reset Hashnode status
    localStorage.removeItem("token");
    setCurrentPage("landing");
  };

  const renderPage = () => {
    if (token && currentPage !== "dashboard") setCurrentPage("dashboard");

    switch (currentPage) {
      case "landing":
        return <LandingPage navigateTo={navigateTo} />;
      case "signup":
        return <OTPSignupPage navigateTo={navigateTo} />; // Changed to OTPSignupPage
      case "login":
        return <OTPLoginPage navigateTo={navigateTo} onLogin={handleLogin} />; // Changed to OTPLoginPage
      case "dashboard":
        return <Dashboard token={token} onLogout={handleLogout} />;
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      <Analytics />
    </div>
  );
}

export default App;