//----------
//  React Imports
//----------
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

//----------
//  MUI imports
//----------
import {
  Box,
  Grid,
  Dialog,
  Button,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
  DialogTitle,
  DialogContentText,
  Icon,
  Card,
  CardContent,
} from "@mui/material";

//----------
//  Other Libraries Import
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

const IncomeWithdrawal = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState(null);
  const [amount, setAmount] = useState(null);
  const [description, setDescription] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  //----------
  //  Hooks
  //----------
  const router = useRouter();

  //----------
  //  Refs
  //----------
  const descriptionElementRef = useRef(null);

  //----------
  //  Effects
  //----------
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    const loadData = () => {
      setOpen(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/wallet-mgt/income-withdrawal`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setOpen(false);
          if (
            !response.data.accountName ||
            !response.data.accountNo ||
            !response.data.bankName ||
            !response.data.swiftCode
          ) {
            toast.error("Please First Update Your Bank Details");
            router.replace("/security-settings/update-bank-details/");
          }
          setData(response.data);
        })
        .catch((error) => {
          setOpen(false);
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
    loadData();
  }, []);

  //----------
  //  Actions
  //----------
  const confirmSend = () => {
    setOpen(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/userpanel/wallet-mgt/income-withdrawal/submit`,
        {
          wallet_from: "withdrawal",
          amount: amount,
          first_name: data.fullname,
          acc_name: data.accountName,
          acc_number: data.accountNo,
          bank_nm: data.bankName,
          branch_nm: data.branchName,
          swift_code: data.swiftCode,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      )
      .then((response) => {
        setOpen(false);
        setConfirmationModal(false);
        toast.success(response.data.message);
        router.replace("withdrawal-requests");
      })
      .catch((error) => {
        setOpen(false);
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

  //----------
  //  Handlers
  //----------
  const handleClose = () => setConfirmationModal(false);

  const submitHandler = () => {
    let errors = false;
    if (!amount) {
      toast.error("Amount is required");
      errors = true;
    }

    if (!password) {
      toast.error("Password is required");
      errors = true;
    }
    if (!errors) {
      setOpen(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/wallet-mgt/income-withdrawal`,
          {
            password: password,
            amount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setOpen(false);
          setConfirmationModal(true);
        })
        .catch((error) => {
          setOpen(false);
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
          if (error.response && error.response.status == 401) {
            auth.logout();
          }
        });
    }
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
              WITHDRAWAL REQUEST FORM
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="p">
          INCOME WALLET BALANCE:{" "}
          {new Intl.NumberFormat(`${localStorage.localization}`, {
            style: "currency",
            currency: process.env.NEXT_PUBLIC_CURRENCY,
          }).format(data?.walletAmount)}
        </Typography>
      </Grid>
      {data ? (
        <>
          <Grid item xs={12}>
            <TextField
              xs={6}
              fullWidth
              label="Full Name"
              placeholder="Full Name"
              value={data?.fullname}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              fullWidth
              label="Account Name"
              placeholder="Account Name"
              value={data?.accountName}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              fullWidth
              label="Account Number"
              placeholder="Account Number"
              value={data?.accountNo}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              fullWidth
              label="Bank Name"
              placeholder="Bank Name"
              value={data?.bankName}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              fullWidth
              label="Branch Name"
              placeholder="Branch Name"
              value={data?.branchName}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              fullWidth
              label="IFSC Code"
              placeholder="IFSC Code"
              value={data?.swiftCode}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              label="ENTER Amount"
              placeholder="ENTER Amount"
              type="number"
              value={amount}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              label="Description"
              placeholder="Description"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              xs={6}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              label="Enter Password"
              placeholder="Enter Password"
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Button variant="contained" sx={{ mr: 2 }} onClick={submitHandler}>
              Submit
            </Button>
          </Grid>
        </>
      ) : (
        ""
      )}
      <div>
        <Dialog
          open={confirmationModal}
          onClose={handleClose}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            WITHDRAWAL REQUEST CONFIRMATION
          </DialogTitle>
          <DialogContent dividers={"paper"}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid item xs={12}></Grid>

              <Card component="div" sx={{ position: "relative", mb: 7 }}>
                <CardContent>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM FULL NAME</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={data?.fullname} />
                    </ListItemButton>
                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM ACCOUNT NAME</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={data?.accountName} />
                    </ListItemButton>
                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM ACCOUNT NUMBER</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={data?.accountNo} />
                    </ListItemButton>
                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM BANK NAME</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={data?.bankName} />
                    </ListItemButton>
                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM BRANCH NAME</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={data?.branchName} />
                    </ListItemButton>
                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM IFSC CODE</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={data?.swiftCode} />
                    </ListItemButton>

                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM AMOUNT</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={amount} />
                    </ListItemButton>

                    <ListItemButton>
                      <Typography>
                        <b>CONFIRM DESCRIPTION</b>&nbsp;&nbsp;
                      </Typography>
                      <ListItemText primary={description} />
                    </ListItemButton>
                  </List>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={confirmSend}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: 100000 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};

export default IncomeWithdrawal;
