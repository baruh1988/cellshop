import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  useAddSupplierMutation,
  useEditSupplierMutation,
} from "../../api/apiSlice";

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addSupplier] = useAddSupplierMutation();
  const [editSupplier] = useEditSupplierMutation();

  const phoneRegExp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const idNumberRegExp = /^\d{9}/;

  const checkoutSchema = yup.object().shape({
    idNumber: yup
      .string()
      .matches(idNumberRegExp, "ID number is not valid")
      .required("required"),
    name: yup.string().required("required"),
    email: yup.string().email("Email is not valid").required("required"),
    phoneNumber: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("required"),
  });

  const handleFormSubmit = (values) => {
    if (props.formType === "edit") {
      values = {
        id: props.supplierId,
        newIdNumber: values.idNumber,
        newName: values.name,
        newEmail: values.email,
        newPhoneNumber: values.phoneNumber,
      };
      editSupplier(values);
    } else {
      addSupplier(values);
    }
    props.formCloseControl(false);
  };

  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "craete" ? "CREATE SUPPLIER" : "EDIT SUPPLIER"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Supplier"
            : "Edit an Existing Supplier"
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
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
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
