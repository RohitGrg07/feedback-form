import { useState } from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import { FeedbackForm } from "./components/FeedbackForm";
import { AdminLogin } from "./components/AdminLogin";
import { AdminPanel } from "./components/AdminPanel";

const STORAGE_KEY_ADMIN_LOGGED_IN = "adminLoggedIn";
const STORAGE_KEY_CURRENT_VIEW = "currentView";

function App() {
  // Initialize state from localStorage or defaults
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_LOGGED_IN);
    return saved === "true";
  });

  const [currentView, setCurrentView] = useState<"feedback" | "admin">(() => {
    // If admin is logged in, default to admin view
    const savedLogin = localStorage.getItem(STORAGE_KEY_ADMIN_LOGGED_IN);
    if (savedLogin === "true") {
      return "admin";
    }
    const savedView = localStorage.getItem(STORAGE_KEY_CURRENT_VIEW);
    return savedView === "feedback" || savedView === "admin"
      ? savedView
      : "feedback";
  });

  const handleNavigate = (view: "feedback" | "admin") => {
    setCurrentView(view);
    localStorage.setItem(STORAGE_KEY_CURRENT_VIEW, view);
    if (view === "feedback") {
      setIsAdminLoggedIn(false);
      localStorage.removeItem(STORAGE_KEY_ADMIN_LOGGED_IN);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView("admin");
    localStorage.setItem(STORAGE_KEY_ADMIN_LOGGED_IN, "true");
    localStorage.setItem(STORAGE_KEY_CURRENT_VIEW, "admin");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView("feedback");
    localStorage.removeItem(STORAGE_KEY_ADMIN_LOGGED_IN);
    localStorage.setItem(STORAGE_KEY_CURRENT_VIEW, "feedback");
  };

  return (
    <ThemeProvider>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isAdminLoggedIn={isAdminLoggedIn}
        />
        {currentView === "feedback" ? (
          <FeedbackForm />
        ) : isAdminLoggedIn ? (
          <AdminPanel onLogout={handleAdminLogout} />
        ) : (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
