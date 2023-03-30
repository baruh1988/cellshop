import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Header from "../../components/Header";

const Users = () => {
  const theme = useTheme();
  const [data, setDate] = useState([
    {
      id: 0,
      idNumber: "123456789",
      firstName: "boris",
      lastName: "gershkovich",
      address: "some street some city",
      email: "mail@gmail.com",
      phoneNumber: "0502429584",
      userType: 0,
    },
  ]);

  useEffect(() => {
    console.log(data);
  }, []);

  const columns = [
    { field: "idNumber", headerName: "ID" },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "first-name-column-cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "last-name-column-cell",
    },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "userType",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { userType } }) => {
        return (
          <Box
            width="60%"
            m="1.5rem 2.5rem"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor="green"
            borderRadius="4px"
          >
            {userType === 0 && <AdminPanelSettingsOutlinedIcon />}
            {userType === 1 && <SupervisorAccountOutlinedIcon />}
            {userType === 2 && <PersonOutlineOutlinedIcon />}
            <Typography sx={{ ml: "5px" }}>{userType}</Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Users" subtitle="List of users" />
      <Box mt="40px" height="75vh">
        <DataGrid
          getRowId={(row) => row.id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Users;
