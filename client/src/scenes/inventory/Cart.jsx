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
  useAddCallMutation,
  useAddNewDeviceMutation,
  useAddSaleCallDetailMutation,
  useGetCallTypesQuery,
  useGetCustomersQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";

const Cart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [cart, setCart] = useState(props.cart);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [addCall] = useAddCallMutation();
  const [addNewDevice] = useAddNewDeviceMutation();
  const [addSaleCallDetail] = useAddSaleCallDetailMutation();
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

  const steps = ["Select items", "Select customer", "Confirm"];

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
      {activeStep === 0 && <></>}
      {activeStep === 1 && <></>}
    </Box>
  );
};

export default Cart;
