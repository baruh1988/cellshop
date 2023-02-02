import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LoginPage from "./scenes/loginPage";
import Dashboard from "./scenes/dashboard";
import Layout from "./scenes/layout";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isLoggedIn = Boolean(useSelector((state) => state.user));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />
              }
            />
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
