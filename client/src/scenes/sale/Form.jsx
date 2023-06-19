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
  Avatar,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Formik } from "formik";
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
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  useEditCallMutation,
  useGetCallTypesQuery,
  useGetCustomersQuery,
  useGetModelsQuery,
  useGetSaleCallDetailsQuery,
  useGetInventoryQuery,
  useGetCallByIdMutation,
  useGetCustomerByIdMutation,
  useGetInventoryItemByIdMutation,
  useGetModelByIdMutation,
  useGetFixDeviceByIdMutation,
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
  const user = useSelector((state) => state.global.user);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [getCallById] = useGetCallByIdMutation();
  const [getCustomerById] = useGetCustomerByIdMutation();
  const [getInventoryItemById] = useGetInventoryItemByIdMutation();
  const [getFixDeviceById] = useGetFixDeviceByIdMutation();
  const [getModelById] = useGetModelByIdMutation();

  const [editCall] = useEditCallMutation();
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
  const { data: callDetails, isLoading: isLoadingCallDetails } =
    useGetSaleCallDetailsQuery();
  const { data: inventory, isLoading: isLoadingInventory } =
    useGetInventoryQuery();

  /*
  const handleFormSubmit = (values) => {
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
  */

  const callContent = (
    <Box gridColumn="span 1" gridRow="span 2" overflow="auto">
      {callDetails.data
        .filter((el) => el.callId === props.call.id)
        .map((item, index) => (
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
                <Typography variant="subtitle2">
                  {item.item.description}
                </Typography>
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
        ))}
    </Box>
  );

  return (
    <Box m="20px">
      <Header
        title=""
        subtitle={`Total: ${props.cart.reduce(
          (sum, el) => sum + el.item.price,
          0
        )}₪`}
      />
      <Box
        display="grid"
        gridTemplateColumns="repeat(1, 1fr)"
        gridAutoRows="120px"
      >
        {callContent}
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          //onClick={props.handleResetCart()}
          type="submit"
          color="secondary"
          variant="contained"
        >
          Confirm close
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
