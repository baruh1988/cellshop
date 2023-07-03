import {
  Box,
  Button,
  TextField,
  InputAdornment,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { tokens } from "../../theme";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  useAddInventoryItemMutation,
  useEditInventoryItemMutation,
  useGetManufacturersQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";

// Custom select drop down menu to select item type
const SelectWrapper = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  // Change selected menu item
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

// Toolbar component for data table, for filtering data
const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

// Add/Edit inventoryItem form component for rendering
const Form = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(
    props.formType === "create" ? 0 : 1
  );
  const [skipped, setSkipped] = useState(new Set());
  const [modelId, setModelId] = useState(props.initialValues.modelId);
  const [options, setOptions] = useState(props.getOptions());
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // fetch data from server
  const { data: manufacturers, isLoading: isLoadingManufacturers } =
    useGetManufacturersQuery();
  const {
    data: models,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetModelsQuery();
  const [addInventoryItem] = useAddInventoryItemMutation();
  const [editInventoryItem] = useEditInventoryItemMutation();

  // Define steps for add/edit inventoryItem process
  const steps = [
    "Select model",
    props.formType === "create"
      ? "Create inventory item"
      : "Edit inventory item",
  ];

  // Validation for form inputs
  const checkoutSchema = yup.object().shape({
    modelId: yup.number().required("required!"),
    description: yup.string().required("required!"),
    serialNumber: yup.string().required("required!"),
    quantity: yup.number().min(0).required("required!"),
    price: yup.number().min(0).required("required!"),
    quantityThreshold: yup.number().min(0).required("required!"),
    //image: yup.string().required("required!"),
  });

  // Add/Edit inventory Api calls
  const handleFormSubmit = async (values) => {
    values["modelId"] = modelId;
    values.inventoryItemTypeId = parseInt(values.inventoryItemTypeId);
    if (props.formType === "edit") {
      values["id"] = props.inventoryId;
      values["newModelId"] = values.modelId;
      values["newInventoryItemTypeId"] = values.inventoryItemTypeId;
      values["newDescription"] = values.description;
      values["newSerialNumber"] = values.serialNumber;
      values["newQunatity"] = values.quantity;
      values["newPrice"] = values.price;
      values["newQunatityThreshold"] = values.quantityThreshold;
      values["newImage"] = values.image;
      editInventoryItem(values);
    } else {
      addInventoryItem(values);
    }
    props.formCloseControl(false);
  };

  // Check if step is optional
  const isStepOptional = (step) => {
    return props.formType === "create" ? step === 5 : step === 0;
  };

  // Check if step was skipped
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  // Move to next step in the process
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // Move to previous step in the process
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // Reset form
  const handleReset = () => {
    setActiveStep(0);
  };

  // Data columns definition for data table
  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "name",
      headerName: "Model",
      flex: 1,
    },
    {
      field: "manufacturerId",
      headerName: "Manufacturer",
      flex: 1,
      valueGetter: ({ row }) => {
        return manufacturers.data.find((el) => {
          return el.id === row.manufacturerId;
        }).name;
      },
    },
  ];

  // Render the form on screen
  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create"
            ? "CREATE INVENTORY ITEM"
            : "EDIT INVENTORY ITEM"
        }
        subtitle={
          props.formType === "create" ? "Create an item" : "Edit an item"
        }
      />
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 ? (
        <>
          {isLoading || isLoadingManufacturers ? (
            <CircularProgress />
          ) : (
            <>
              <Box
                //m="40px 0 0 0"
                height="25vh"
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "none",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                  },
                  "& .name-column--cell": {
                    color: colors.greenAccent[300],
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                  },
                  "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`,
                  },
                  //gridColumn: "span 4",
                }}
              >
                <DataGrid
                  rows={models.data}
                  columns={columns}
                  components={{ Toolbar: CustomToolBar }}
                  getRowId={(row) => row.id}
                  onSelectionModelChange={(ids) => setModelId(...ids)}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  onClick={handleNext}
                  disabled={modelId === -1}
                  color="secondary"
                  variant="contained"
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </>
      ) : (
        <>
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
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    disabled
                    variant="filled"
                    type="text"
                    label="Model"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      models.data.find((el) => {
                        return el.id === modelId;
                      }).name
                    }
                    name="modelId"
                    error={!!touched.modelId && !!errors.modelId}
                    helperText={touched.modelId && errors.modelId}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="change model"
                            onClick={handleBack}
                            edge="end"
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Serial Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.serialNumber}
                    name="serialNumber"
                    error={!!touched.serialNumber && !!errors.serialNumber}
                    helperText={touched.serialNumber && errors.serialNumber}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    multiline
                    rows={5}
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    inputProps={{
                      step: 0.01,
                      min: 0.0,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {" "}
                          <InputAdornment position="start">₪</InputAdornment>
                        </InputAdornment>
                      ),
                    }}
                    label="Price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    name="price"
                    error={!!touched.price && !!errors.price}
                    helperText={touched.price && errors.price}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    inputProps={{
                      min: 0,
                    }}
                    label="Quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    name="quantity"
                    error={!!touched.quantity && !!errors.quantity}
                    helperText={touched.quantity && errors.quantity}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    inputProps={{
                      min: 0,
                    }}
                    label="Quantity Threshold"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantityThreshold}
                    name="quantityThreshold"
                    error={
                      !!touched.quantityThreshold && !!errors.quantityThreshold
                    }
                    helperText={
                      touched.quantityThreshold && errors.quantityThreshold
                    }
                    sx={{ gridColumn: "span 1" }}
                  />
                  <SelectWrapper
                    name="inventoryItemTypeId"
                    label="Item Type"
                    options={options}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Image"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.image}
                    name="image"
                    error={!!touched.image && !!errors.image}
                    helperText={touched.image && errors.image}
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
        </>
      )}
    </Box>
  );
};

export default Form;
