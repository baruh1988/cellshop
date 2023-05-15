import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const SelectWrapper = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: "filled",
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {Object.keys(options).map((item, pos) => {
        return (
          <MenuItem key={pos} value={item}>
            {options[item]}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const checkoutSchema = yup.object().shape({
    manufacturerId: yup.number().required("required!"),
    name: yup.string().required("required!"),
  });

  const handleFormSubmit = async (values) => {
    if (props.formType === "edit") {
      values["id"] = props.modelId;
      values["newManufacturerId"] = parseInt(values.manufacturerId);
      values["newModelName"] = values.name;
    } else {
      //values["manufacturerName"] = props.options[values.manufacturerId];
      values["modelName"] = values.name;
    }
    console.log(values);
    const url = `http://localhost:3789/model/${props.formType}Model`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    props.formCloseControl(false);
  };

  return (
    <Box m="20px">
      <Header
        title={props.formType === "create" ? "CREATE MODEL" : "EDIT MODEL"}
        subtitle={
          props.formType === "create"
            ? "Create a New Model"
            : "Edit an Existing Model"
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
                sx={{ gridColumn: "span 3" }}
              />
              <SelectWrapper
                name="manufacturerId"
                label="Manufacturer"
                options={props.options}
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
