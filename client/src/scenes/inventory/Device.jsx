import { Box, Button, useTheme, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { tokens } from "../../theme";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  useGetInventoryQuery,
  useGetManufacturersQuery,
  useGetModelsQuery,
  useGetNewDevicesQuery,
} from "../../api/apiSlice";

const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const Device = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [deviceId, setDeviceId] = useState();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { data: manufacturers, isLoading: isLoadingManufacturers } =
    useGetManufacturersQuery();
  const {
    data: models,
    isLoading: isLoadingModels,
    isSuccess,
    isError,
    error,
  } = useGetModelsQuery();
  const { data: devices, isLoading: isLoadingDevices } =
    useGetNewDevicesQuery();
  const { data: inventory, isLoading } = useGetInventoryQuery();

  const handlePickDevice = () => {
    let tmp = [...props.cart];
    const toAdd = inventory.data.find((obj) => obj.id === deviceId);
    const device = devices.data.find((el) => el.inventoryId === deviceId);
    //console.log(device);
    tmp.push({ item: toAdd, device: device });
    props.setCart(tmp);
    props.setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "imei",
      headerName: "IMEI",
      flex: 1,
    },
    {
      field: "inventoryId",
      headerName: "Model",
      flex: 1,
      valueGetter: ({ row }) => {
        return models.data.find((el) => {
          const tmp = inventory.data.find((el) => {
            return el.id === row.inventoryId;
          });
          return el.id === tmp.modelId;
        }).name;
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="PICK DEVICE" subtitle="" />
      {isLoading ||
      isLoadingManufacturers ||
      isLoadingModels ||
      isLoadingDevices ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            //m="40px 0 0 0"
            height="25vh"
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
              //gridColumn: "span 4",
            }}
          >
            <DataGrid
              rows={devices.data
                .filter((el) => el.inStock)
                .filter((el) => el.inventoryId === props.inventoryId)
                .filter(
                  (el) =>
                    props.cart
                      .filter((obj) => obj.device != null)
                      .map((obj) => obj.device.id)
                      .indexOf(el.inventoryId) === -1
                )}
              columns={columns}
              components={{ Toolbar: CustomToolBar }}
              getRowId={(row) => row.id}
              onSelectionModelChange={(ids) => setDeviceId(...ids)}
            />
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button
              onClick={handlePickDevice}
              disabled={deviceId ? false : true}
              color="secondary"
              variant="contained"
            >
              Select
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Device;
