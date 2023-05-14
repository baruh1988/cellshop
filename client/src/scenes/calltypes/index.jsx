import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogContent,
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
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Form from "./Form";

const CustomToolBar = (props) => {
  //const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    props.setFormType("create");
    props.setCallTypeId(-1);
    props.handleInitialValues({
      name: "",
      description: "",
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

const CallTypes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [callTypeId, setCallTypeId] = useState(-1);
  const loggedInUser = useSelector((state) => state.user);

  useEffect(() => {
    getUserTypesData();
  }, [open, rows]);

  const getUserTypesData = async () => {
    const response = await fetch(
      "http://localhost:3789/callType/getAllCallType"
    );
    const responseJson = await response.json();
    if (responseJson.process) {
      const userTypes = responseJson.data;
      setRows(userTypes);
    }
  };

  const handleDeleteClick = (id) => () => {
    const toDelete = rows.find((obj) => obj.id === id);
    setRows(rows.filter((row) => row.id !== id));
    deleteCallType(toDelete);
  };

  const deleteCallType = async (toDelete) => {
    const response = await fetch(
      "http://localhost:3789/callType/deleteCallType",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toDelete),
      }
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInitialValues = (values) => {
    setInitialValues(values);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (id) => () => {
    setFormType("edit");
    setCallTypeId(id);
    const values = rows.find((obj) => obj.id === id);
    setInitialValues({ name: values.name, description: values.description });
    handleClickOpen();
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    { field: "name", headerName: "Name", width: 180 },
    { field: "description", headerName: "Description", width: 180 },
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

  return (
    <Box m="20px">
      <Header title="CALL TYPES" subtitle="Managing Call Types" />
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Form
            formType={formType}
            initialValues={initialValues}
            formCloseControl={setOpen}
            callTypeId={callTypeId}
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
              setCallTypeId,
            },
          }}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default CallTypes;
