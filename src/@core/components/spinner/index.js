// ** MUI Import
import { Box, CircularProgress } from "@mui/material";

const FallbackSpinner = ({ sx }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        ...sx,
      }}
    >
      <img src="/images/logo.png" style={{ width: 150, objectFit: "cover" }} />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  );
};

export default FallbackSpinner;
