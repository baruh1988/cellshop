import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  useAddCustomerMutation,
  useEditCustomerMutation,
} from "../../api/apiSlice";
import { useState } from "react";

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addCustomer] = useAddCustomerMutation();
  const [editCustomer] = useEditCustomerMutation();

  const phoneRegExp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const idNumberRegExp = /^\d{9}/;

  /*
  const checkoutSchema =
    props.formType === "create"
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
*/
  const checkoutSchema = yup.object().shape({
    idNumber: yup
      .string()
      .matches(idNumberRegExp, "ID number is not valid")
      .required("required"),
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Email is not valid").required("required"),
  });

  const handleFormSubmit = (values) => {
    if (props.formType === "edit") {
      delete values.password;
      values = {
        id: props.customerId,
        newIdNumber: values.idNumber,
        newFirstName: values.firstName,
        newLastName: values.lastName,
        newEmail: values.email,
        //newPhoneNumber: values.phoneNumber,
      };
      editCustomer(values);
    } else {
      addCustomer(values);
    }
    props.formCloseControl(false);
  };

  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create" ? "CREATE CUSTOMER" : "EDIT CUSTOMER"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Customer Profile"
            : "Edit an Existing Customer Profile"
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
                sx={{ gridColumn: "span 4" }}
              />
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
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
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
