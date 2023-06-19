import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useSelector } from "react-redux";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.global.user);

  return (
    <Box>
      <EmployeeDashboard />
      {/*
      {user.userType === 1 && <AdminDashboard />}
      {user.userType === 2 && <ManagerDashboard />}
      {user.userType === 3 && <EmployeeDashboard />}
      */}
    </Box>
  );
};

export default Dashboard;
