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
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="" />
        {user.userType === 1 && <AdminDashboard />}
        {user.userType === 2 && <ManagerDashboard />}
        {user.userType === 3 && <EmployeeDashboard />}
      </Box>
    </Box>
  );
};

export default Dashboard;
