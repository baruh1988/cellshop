import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
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
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "../../components/Header";
import { useState } from "react";
import Form from "./Form";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteModelMutation,
  useGetManufacturersQuery,
  useGetModelsQuery,
} from "../../api/apiSlice";

// Toolbar component for data table, for adding and filtering data
const CustomToolBar = (props) => {
  const handleClick = () => {
    props.setFormType("create");
    props.setModelId(-1);
    props.handleInitialValues({
      manufacturerId: -1,
      name: "",
    });
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add model
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

// Models page for rendering
const Models = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [modelId, setModelId] = useState(-1);

  // fetch data from server
  const { data: manufacturers, isLoading: isLoadingManufacturers } =
    useGetManufacturersQuery();
  const {
    data: models,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetModelsQuery();
  const [deleteModel] = useDeleteModelMutation();

  // Open form window
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Set initial values for form
  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  // Delete row from table and corresponding data from server
  const handleDeleteClick = (id) => () => {
    const toDelete = models.data.find((obj) => obj.id === id);
    deleteModel(toDelete);
  };

  // Open form in edit mode
  const handleEditClick = (id) => () => {
    setFormType("edit");
    setModelId(id);
    const values = models.data.find((obj) => obj.id === id);
    setInitialValues({
      manufacturerId: values.manufacturerId,
      name: values.name,
    });
    handleClickOpen();
  };

  // Close form window
  const handleClose = () => {
    setOpen(false);
  };

  // Data columns definition for data table
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
      valueGetter: ({ row }) => {
        return manufacturers.data.find((el) => {
          return el.id === row.manufacturerId;
        }).name;
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

  // Render the devicess component
  return (
    <Box m="20px">
      <Header title="MODELS" subtitle="Managing Models" />
      {isLoading || isLoadingManufacturers ? (
        <CircularProgress />
      ) : (
        <>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <Form
                formType={formType}
                initialValues={initialValues}
                formCloseControl={setOpen}
                modelId={modelId}
              />
            </DialogContent>
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
              rows={models.data}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setModelId,
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
