import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  useAddCallTypeMutation,
  useEditCallTypeMutation,
} from "../../api/apiSlice";

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addCallType] = useAddCallTypeMutation();
  const [editCallType] = useEditCallTypeMutation();

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
  });

  const handleFormSubmit = async (values) => {
    if (props.formType === "edit") {
      values["newCallTypeName"] = values["name"];
      values["newCallTypeDescription"] = values["description"];
      values = { id: props.callTypeId, ...values };
      editCallType(values);
    } else {
      values["callTypeName"] = values["name"];
      values["callTypeDescription"] = values["description"];
      addCallType(values);
    }
    props.formCloseControl(false);
  };

  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create" ? "CREATE CALL TYPE" : "EDIT CALL TYPE"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Call Type"
            : "Edit an Existing Call Type"
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
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
