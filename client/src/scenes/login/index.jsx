import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import Form from "./Form";
import { useState } from "react";

const Login = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Cellshop
        </Typography>
      </Box>
      <Box
        width={isNonMobile ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background}
      >
        <Typography fontWeight="500" variant="h3" sx={{ mb: "1.5rem" }}>
          Login
        </Typography>
        <Form setOpen={setOpen} setErrorMsg={setErrorMsg} />
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Login;
