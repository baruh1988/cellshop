import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useSelector } from "react-redux";
import Home from "./scenes/home";
import Login from "./scenes/login";

function App() {
  const [theme, colorMode] = useMode();
  const isLoggedIn = Boolean(useSelector((state) => state.user));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="*"
              element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </ColorModeContext.Provider>
  );
}

export default App;
