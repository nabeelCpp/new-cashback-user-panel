//----------
//  React Imports
//----------
import { useState } from "react";

//----------
//  MUI imports
//----------
import {
  Box,
  Grid,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,Button
} from "@mui/material";

//----------
//  Other Libraries Import
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

//----------
//  Local Imports
//----------
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";

const ChangePassword = () => {
  //----------
  //   States
  //----------
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [open, setOpen] = useState(false);

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Functions
  //----------
  const submitPasswordHandler = () => {
    let errors = false;
    if (!oldPassword) {
      toast.error("Old password is required");
      errors = true;
    }
    if (!newPassword) {
      toast.error("New password is required");
      errors = true;
    }
    if (!confirmPassword) {
      toast.error("Confirm password is required");
      errors = true;
    }
    if (!errors) {
      setOpen(true);

      let passwords = {
        current_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/profile/update-password`,
          passwords,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((resp) => {
          setOpen(false);
          let data = resp.data;
          if (data.success) {
            toast.success(data.message);
            auth.logout();
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          setOpen(false);
          if (error.response && error.response.data) {
            if (error.response.data && error.response.data.message) {
              toast.error(
                `${error.response ? error.response.status : ""}: ${
                  error.response ? error.response.data.message : error
                }`
              );
            }
            if (error.response.data && error.response.data.errors) {
              error.response.data.errors.map((err) => toast.error(err.msg));
            }
          }
          if (error.response && error.response.status == 401) {
            auth.logout();
          }
        });
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          sx={{
            py: 3,
            px: 4,
            borderRadius: 1,
            cursor: "pointer",

            border: (theme) => `1px solid ${theme.palette.primary.main}`,
          }}
        >
          <Box
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 2 },
            }}
          >
            <Icon icon="mdi:home-outline" />
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              CHANGE PASSWORD
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          label="OLD PASSWORD:"
          placeholder="OLD PASSWORD:"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          label="NEW PASSWORD:"
          placeholder="NEW PASSWORD:"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          label="CONFIRM PASSWORD:"
          placeholder="CONFIRM PASSWORD:"
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={submitPasswordHandler}
        >
          Change Password
        </Button>
      </Grid>

      <Backdrop sx={{ color: "#fff", zIndex: 1000000 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};

export default ChangePassword;
