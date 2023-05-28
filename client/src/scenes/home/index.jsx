import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import Dashboard from "../dashboard";
import Users from "../users";
import UserTypes from "../usertypes";
import Inventory from "../inventory";
import CallTypes from "../calltypes";
import Manufacturers from "../manufacturers";
import Models from "../models";
import FaultTypes from "../faulttypes";
import FixTypes from "../fixtypes";
import InventoryItemTypes from "../inventoryItemTypes";
import Suppliers from "../suppliers";
import Customers from "../customers";
import Products from "../products";
import Devices from "../devices";

function Home() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/userTypes" element={<UserTypes />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/products" element={<Products />} />
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/models" element={<Models />} />
              <Route path="/callTypes" element={<CallTypes />} />
              <Route path="/faultTypes" element={<FaultTypes />} />
              <Route path="/fixTypes" element={<FixTypes />} />
              <Route path="/itemTypes" element={<InventoryItemTypes />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/customers" element={<Customers />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Home;
