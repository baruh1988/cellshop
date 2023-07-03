import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  useGetUserTypesQuery,
  useDeleteUserTypeMutation,
} from "../../api/apiSlice";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Form from "./Form";

// Toolbar component for data table, for adding and filtering data
const CustomToolBar = (props) => {
  const handleClick = () => {
    props.setFormType("create");
    props.setUserTypeId(-1);
    props.handleInitialValues({
      description: "",
    });
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add user type
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

// UserTypes page for rendering
const UserTypes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [userTypeId, setUserTypeId] = useState(-1);

  // fetch data from server
  const {
    data: userTypes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserTypesQuery();
  const [deleteUserType] = useDeleteUserTypeMutation();

  // Delete row from table and corresponding data from server
  const handleDeleteClick = (id) => () => {
    const toDelete = userTypes.data.find((obj) => obj.id === id);
    deleteUserType(toDelete);
  };

  // Open form window
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Set initial values for form
  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  // Close form window
  const handleClose = () => {
    setOpen(false);
  };

  // Open form in edit mode
  const handleEditClick = (id) => () => {
    setFormType("edit");
    setUserTypeId(id);
    const values = userTypes.data.find((obj) => obj.id === id);
    setInitialValues({ description: values.description });
    handleClickOpen();
  };

  // Data columns definition for data table
  const columns = [
    { field: "id", headerName: "ID", hide: true },
    { field: "description", headerName: "User Type", width: 180 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // Render the userTypes component
  return (
    <Box m="20px">
      <Header title="USER TYPES" subtitle="Managing User Types" />
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
                userTypeId={userTypeId}
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
              rows={userTypes.data}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setUserTypeId,
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

export default UserTypes;
