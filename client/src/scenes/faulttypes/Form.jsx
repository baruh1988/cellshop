import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const checkoutSchema = yup
    .object()
    .shape({ description: yup.string().required("required") });

  const handleFormSubmit = async (values) => {
    if (props.formType === "edit") {
      values["newFaultTypeDescription"] = values["description"];
      values = { id: props.faultTypeId, ...values };
    } else {
      values["faultTypeDescription"] = values["description"];
    }
    const url = `http://localhost:3789/faultType/${props.formType}FaultType`;
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
          props.formType === "create" ? "CREATE FAULT TYPE" : "EDIT FAULT TYPE"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Fault Type"
            : "Edit an Existing Fault Type"
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
                label="Fault Type"
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
