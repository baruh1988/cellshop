import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import NavButton from "../../components/NavButton";
import { useNavigate } from "react-router-dom";
import {
  useGetCallsQuery,
  useGetCustomersQuery,
  useGetInventoryQuery,
  useGetSaleCallDetailsQuery,
  useGetUsersQuery,
} from "../../api/apiSlice";
import { useState } from "react";
import AddCustomer from "../customers/Form";
import OpenLabCall from "../lab/Form";
import CloseSaleCall from "../sale/Form";

// Dashboard component for rendering
const EmployeeDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dialogBoxContent, setDialogBoxContent] = useState();
  const [content, setContent] = useState();

  // Fetch service/sale calls data from the server
  const {
    data: calls,
    isLoading: isLoadingCalls,
    isSuccess,
    isError,
    error,
  } = useGetCallsQuery();
  const { data: customers, isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const { data: saleCallDetails, isLoading: isLoadingSaleCallDetails } =
    useGetSaleCallDetailsQuery();
  const { data: inventory, isLoading: isLoadingInventory } =
    useGetInventoryQuery();

  // open form
  const handleClickOpen = () => {
    setOpen(true);
  };

  // close form
  const handleClose = () => {
    setOpen(false);
  };

  // render the Dashboard component
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="" />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>{dialogBoxContent}</DialogContent>
      </Dialog>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavButton
            title="Cart"
            subtitle="Sell items"
            icon={
              <IconButton onClick={() => navigate("/inventory")}>
                <ShoppingCartOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              </IconButton>
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavButton
            title="Lab"
            subtitle="Open service call"
            icon={
              <IconButton
                onClick={() => {
                  setDialogBoxContent(
                    <OpenLabCall formCloseControl={setOpen} />
                  );
                  handleClickOpen();
                }}
              >
                <BuildOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              </IconButton>
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavButton
            title="Customer"
            subtitle="Add new customer"
            icon={
              <IconButton
                onClick={() => {
                  setDialogBoxContent(
                    <AddCustomer
                      formType="create"
                      initialValues={{
                        idNumber: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                      }}
                      formCloseControl={setOpen}
                      customerId={-1}
                    />
                  );
                  handleClickOpen();
                }}
              >
                <PersonAddOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              </IconButton>
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavButton
            title="Order"
            subtitle="Order inventory from supplier"
            icon={
              <IconButton
                onClick={() => {
                  setDialogBoxContent(<></>);
                  handleClickOpen();
                }}
              >
                <LocalShippingOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              </IconButton>
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Open Customer Orders
            </Typography>
          </Box>
          {isLoadingCalls ||
          isLoadingCustomers ||
          isLoadingUsers ||
          isLoadingSaleCallDetails ||
          isLoadingInventory ? (
            <CircularProgress />
          ) : (
            calls.data
              .filter((el) => el.callTypeId === 1 && el.active)
              .map((call, i) => (
                <Box
                  key={`${call.id}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {new Date(call.createdAt).toDateString()}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {`${
                        customers.data.find((el) => el.id === call.customerId)
                          .firstName
                      } ${
                        customers.data.find((el) => el.id === call.customerId)
                          .lastName
                      }`}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{call.date}</Box>
                  <Button
                    onClick={() => {
                      setDialogBoxContent(<></>);
                      handleClickOpen();
                    }}
                    color="secondary"
                    variant="contained"
                    p="5px 10px"
                  >
                    Close
                  </Button>
                </Box>
              ))
          )}
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Open Service Calls
            </Typography>
          </Box>
          {isLoadingCalls ||
          isLoadingCustomers ||
          isLoadingUsers ||
          isLoadingSaleCallDetails ||
          isLoadingInventory ? (
            <CircularProgress />
          ) : (
            calls.data
              .filter((el) => el.callTypeId === 2 && el.active)
              .map((call, i) => (
                <Box
                  key={`${call.id}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {new Date(call.createdAt).toDateString()}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {`${
                        customers.data.find((el) => el.id === call.customerId)
                          .firstName
                      } ${
                        customers.data.find((el) => el.id === call.customerId)
                          .lastName
                      }`}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{call.date}</Box>
                  <Button
                    onClick={() => {
                      setDialogBoxContent("");
                      handleClickOpen();
                    }}
                    color="secondary"
                    variant="contained"
                    p="5px 10px"
                  >
                    Close
                  </Button>
                </Box>
              ))
          )}
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Open Supplier Orders
            </Typography>
          </Box>
          {isLoadingCalls ||
          isLoadingCustomers ||
          isLoadingUsers ||
          isLoadingSaleCallDetails ||
          isLoadingInventory ? (
            <CircularProgress />
          ) : (
            calls.data
              .filter((el) => el.callTypeId === 1 && el.active)
              .map((call, i) => (
                <Box
                  key={`${call.id}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {new Date(call.createdAt).toDateString()}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {`${
                        customers.data.find((el) => el.id === call.customerId)
                          .firstName
                      } ${
                        customers.data.find((el) => el.id === call.customerId)
                          .lastName
                      }`}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{call.date}</Box>
                  <Button
                    onClick={() => {
                      setDialogBoxContent("");
                      handleClickOpen();
                    }}
                    color="secondary"
                    variant="contained"
                    p="5px 10px"
                  >
                    Close
                  </Button>
                </Box>
              ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
