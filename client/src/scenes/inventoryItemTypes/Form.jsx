import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  useAddInventoryItemTypeMutation,
  useEditInventoryItemTypeMutation,
} from "../../api/apiSlice";

// Add/Edit inventoryItemTypes form component for rendering
const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addItemType] = useAddInventoryItemTypeMutation();
  const [editItemType] = useEditInventoryItemTypeMutation();

  // Validation for form inputs
  const checkoutSchema = yup
    .object()
    .shape({ name: yup.string().required("required") });

  // Add/Edit inventoryItemType Api calls
  const handleFormSubmit = (values) => {
    if (props.formType === "edit") {
      values["newName"] = values["name"];
      values = { id: props.itemTypeId, ...values };
      editItemType(values);
    } else {
      addItemType(values);
    }
    props.formCloseControl(false);
  };

  // Render the form on screen
  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create" ? "CREATE ITEM TYPE" : "EDIT ITEM TYPE"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Item Type"
            : "Edit an Existing Item Type"
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
                label="Item Type"
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
