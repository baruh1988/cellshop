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
  Avatar,
  Divider,
  List,
  ListItem,
  Checkbox,
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
  useAddNewDeviceMutation,
  useAddSaleCallDetailMutation,
  useEditCallMutation,
  useEditInventoryItemMutation,
  useEditNewDeviceMutation,
  useGetCallTypesQuery,
  useGetCustomersQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";
import { useSelector } from "react-redux";

const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const Cart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [devicesInCart, setDevicesInCart] = useState([]);
  const [customerId, setCustomerId] = useState();
  const user = useSelector((state) => state.global.user);
  const [checked, setChecked] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addCall] = useAddCallMutation();
  const [editCall] = useEditCallMutation();
  const [editNewDevice] = useEditNewDeviceMutation();
  const [addSaleCallDetail] = useAddSaleCallDetailMutation();
  const [editInventoryItem] = useEditInventoryItemMutation();
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

  const steps = ["Review cart", "Select customer", "Confirm"];

  const isStepOptional = (step) => {
    return props.formType === "cart" ? step === 5 : step === 0;
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

  const handleFormSubmit = (values) => {
    //console.log(values);
    /*
    console.log({
      callTypeId: 1,
      customerId: customerId,
      userId: user.id,
      active: !checked,
      note: values.note,
    });
    props.cart.forEach((el) => {
      console.log(el);
    });
    */
    addCall({
      callTypeId: 1,
      customerId: customerId,
      userId: user.id,
      note: values.note,
    })
      .unwrap()
      .then((result) => {
        console.log(result);
        editCall({
          id: result.data.id,
          newCallTypeId: result.data.callTypeId,
          newCustomerId: result.data.customerId,
          newUserId: result.data.userId,
          newActive: !checked,
          newNote: result.data.note,
        })
          .unwrap()
          .then((result) => {
            console.log(result);
            const devices = props.cart.filter((el) => el.device != null);
            devices.forEach((el) => {
              addSaleCallDetail({
                callId: result.data.id,
                inventoryId: el.item.id,
                newDeviceId: el.device.id,
                quantity: 1,
              })
                .unwrap()
                .then((result) => {
                  console.log(result);
                  editNewDevice({
                    id: el.device.id,
                    newImei: el.device.imei,
                    newInventoryId: result.data.inventoryId,
                    newInStock: false,
                  });
                });
            });
            const other = props.cart.filter((el) => el.device === null);
            //console.log(other);
            const groupedById = other.reduce((group, product) => {
              const { id } = product.item;
              group[id] = group[id] ?? [];
              group[id].push(product);
              return group;
            }, {});
            //console.log(groupedById);
            Object.keys(groupedById).forEach((el) => {
              addSaleCallDetail({
                callId: result.data.id,
                inventoryId: parseInt(el),
                newDeviceId: 0,
                quantity: groupedById[el].length,
              })
                .unwrap()
                .then((result) => {
                  editInventoryItem({
                    id: groupedById[el][0].item.id,
                    newModelId: groupedById[el][0].item.modelId,
                    newInventoryItemTypeId:
                      groupedById[el][0].item.inventoryItemTypeId,
                    newDescription: groupedById[el][0].item.description,
                    newSerialNumber: groupedById[el][0].item.serialNumber,
                    newQunatity:
                      groupedById[el][0].item.quantity - groupedById[el].length,
                    newPrice: groupedById[el][0].item.price,
                    newQunatityThreshold:
                      groupedById[el][0].item.quantityThreshold,
                    newImage: groupedById[el][0].item.image,
                  });
                });
            });
          });
      });
    props.setCart([]);
    props.formCloseControl(false);
  };

  const cartContent = props.cart.map((item, index) => (
    <Box key={index}>
      <Box
        display="flex"
        sx={{ pt: 2, pb: 2 }}
        alignItems="start"
        justifyContent="space-between"
      >
        <Avatar
          src="../../../assets/placeholderImg.png"
          sx={{ width: 95, height: 95, mr: 2 }}
        />
        <Box display="flex" flexDirection="column">
          <Typography variant="h5">
            {
              models.data.find((el) => {
                return el.id === item.item.modelId;
              }).name
            }
          </Typography>
          <Typography variant="subtitle2">{item.item.description}</Typography>
          {item.device && (
            <Typography variant="subtitle2">
              imei: {item.device.imei}
            </Typography>
          )}
        </Box>
        <Typography variant="body1" justifyContent="end">
          {item.item.price}₪
        </Typography>
        <IconButton onClick={props.handleRemoveItem(index)}>
          <DeleteForeverOutlinedIcon />
        </IconButton>
      </Box>
      <Divider variant="insert" />
    </Box>
  ));

  const columns = [
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
    /*
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
  */
  ];

  return (
    <Box m="20px">
      <Header title="CART" subtitle="Sell items" />
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
          {cartContent}
          <Box display="flex" justifyContent="end" mt="20px">
            <Button
              onClick={props.handleResetCart()}
              type="submit"
              color="secondary"
              variant="contained"
            >
              Reset
            </Button>
            <Button
              onClick={handleNext}
              disabled={props.cart.length === 0}
              color="secondary"
              variant="contained"
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </>
      )}
      {activeStep === 1 && (
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                      />
                    }
                    label="Supply now"
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

export default Cart;
