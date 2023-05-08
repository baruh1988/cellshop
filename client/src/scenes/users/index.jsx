import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import UserForm from "../userform";
import { useSelector } from "react-redux";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("addUser");
  const [initialValues, setInitialValues] = useState(null);
  const loggedInUser = useSelector((state) => state.user);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUsersData();
  }, [open, rows]);

  const getUsersData = async () => {
    const response = await fetch("http://localhost:3789/users/getAllUsers");
    const responseJson = await response.json();

    //console.log(responseJson);
    if (responseJson.process) {
      const users = responseJson.data.filter(
        (user) =>
          user.idNumber !== "admin" && user.idNumber !== loggedInUser.idNumber
      );
      setRows(users);
    }
  };

  const handleEditClick = (id) => () => {
    setFormType("editUser");
    const values = rows.find((obj) => obj.idNumber === id);
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
    const userToDelete = rows.find((obj) => obj.idNumber === id);
    //console.log(userToDelete);
    setRows(rows.filter((row) => row.idNumber !== id));
    deleteUser(userToDelete);
  };

  const deleteUser = async (userToDelete) => {
    const response = await fetch("http://localhost:3789/users/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToDelete),
    });
  };

  const columns = [
    //{ field: "id", headerName: "ID" },
    {
      field: "idNumber",
      headerName: "ID Number",
      flex: 1,
      cellClassName: "idNumber-column--cell",
      editable: true,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "firstName-column--cell",
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "lastName-column--cell",
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      editable: true,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      editable: true,
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
              userType === 0 ? colors.greenAccent[600] : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {userType === 0 && <AdminPanelSettingsOutlinedIcon />}
            {userType === 1 && <SecurityOutlinedIcon />}
            {userType === 2 && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {userType === 0
                ? "Admin"
                : userType === 1
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
      <Button
        onClick={() => {
          setFormType("addUser");
          handleInitialValues({
            idNumber: "",
            userType: 0,
            firstName: "",
            lastName: "",
            password: "",
            address: "",
            email: "",
            phoneNumber: "",
          });
          handleClickOpen();
        }}
        color="secondary"
        variant="contained"
      >
        Add new user
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <UserForm
            formType={formType}
            initialValues={initialValues}
            formCloseControl={setOpen}
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
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.idNumber}
        />
      </Box>
    </Box>
  );
};

export default Users;
