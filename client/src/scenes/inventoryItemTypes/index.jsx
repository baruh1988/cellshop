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
  useGetInventoryItemTypesQuery,
  useDeleteInventoryItemTypeMutation,
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
    props.setItemTypeId(-1);
    props.handleInitialValues({
      name: "",
    });
    props.handleClickOpen();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add item type
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

// InventoryItemTypes page for rendering
const InventoryItemTypes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [initialValues, setInitialValues] = useState(null);
  const [itemTypeId, setItemTypeId] = useState(-1);

  // fetch data from server
  const {
    data: itemTypes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetInventoryItemTypesQuery();

  const [deleteItemType] = useDeleteInventoryItemTypeMutation();

  // Delete row from table and corresponding data from server
  const handleDeleteClick = (id) => () => {
    const toDelete = itemTypes.data.find((obj) => obj.id === id);
    deleteItemType(toDelete);
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
    setItemTypeId(id);
    const values = itemTypes.data.find((obj) => obj.id === id);
    setInitialValues({ name: values.name });
    handleClickOpen();
  };

  // Data columns definition for data table
  const columns = [
    { field: "id", headerName: "ID", hide: true },
    { field: "name", headerName: "Item Type", width: 180 },
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

  // Render component on screen
  return (
    <Box m="20px">
      <Header title="ITEM TYPES" subtitle="Managing Item Types" />
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
                itemTypeId={itemTypeId}
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
              rows={itemTypes.data}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              componentsProps={{
                toolbar: {
                  handleClickOpen,
                  handleInitialValues,
                  setFormType,
                  setItemTypeId,
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

export default InventoryItemTypes;
