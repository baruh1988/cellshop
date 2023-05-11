import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const checkoutSchema = yup
    .object()
    .shape({ name: yup.string().required("required") });

  const handleFormSubmit = async (values) => {
    if (props.formType === "edit") {
      values["newManufacturerName"] = values["name"];
      values = { id: props.manufacturerId, ...values };
    } else {
      values["manufacturerName"] = values["name"];
    }
    const url = `http://localhost:3789/manufacturer/${props.formType}Manufacturer`;
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
          props.formType === "add" ? "CREATE MANUFACTURER" : "EDIT MANUFACTURER"
        }
        subtitle={
          props.formType === "add"
            ? "Create a New Manufacturer"
            : "Edit an Existing Manufacturer"
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
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
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
