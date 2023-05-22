import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useAddUserMutation, useEditUserMutation } from "../../api/apiSlice";
import { useState } from "react";

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

  const [addUser] = useAddUserMutation();
  const [editUser] = useEditUserMutation();
  const [options, setOptions] = useState(props.getOptions());

  const phoneRegExp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const idNumberRegExp = /^\d{9}/;

  const checkoutSchema =
    props.formType === "addUser"
      ? yup.object().shape({
          idNumber: yup
            .string()
            .matches(idNumberRegExp, "ID number is not valid")
            .required("required"),
          firstName: yup.string().required("required"),
          lastName: yup.string().required("required"),
          password: yup.string().required("required"),

          address: yup.string().required("required"),
          email: yup.string().email("Email is not valid").required("required"),
          phoneNumber: yup
            .string()
            .matches(phoneRegExp, "Phone number is not valid")
            .required("required"),
        })
      : yup.object().shape({
          idNumber: yup
            .string()
            .matches(idNumberRegExp, "ID number is not valid")
            .required("required"),
          firstName: yup.string().required("required"),
          lastName: yup.string().required("required"),
          address: yup.string().required("required"),
          email: yup.string().email("Email is not valid").required("required"),
          phoneNumber: yup
            .string()
            .matches(phoneRegExp, "Phone number is not valid")
            .required("required"),
        });

  const handleFormSubmit = (values) => {
    values.userType = parseInt(values.userType);
    if (props.formType === "edit") {
      delete values.password;
      values = {
        id: props.userId,
        newIdNumber: values.idNumber,
        newUserType: values.idNumber,
        newUserType: values.userType,
        newFirstName: values.firstName,
        newLastName: values.lastName,
        newAddress: values.address,
        newEmail: values.email,
        newPhoneNumber: values.phoneNumber,
      };
      editUser(values);
    } else {
      addUser(values);
    }
    props.formCloseControl(false);
  };

  return (
    <Box m="20px">
      <Header
        title={props.formType === "craete" ? "CREATE USER" : "EDIT USER"}
        subtitle={
          props.formType === "create"
            ? "Create a New User Profile"
            : "Edit an Existing User Profile"
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
                label="ID Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.idNumber}
                name="idNumber"
                error={!!touched.idNumber && !!errors.idNumber}
                helperText={touched.idNumber && errors.idNumber}
                sx={{ gridColumn: "span 3" }}
              />
              <SelectWrapper
                name="userType"
                label="Access Level"
                options={options}
                sx={{ gridColumn: "span 1" }}
              />
              {props.formType === "create" ? (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                </>
              ) : (
                <></>
              )}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
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
