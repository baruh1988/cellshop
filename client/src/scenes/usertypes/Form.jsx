import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  useAddUserTypeMutation,
  useEditUserTypeMutation,
} from "../../api/apiSlice";

// Add/Edit userTypes form component for rendering
const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addUserType] = useAddUserTypeMutation();
  const [editUserType] = useEditUserTypeMutation();

  // Validation for form inputs
  const checkoutSchema = yup
    .object()
    .shape({ description: yup.string().required("required") });

  // Add/Edit userType Api calls
  const handleFormSubmit = (values) => {
    if (props.formType === "edit") {
      values["newUserTypeDescription"] = values["description"];
      values = { id: props.userTypeId, ...values };
      editUserType(values);
    } else {
      values["userTypeDescription"] = values["description"];
      addUserType(values);
    }
    props.formCloseControl(false);
  };

  // Render the form on screen
  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create" ? "CREATE USER TYPE" : "EDIT USER TYPE"
        }
        subtitle={
          props.formType === "create"
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
                {props.formType === "create" ? "Add" : "Save"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
