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
import Header from "../../components/Header";
import { useState } from "react";
import Form from "./Form";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteInventoryItemMutation,
  useGetInventoryItemTypesQuery,
  useGetInventoryQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";
import Cart from "./Cart";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 5,
    top: -10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const CustomToolBar = (props) => {
  const handleClick = () => {
    props.setFormType("create");
    props.setInventoryId(-1);
    props.handleInitialValues({
      //modelId: Math.min(...Object.keys(props.models)),
      modelId: 0,
      description: "",
      serialNumber: "",
      quantity: 0,
      price: 0.0,
      quantityThreshold: 0,
      image: "",
      inventoryItemTypeId: 1,
    });
    props.handleClickOpen();
  };

  const handleCartClick = () => {
    props.setFormType("cart");
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add inventory item
      </Button>
      <Button
        color="primary"
        startIcon={<ShoppingCartOutlinedIcon />}
        onClick={handleCartClick}
      >
        <StyledBadge
          badgeContent={props.cart.length}
          color="secondary"
        ></StyledBadge>
        Go to cart
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Inventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [inventoryId, setInventoryId] = useState(-1);
  const [cart, setCart] = useState([]);

  const { data: models, isLoading: isLoadingModels } = useGetModelsQuery();
  const {
    data: inventory,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetInventoryQuery();
  const { data: itemTypes, isLoading: isLoadingItemTypes } =
    useGetInventoryItemTypesQuery();
  const [deleteInventoryItem] = useDeleteInventoryItemMutation();

  const getOptions = () => {
    let opts = {};
    itemTypes.data.forEach((el) => {
      opts[el.id] = el.name;
    });
    return opts;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  const handleDeleteClick = (id) => () => {
    const toDelete = inventory.data.find((obj) => obj.id === id);
    deleteInventoryItem(toDelete);
  };

  const handleAddCartClick = (id) => () => {
    let newCart = [...cart];
    const toAdd = inventory.data.find((obj) => obj.id === id);
    newCart.push(toAdd);
    setCart(newCart);
  };

  const handleEditClick = (id) => () => {
    setFormType("edit");
    setInventoryId(id);
    const values = inventory.data.find((obj) => obj.id === id);
    setInitialValues({
      modelId: values.modelId,
      description: values.description,
      serialNumber: values.serialNumber,
      quantity: values.quantity,
      price: values.price,
      quantityThreshold: values.quantityThreshold,
      image: values.image,
      inventoryItemTypeId: values.inventoryItemTypeId,
    });
    handleClickOpen();
  };

  const handleClose = () => {
    setOpen(false);
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
    {
      field: "inventoryItemTypeId",
      headerName: "Item Type",
      flex: 1,
      valueGetter: ({ row }) => {
        return itemTypes.data.find((el) => {
          return el.id === row.inventoryItemTypeId;
        }).name;
      },
    },
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
    /*
    {
      field: "image",
      headerName: "Image",
      flex: 1,
    },
    */
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
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
      <Header title="INVENTORY" subtitle="Managing Inventory" />
      {isLoading || isLoadingModels || isLoadingItemTypes ? (
        <CircularProgress />
      ) : (
        <>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              {formType === "cart" ? (
                <Cart
                  formType={formType}
                  cart={cart}
                  formCloseControl={setOpen}
                />
              ) : (
                <Form
                  formType={formType}
                  initialValues={initialValues}
                  formCloseControl={setOpen}
                  getOptions={getOptions}
                  inventoryId={inventoryId}
                />
              )}
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
              rows={inventory.data}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setInventoryId,
                  cart,
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

export default Inventory;
