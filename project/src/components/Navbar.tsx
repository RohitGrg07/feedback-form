import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { Moon, Sun, MessageSquare } from "lucide-react";
import { useThemeMode } from "../contexts/ThemeContext";

interface NavbarProps {
  currentView: "feedback" | "admin";
  onNavigate: (view: "feedback" | "admin") => void;
  isAdminLoggedIn: boolean;
}

export const Navbar = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
}: NavbarProps) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <MessageSquare style={{ marginRight: 8 }} />
          <Typography variant="h6" component="div">
            Feedback System
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => onNavigate("feedback")}
            variant={currentView === "feedback" ? "outlined" : "text"}
          >
            HOME
          </Button>
          {!isAdminLoggedIn && (
            <Button
              color="inherit"
              onClick={() => onNavigate("admin")}
              variant={currentView === "admin" ? "outlined" : "text"}
            >
              Admin
            </Button>
          )}
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
