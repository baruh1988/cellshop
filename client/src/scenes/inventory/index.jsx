import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "../../components/Header";
import { useCallback, useEffect, useState } from "react";
import Form from "./Form";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";

const CustomToolBar = (props) => {
  //const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    props.setFormType("add");
    props.setInventoryId(-1);
    props.handleInitialValues({
      //manufacturerId: Math.min(...Object.keys(props.manufacturers)),
      modelId: 0,
      description: "",
      serialNumber: "",
      quantity: 0,
      price: 0.0,
      quantityThreshold: 0,
      image: "",
    });
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
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
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [initialValues, setInitialValues] = useState(null);
  const [inventoryId, setInventoryId] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const loggedInUser = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoading(true);
    //getModelsData();
    //getManufacturerData();
    setIsLoading(false);
  }, [open]);

  const getInventoryData = async () => {
    const response = await fetch(
      "http://localhost:3789/inventory/getAllInventoryItems"
    );
    const responseJson = await response.json();
    if (responseJson.process) {
      const inventoryData = responseJson.data;
      setRows(inventoryData);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  const handleDeleteClick = (id) => () => {
    const toDelete = rows.find((obj) => obj.id === id);
    setRows(rows.filter((row) => row.id !== id));
    deleteInventoryItem(toDelete);
  };

  const deleteInventoryItem = async (toDelete) => {
    //toDelete["manufacturerName"] = manufacturers[toDelete.manufacturerId];
    //toDelete["modelName"] = toDelete.name;
    console.log(toDelete);
    /*
    const response = await fetch("http://localhost:3789/model/deleteModel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toDelete),
    });
    */
  };

  const handleEditClick = (id) => () => {
    setFormType("edit");
    //setModelId(id);
    const values = rows.find((obj) => obj.id === id);
    setInitialValues({
      modelId: 0,
      description: "",
      serialNumber: "",
      quantity: 0,
      price: 0,
      quantityThreshold: 0,
      image: "",
    });
    handleClickOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "modelId",
      headerName: "Model",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "serialNumber",
      headerName: "Serial Number",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "quantityThreshold",
      headerName: "Quantity Threshold",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
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
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <Form
                formType={formType}
                initialValues={initialValues}
                formCloseControl={setOpen}
                options={{}}
                modelId={{}}
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
              rows={rows}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setInventoryId,
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
