import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const SelectWrapper = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: "filled",
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {Object.keys(options).map((item, pos) => {
        return (
          <MenuItem key={pos} value={item}>
            {options[item]}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

const Form = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [modelId, setModelId] = useState(props.initialValues.modelId);
  const [rowSelectionModel, setRowSelectionModel] = useState([
    props.initialValues.modelId,
  ]);

  useEffect(() => {
    //setIsLoading(true);
    getModelsData();
    //getManufacturerData();
    //setIsLoading(false);
  }, []);

  const getModelsData = async () => {
    const response = await fetch("http://localhost:3789/model/getAllModels");
    const responseJson = await response.json();
    if (responseJson.process) {
      const modelsData = responseJson.data;
      setRows(modelsData);
    }
  };

  const checkoutSchema = yup.object().shape({
    modelId: yup.number().required("required!"),
    description: yup.string().required("required!"),
    serialNumber: yup.string().required("required!"),
    quantity: yup.number().min(0).required("required!"),
    price: yup.number().min(0).required("required!"),
    quantityThreshold: yup.number().min(0).required("required!"),
    //image: yup.string().required("required!"),
  });

  const handleFormSubmit = async (values) => {
    // test create inventory item
    values["modelId"] = modelId;
    console.log(values);
    /*
    if (props.formType === "edit") {
      values["manufacturerName"] = props.options[values.manufacturerId];
      values["modelName"] = props.initialValues.name;
      values["modelNewName"] = values.name;
    } else {
      values["manufacturerName"] = props.options[values.manufacturerId];
      values["modelName"] = values.name;
    }
    console.log(values);
    const url = `http://localhost:3789/model/${props.formType}Model`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    */
    props.formCloseControl(false);
  };

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
    },
  ];

  return (
    <Box m="20px">
      <Header
        title={
          props.formType === "create"
            ? "CREATE INVENTORY ITEM"
            : "EDIT INVENTORY ITEM"
        }
        subtitle={
          props.formType === "create"
            ? "Create a New Item"
            : "Edit an Existing Item"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={props.initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Serial Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serialNumber}
                name="serialNumber"
                error={!!touched.serialNumber && !!errors.serialNumber}
                helperText={touched.serialNumber && errors.serialNumber}
                sx={{ gridColumn: "span 4" }}
              />
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
                  gridColumn: "span 4",
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  components={{ Toolbar: CustomToolBar }}
                  //componentsProps={{toolbar: {handleClickOpen,handleInitialValues,setFormType,setInventoryId,models}}}
                  getRowId={(row) => row.id}
                  //selectionModel={[rowSelectionModel]}
                  onSelectionModelChange={(ids) => setModelId(...ids)}
                />
              </Box>
              {/*
              <SelectWrapper
                name="modelId"
                label="Model"
                options={props.options}
                sx={{ gridColumn: "span 1" }}
              />*/}
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={10}
                //maxRows={10}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                inputProps={{
                  step: 0.01,
                  min: 0.0,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₪</InputAdornment>
                  ),
                }}
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                inputProps={{
                  min: 0,
                }}
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                inputProps={{
                  min: 0,
                }}
                label="Quantity Threshold"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantityThreshold}
                name="quantityThreshold"
                error={
                  !!touched.quantityThreshold && !!errors.quantityThreshold
                }
                helperText={
                  touched.quantityThreshold && errors.quantityThreshold
                }
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Image"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.image}
                name="image"
                error={!!touched.image && !!errors.image}
                helperText={touched.image && errors.image}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {props.formType === "create" ? "Add" : "Save"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
