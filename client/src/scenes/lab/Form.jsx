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
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Paper,
  FormControlLabel,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  useAddCallMutation,
  useAddFixCallDetailMutation,
  useAddSaleCallDetailMutation,
  useEditCallMutation,
  useEditFixDeviceMutation,
  useEditInventoryItemMutation,
  useEditNewDeviceMutation,
  useGetCallTypesQuery,
  useGetCustomersQuery,
  useGetFaultTypesQuery,
  useGetFixDevicesQuery,
  useGetInventoryQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";
import { useSelector } from "react-redux";

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

// Filter unique items from 2 arrays. return the result array
const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
};

// Filter intersection between two arrays. return the result array
const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

// Service call form component for rendering
const Form = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [customerId, setCustomerId] = useState();
  const [deviceId, setDeviceId] = useState();
  const user = useSelector((state) => state.global.user);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addCall] = useAddCallMutation();
  const [editFixDevice] = useEditFixDeviceMutation();
  const [addFixCallDetail] = useAddFixCallDetailMutation();

  // fetch data from the server
  const {
    data: customers,
    isLoading: isLoadingCustomers,
    isSuccess,
    isError,
    error,
  } = useGetCustomersQuery();
  const { data: callType, isLoading: isLoadingCallTypes } =
    useGetCallTypesQuery();
  const { data: models, isLoading: isLoadingModels } = useGetModelsQuery();
  const { data: fixDevices, isLoading: isLoadingFixDevices } =
    useGetFixDevicesQuery();
  const { data: inventory, isLoading: isLoadingInventory } =
    useGetInventoryQuery();
  const {
    data: faultTypes,
    isLoading: isLoadingFaultTypes,
    isSuccess: isSuccessFaultTypes,
  } = useGetFaultTypesQuery();

  // Display faultTypes on component load and every time there is a change to faultTypes array
  useEffect(() => {
    if (isSuccessFaultTypes) {
      setLeft(faultTypes.data);
    }
  }, [isSuccessFaultTypes]);

  // Move faultTypes between available and selected
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  // List component to show and select faultTypes when opening a service call
  const customList = (items) => (
    <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value.id}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.description}`} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  // Define steps for opening a service call
  const steps = ["Select customer", "Select device", "Select fault types"];

  // check if step is optional
  const isStepOptional = (step) => {
    return step === 5;
  };

  // check if step was skipped
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  // move to next step
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // move to previous step
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

  // Create new service call in the database with the values entered in the from
  const handleFormSubmit = (values) => {
    addCall({
      callTypeId: 2,
      customerId: customerId,
      userId: user.id,
      note: values.note,
    })
      .unwrap()
      .then((result) => {
        const device = fixDevices.data.find((el) => el.id === deviceId);
        editFixDevice({
          id: deviceId,
          newImei: device.imei,
          newInventoryId: device.inventoryId,
          newInStock: true,
        });
        right.forEach((el) => {
          addFixCallDetail({
            callId: result.data.id,
            fixDeviceId: deviceId,
            faultTypeId: el.id,
            fixed: false,
            fixTypeId: 0,
            note: "",
          });
        });
      });
    props.formCloseControl(false);
  };

  // Data columns definition for data table
  const columns =
    activeStep === 0
      ? [
          { field: "id", headerName: "ID", hide: true },
          {
            field: "idNumber",
            headerName: "ID Number",
            flex: 1,
            cellClassName: "idNumber-column--cell",
          },
          {
            field: "firstName",
            headerName: "First Name",
            flex: 1,
            cellClassName: "firstName-column--cell",
          },
          {
            field: "lastName",
            headerName: "Last Name",
            flex: 1,
            cellClassName: "lastName-column--cell",
          },
          {
            field: "email",
            headerName: "Email",
            flex: 1,
          },
        ]
      : [
          { field: "id", headerName: "ID", hide: true },
          {
            field: "imei",
            headerName: "IMEI",
            flex: 1,
          },
          {
            field: "inventoryId",
            headerName: "Model",
            flex: 1,
            valueGetter: ({ row }) => {
              return models.data.find((el) => {
                const tmp = inventory.data.find((el) => {
                  return el.id === row.inventoryId;
                });
                return el.id === tmp.modelId;
              }).name;
            },
          },
        ];

  return (
    <Box m="20px">
      <Header title="Lab service call" subtitle="Enter device to fix" />
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
      {activeStep === 0 && (
        <>
          {isLoadingCustomers ? (
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
                  rows={customers.data}
                  columns={columns}
                  components={{ Toolbar: CustomToolBar }}
                  getRowId={(row) => row.id}
                  onSelectionModelChange={(ids) => setDeviceId(...ids)}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  onClick={handleNext}
                  disabled={deviceId ? false : true}
                  color="secondary"
                  variant="contained"
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </>
      )}
      {activeStep === 1 && (
        <>
          {isLoadingFixDevices || isLoadingInventory || isLoadingModels ? (
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
                  rows={fixDevices.data.filter((el) => !el.inStock)}
                  columns={columns}
                  components={{ Toolbar: CustomToolBar }}
                  getRowId={(row) => row.id}
                  onSelectionModelChange={(ids) => setCustomerId(...ids)}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  onClick={handleNext}
                  disabled={customerId ? false : true}
                  color="secondary"
                  variant="contained"
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </>
      )}
      {activeStep === 2 && (
        <>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={{ customerId: customerId, note: "" }}
            //validationSchema={checkoutSchema}
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
                    label="Customer"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      customers.data.find((el) => {
                        return el.id === customerId;
                      }).idNumber
                    }
                    name="customerId"
                    error={!!touched.customerId && !!errors.customerId}
                    helperText={touched.customerId && errors.customerId}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="change customer"
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
                  <Box sx={{ gridColumn: "span 4" }}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item>{customList(left)}</Grid>
                      <Grid item>
                        <Grid container direction="column" alignItems="center">
                          <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                          >
                            ≫
                          </Button>
                          <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                          >
                            &gt;
                          </Button>
                          <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                          >
                            &lt;
                          </Button>
                          <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                          >
                            ≪
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item>{customList(right)}</Grid>
                    </Grid>
                  </Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    multiline
                    rows={5}
                    label="Note"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.note}
                    name="note"
                    error={!!touched.note && !!errors.note}
                    helperText={touched.note && errors.note}
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Confirm
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
