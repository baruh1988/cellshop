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
import {
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from "../../api/apiSlice";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "../../components/Header";
import { useState } from "react";
import Form from "./Form";
import AddIcon from "@mui/icons-material/Add";

const CustomToolBar = (props) => {
  const handleClick = () => {
    props.setFormType("create");
    props.setSupplierId(-1);
    props.handleInitialValues({
      idNumber: "",
      name: "",
      email: "",
      phoneNumber: "",
    });
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add user
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Suppliers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [supplierId, setSupplierId] = useState(-1);

  const {
    data: suppliers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSuppliersQuery();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (id) => () => {
    setFormType("edit");
    setSupplierId(id);
    const values = suppliers.data.find((obj) => obj.id === id);
    setInitialValues({
      idNumber: values.idNumber,
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
    });
    handleClickOpen();
  };

  const handleDeleteClick = (id) => () => {
    const supplierToDelete = suppliers.data.find((obj) => obj.id === id);
    deleteSupplier(supplierToDelete);
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "idNumber",
      headerName: "ID Number",
      flex: 1,
      cellClassName: "idNumber-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
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
      <Header title="SUPPLIERS" subtitle="Managing Suppliers" />
      {isLoading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <Form
                formType={formType}
                initialValues={initialValues}
                formCloseControl={setOpen}
                supplierId={supplierId}
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
              rows={suppliers.data}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setSupplierId,
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

export default Suppliers;
