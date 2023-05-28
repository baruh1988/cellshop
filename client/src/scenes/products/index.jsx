import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { useGetInventoryQuery } from "../../api/apiSlice";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Product = ({
  id,
  modelId,
  inventoryItemTypeId,
  description,
  serialNumber,
  price,
  quantity,
  quantityThreshold,
  image,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const placeholderImg = "../../assets/placeholderImg.png";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: colors.primary[400],
        borderRadius: "0.55rem",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={placeholderImg}
        alt="image"
      />
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={colors.greenAccent[400]}
          gutterBottom
        >
          {inventoryItemTypeId}
        </Typography>
        <Typography variant="h4" component="div">
          {modelId}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          {Number(price).toFixed(2)}₪
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography variant="body2">{description}</Typography>
          <Typography>Supply Left: {quantity}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    data: inventory,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetInventoryQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            mt="20px"
            display="grid"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            justifyContent="space-between"
            rowGap="20px"
            columnGap="1.33%"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {inventory.data.map(
              ({
                id,
                modelId,
                inventoryItemTypeId,
                description,
                serialNumber,
                price,
                quantity,
                quantityThreshold,
                image,
              }) => (
                <Product
                  key={id}
                  id={id}
                  modelId={modelId}
                  inventoryItemTypeId={inventoryItemTypeId}
                  description={description}
                  serialNumber={serialNumber}
                  price={price}
                  quantity={quantity}
                  quantityThreshold={quantityThreshold}
                  image={image}
                />
              )
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Products;
