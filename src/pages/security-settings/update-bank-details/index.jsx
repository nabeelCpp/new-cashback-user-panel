//----------
//  React Imports
//----------
import { useState, useEffect } from "react";

//----------
//  MUI imports
//----------
import { Box, Grid, Button, TextField, Typography } from "@mui/material";

//----------
//  Other Libraries Import
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

//----------
//  Local imports
//----------
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";

const BankInfo = () => {
  //----------
  //  States
  //----------
  const [profile, setProfile] = useState([]);
  const [account, setAccount] = useState("");
  const [bankname, setBankname] = useState("");
  const [swiftcode, setSwiftcode] = useState("");
  const [bankstate, setBankstate] = useState("");
  const [branch, setBranch] = useState("");
  const [accountno, setAccountno] = useState("");

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadProfile = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        .then((response) => {
          let user = response.data;
          setAccount(user.acc_name || "");
          setBankname(user.bank_nm || "");
          setSwiftcode(user.swift_code || "");
          setBankstate(user.bank_state || "");
          setBranch(user.branch_nm || "");
          setAccountno(user.ac_no || "");
          setProfile(user);
        })
        .catch((error) => {
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
          if (error.response && error.response.status == 401) {
            auth.logout();
          }
        });
    };

    loadProfile();
  }, []);

  //----------
  //  Handlers
  //----------
  const submitBankHandler = () => {
    let bankInfo = {
      acc_name: account,
      bank_nm: bankname,
      branch_nm: branch,
      ac_no: accountno,
      swift_code: swiftcode,
      bank_state: bankstate,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/userpanel/bank-info/update`,
        bankInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      )
      .then((resp) => {
        let data = resp.data;
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
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
  };

  //----------
  //  JSX
  //----------
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
              Update Bank Information
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setAccount(e.target.value)}
          value={account}
          fullWidth
          label="ACCOUNT NAME"
          placeholder="ACCOUNT NAME"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setBankname(e.target.value)}
          value={bankname}
          fullWidth
          label="BANK NAME"
          placeholder="BANK NAME"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setSwiftcode(e.target.value)}
          value={swiftcode}
          fullWidth
          label="IFSC CODE"
          placeholder="IFSC CODE"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setBankstate(e.target.value)}
          value={bankstate}
          fullWidth
          label="BANK STATE"
          placeholder="BANK STATE"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setBranch(e.target.value)}
          value={branch}
          fullWidth
          label="BANK BRANCH"
          placeholder="BANK BRANCH"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setAccountno(e.target.value)}
          value={accountno}
          fullWidth
          label="ACCOUNT NUMBER"
          placeholder="ACCOUNT NUMBER"
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={submitBankHandler}>
          Update Bank Details
        </Button>
      </Grid>
    </Grid>
  );
};

export default BankInfo;
