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
} from "@mui/material";
import { Formik } from "formik";
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
  useAddModelMutation,
  useEditModelMutation,
  useGetManufacturersQuery,
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
  const [manufacturerId, setManufacturerId] = useState(
    props.initialValues.manufacturerId
  );
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const {
    data: manufacturers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetManufacturersQuery();
  const [addModel] = useAddModelMutation();
  const [editModel] = useEditModelMutation();

  const steps = [
    "Select manufacturer",
    props.formType === "create" ? "Create model" : "Edit model",
  ];
  const checkoutSchema = yup.object().shape({
    //manufacturerId: yup.number().required("required!"),
    name: yup.string().required("required!"),
  });

  const handleFormSubmit = async (values) => {
    values.manufacturerId = parseInt(manufacturerId);
    if (props.formType === "edit") {
      values["id"] = props.modelId;
      values["newManufacturerId"] = values.manufacturerId;
      values["newModelName"] = values.name;
      editModel(values);
    } else {
      values["modelName"] = values.name;
      addModel(values);
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
    { field: "name", headerName: "Name", width: 180 },
  ];

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
          {isLoading ? (
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
                  rows={manufacturers.data}
                  columns={columns}
                  components={{ Toolbar: CustomToolBar }}
                  getRowId={(row) => row.id}
                  onSelectionModelChange={(ids) => setManufacturerId(...ids)}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  onClick={handleNext}
                  disabled={manufacturerId === -1}
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
                    label="Manufacturer"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      manufacturers.data.find((el) => {
                        return el.id === manufacturerId;
                      }).name
                    }
                    name="manufacturerId"
                    error={!!touched.manufacturerId && !!errors.manufacturerId}
                    helperText={touched.manufacturerId && errors.manufacturerId}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="change manufacturer"
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
