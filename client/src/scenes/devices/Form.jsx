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
  Checkbox,
  FormControlLabel,
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
  useAddNewDeviceMutation,
  useEditInventoryItemMutation,
  useEditNewDeviceMutation,
  useGetInventoryQuery,
  useGetManufacturersQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";

const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const Form = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(
    props.formType === "create" ? 0 : 1
  );
  const [skipped, setSkipped] = useState(new Set());
  const [inventoryId, setInventoryId] = useState(
    props.initialValues.inventoryId
  );
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { data: manufacturers, isLoading: isLoadingManufacturers } =
    useGetManufacturersQuery();
  const {
    data: models,
    isLoading: isLoadingModels,
    isSuccess,
    isError,
    error,
  } = useGetModelsQuery();
  const { data: inventory, isLoading } = useGetInventoryQuery();
  const [addNewDevice] = useAddNewDeviceMutation();
  const [editNewDvice] = useEditNewDeviceMutation();

  const [checked, setChecked] = useState(props.initialValues.inStock);

  const steps = [
    "Select model",
    props.formType === "create" ? "Create device" : "Edit device",
  ];

  const checkoutSchema = yup.object().shape({
    imei: yup.number().required("required!"),
    inventoryId: yup.number().required("required!"),
  });

  const handleFormSubmit = async (values) => {
    values["inventoryId"] = inventoryId;
    values["inStock"] = checked;
    if (props.formType === "edit") {
      values["id"] = props.deviceId;
      values["newImei"] = values.imei;
      values["newInventoryId"] = inventoryId;
      values["newInStock"] = checked;
      editNewDvice(values);
    } else {
      addNewDevice(values);
    }
    props.formCloseControl(false);
  };

  const isStepOptional = (step) => {
    return props.formType === "create" ? step === 5 : step === 0;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

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

  const handleReset = () => {
    setActiveStep(0);
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "serialNumber",
      headerName: "Serial Number",
      flex: 1,
    },
    {
      field: "modelId",
      headerName: "Model",
      flex: 1,
      valueGetter: ({ row }) => {
        return models.data.find((el) => {
          return el.id === row.modelId;
        }).name;
      },
    },
    /*
    {
      field: "inventoryItemTypeId",
      headerName: "Item Type",
      flex: 1,
      valueGetter: ({ row }) => {
        return itemTypes.data.find((el) => {
          return el.id === row.inventoryItemTypeId;
        }).name;
      },
    },*/
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.price} ₪`;
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "quantityThreshold",
      headerName: "Quantity Threshold",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title={props.formType === "create" ? "CREATE DEVICE" : "EDIT DEVICE"}
        subtitle={props.formType === "create" ? "Create device" : "Edit device"}
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
          {isLoading || isLoadingManufacturers || isLoadingModels ? (
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
                  rows={inventory.data.filter(
                    (el) => el.inventoryItemTypeId === 1
                  )}
                  columns={columns}
                  components={{ Toolbar: CustomToolBar }}
                  getRowId={(row) => row.id}
                  onSelectionModelChange={(ids) => setInventoryId(...ids)}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  onClick={handleNext}
                  disabled={inventoryId === -1}
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
                        const tmp = inventory.data.find((el) => {
                          return el.id === inventoryId;
                        });
                        return el.id === tmp.modelId;
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
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="imei"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.imei}
                    name="imei"
                    error={!!touched.imei && !!errors.imei}
                    helperText={touched.imei && errors.imei}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                      />
                    }
                    label="In stock"
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
