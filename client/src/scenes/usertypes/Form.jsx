import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const checkoutSchema = yup
    .object()
    .shape({ userTypeDescription: yup.string().required("required") });

  const handleFormSubmit = async (values) => {
    if (props.formType === "edit") {
      values["newUserTypeDescription"] = values["description"];
      values = { id: props.id, ...values };
    } else {
      values["userTypeDescription"] = values["description"];
    }
    const url = `http://localhost:3789/userType/${props.formType}UserType`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    //const decodedResponse = await response.json();
    //console.log(decodedResponse);
    props.formCloseControl(false);
  };

  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create" ? "CREATE USER TYPE" : "EDIT USER TYPE"
        }
        subtitle={
          props.formType === "add"
            ? "Create a New User Type"
            : "Edit an Existing User Type"
        }
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={props.initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="User Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {props.formType === "add" ? "Add" : "Save"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
