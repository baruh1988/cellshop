import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import Header from "../../components/Header";
import { useState } from "react";
import Form from "./Form";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteNewDeviceMutation,
  useEditNewDeviceMutation,
  useGetInventoryItemTypesQuery,
  useGetInventoryQuery,
  useGetModelsQuery,
  useGetNewDevicesQuery,
} from "../../api/apiSlice";

const CustomToolBar = (props) => {
  const handleClick = () => {
    props.setFormType("create");
    props.setDeviceId(-1);
    props.handleInitialValues({
      imei: 0,
      inventoryId: 0,
      inStock: true,
    });
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add device
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Devices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [deviceId, setDeviceId] = useState(-1);
  //const [cart, setCart] = useState([]);

  const { data: models, isLoading: isLoadingModels } = useGetModelsQuery();
  const { data: inventory, isLoading } = useGetInventoryQuery();
  const { data: itemTypes, isLoading: isLoadingItemTypes } =
    useGetInventoryItemTypesQuery();
  const { data: devices, isLoading: isLoadingDevices } =
    useGetNewDevicesQuery();
  const [deleteDevice] = useDeleteNewDeviceMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  const handleDeleteClick = (id) => () => {
    const toDelete = devices.data.find((obj) => obj.id === id);
    deleteDevice(toDelete);
  };

  /*
  const handleAddCartClick = (id) => () => {
    let newCart = [...cart];
    const toAdd = inventory.data.find((obj) => obj.id === id);
    newCart.push(toAdd);
    setCart(newCart);
  };
  */
  const handleEditClick = (id) => () => {
    setFormType("edit");
    setDeviceId(id);
    const values = devices.data.find((obj) => obj.id === id);
    setInitialValues({
      imei: values.imei,
      inventoryId: values.inventoryId,
      inStock: values.inStock,
    });
    handleClickOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
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
    /*
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
    */
    /*
    {
      field: "image",
      headerName: "Image",
      flex: 1,
    },
    */
    {
      field: "inStock",
      headerName: "In stock",
      flex: 1,
      renderCell: ({ row: { inStock } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              inStock ? colors.greenAccent[600] : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            {inStock && <ThumbUpOutlinedIcon />}
            {!inStock && <ThumbDownOutlinedIcon />}
          </Box>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          /*
          inventory.data.find((obj) => obj.id === id).quantity &&
          cart.filter((obj) => obj.id === id).length <
            inventory.data.find((obj) => obj.id === id).quantity ? (
            <GridActionsCellItem
              icon={<AddShoppingCartOutlinedIcon />}
              label="AddCart"
              className="textPrimary"
              onClick={handleAddCartClick(id)}
              color="inherit"
            />
          ) : (
            <></>
          ),
          */
          <GridActionsCellItem
            icon={<EditOutlinedIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteForeverOutlinedIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="DEVICES" subtitle="Managing Devices" />
      {isLoading ||
      isLoadingModels ||
      isLoadingItemTypes ||
      isLoadingDevices ? (
        <CircularProgress />
      ) : (
        <>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <Form
                formType={formType}
                initialValues={initialValues}
                formCloseControl={setOpen}
                deviceId={deviceId}
              />
            </DialogContent>
            {/*
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
        */}
          </Dialog>
          <Box
            m="40px 0 0 0"
            height="75vh"
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
            }}
          >
            <DataGrid
              rows={devices.data}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setDeviceId,
                  //cart,
                },
              }}
              getRowId={(row) => row.id}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Devices;
