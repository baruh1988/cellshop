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
    props.setFormType("create");
    props.setModelId(-1);
    props.handleInitialValues({
      manufacturerId: Math.min(...Object.keys(props.manufacturers)),
      name: "",
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

const Models = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [modelId, setModelId] = useState(-1);
  const [manufacturers, setManufacturers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const loggedInUser = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoading(true);
    getModelsData();
    getManufacturerData();
    setIsLoading(false);
  }, [open]);

  const getModelsData = async () => {
    const response = await fetch("http://localhost:3789/model/getAllModels");
    const responseJson = await response.json();
    if (responseJson.process) {
      const modelsData = responseJson.data;
      setRows(modelsData);
    }
  };

  const getManufacturerData = async () => {
    const response = await fetch(
      "http://localhost:3789/manufacturer/getAllManufacturers"
    );
    const responseJson = await response.json();
    if (responseJson.process) {
      const manufacturersData = responseJson.data;
      let opts = {};
      manufacturersData.forEach((el) => {
        opts[el.id] = el.name;
      });
      setManufacturers(opts);
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
    deleteModel(toDelete);
  };

  const deleteModel = async (toDelete) => {
    console.log(toDelete);
    const response = await fetch("http://localhost:3789/model/deleteModel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toDelete),
    });
  };

  const handleEditClick = (id) => () => {
    setFormType("edit");
    setModelId(id);
    const values = rows.find((obj) => obj.id === id);
    setInitialValues({
      manufacturerId: values.manufacturerId,
      name: values.name,
    });
    handleClickOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      <Header title="MODELS" subtitle="Managing Models" />
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
                options={manufacturers}
                modelId={modelId}
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
                  setModelId,
                  manufacturers,
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

export default Models;
