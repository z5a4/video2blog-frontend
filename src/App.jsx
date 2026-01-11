import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const navigateTo = (page) => setCurrentPage(page);

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setCurrentPage("landing");
  };

  const renderPage = () => {
    if (token && currentPage !== "dashboard") setCurrentPage("dashboard");

    switch (currentPage) {
      case "landing":
        return <LandingPage navigateTo={navigateTo} />;
      case "signup":
        return <SignupPage navigateTo={navigateTo} />;
      case "login":
        return <LoginPage navigateTo={navigateTo} onLogin={handleLogin} />;
      case "dashboard":
        return <Dashboard token={token} onLogout={handleLogout} />;
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}
  <Analytics />
  </div>;
}

export default App;
