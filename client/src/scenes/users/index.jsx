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
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserTypesQuery,
} from "../../api/apiSlice";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "../../components/Header";
import { useState } from "react";
import Form from "./Form";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";

const CustomToolBar = (props) => {
  const handleClick = () => {
    props.setFormType("create");
    props.setUserId(-1);
    props.handleInitialValues({
      idNumber: "",
      userType: 1,
      firstName: "",
      lastName: "",
      password: "",
      address: "",
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

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [userId, setUserId] = useState(-1);
  const loggedInUser = useSelector((state) => state.global.user);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();
  const { data: userTypes, isLoading: isLoadingUserTypes } =
    useGetUserTypesQuery();
  const [deleteUser] = useDeleteUserMutation();

  const getOptions = () => {
    let opts = {};
    userTypes.data.forEach((el) => {
      opts[el.id] = el.description;
    });
    return opts;
  };

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
    setUserId(id);
    const values = users.data.find((obj) => obj.id === id);
    setInitialValues({
      idNumber: values.idNumber,
      userType: values.userType,
      firstName: values.firstName,
      lastName: values.lastName,
      password: "",
      rePassword: "",
      address: values.address,
      email: values.email,
      phoneNumber: values.phoneNumber,
    });
    handleClickOpen();
  };

  const handleDeleteClick = (id) => () => {
    const userToDelete = users.data.find((obj) => obj.id === id);
    deleteUser(userToDelete);
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
      field: "address",
      headerName: "Address",
      flex: 1,
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
      field: "userType",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { userType } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              userType === 1 ? colors.greenAccent[600] : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {userType === 1 && <AdminPanelSettingsOutlinedIcon />}
            {userType === 2 && <SecurityOutlinedIcon />}
            {userType === 3 && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {userType === 1
                ? "Admin"
                : userType === 2
                ? "Manager"
                : "Employee"}
            </Typography>
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
      <Header title="USERS" subtitle="Managing users" />
      {isLoading || isLoadingUserTypes ? (
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
                userId={userId}
                getOptions={getOptions}
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
              rows={users.data.filter(
                (user) =>
                  user.idNumber !== "admin" &&
                  user.idNumber !== loggedInUser.idNumber
              )}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setUserId,
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

export default Users;
