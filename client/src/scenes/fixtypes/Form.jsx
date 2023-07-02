import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  useAddFixTypeMutation,
  useEditFixTypeMutation,
} from "../../api/apiSlice";

// Add/Edit fixType form component for rendering
const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addFixType] = useAddFixTypeMutation();
  const [editFixType] = useEditFixTypeMutation();

  // Validation for form inputs
  const checkoutSchema = yup
    .object()
    .shape({ description: yup.string().required("required") });

  // Add/Edit fixType Api calls
  const handleFormSubmit = async (values) => {
    if (props.formType === "edit") {
      values["newFixTypeDescription"] = values["description"];
      values = { id: props.fixTypeId, ...values };
      editFixType(values);
    } else {
      values["fixTypeDescription"] = values["description"];
      addFixType(values);
    }
    props.formCloseControl(false);
  };

  // Render the form on screen
  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create" ? "CREATE FIX TYPE" : "EDIT FIX TYPE"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Fix Type"
            : "Edit an Existing Fix Type"
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
                label="Fix Type"
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
