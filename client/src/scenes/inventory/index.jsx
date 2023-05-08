import { Box } from "@mui/material";
import Header from "../../components/Header";

const Inventory = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Inventory" subtitle="" />
      </Box>
    </Box>
  );
};

export default Inventory;
