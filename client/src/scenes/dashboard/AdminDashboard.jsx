import { Box } from "@mui/material";
import Header from "../../components/Header";

const AdminDashboard = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="ADMIN DASHBOARD" subtitle="" />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
