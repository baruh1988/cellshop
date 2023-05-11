import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import jwt_decode from "jwt-decode";
import { tokens } from "../../theme";

const loginSchema = yup.object().shape({
  idNumber: yup.string().required("required"),
  password: yup.string().required("required"),
});

const loginInitialValues = {
  idNumber: "",
  password: "",
};

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3789/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      const decoded = jwt_decode(loggedIn.token);
      console.log(decoded);
      dispatch(setLogin({ user: decoded.dataForToken }));
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await login(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={loginInitialValues}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4 minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="ID Number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.idNumber}
              name="idNumber"
              error={Boolean(touched.idNumber) && Boolean(errors.idNumber)}
              helperText={touched.idNumber && errors.idNumber}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: colors.greenAccent[700],
                color: colors.primary,
                "&:hover": { color: colors.greenAccent[400] },
              }}
            >
              Login
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
