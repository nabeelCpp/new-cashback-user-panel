//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

//----------
//MUI imports
//----------
import {
  Grid,
  Card,
  Typography,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
} from "@mui/material";

//----------
//  Other Libraries Imports
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

const Plan = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [singlePackage, setSinglePackage] = useState(null);
  const [open, setOpen] = useState(false);

  //----------
  //  Hooks
  //----------
  const router = useRouter();
  const auth = useAuth();

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
    const loadData = async () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/upgrade/plan`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        .then((response) => {
          setData(response.data);
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
    loadData();
  }, []);

  //----------
  //  Handlers
  //----------
  const handleClose = () => setModalOpen(false);
  const continueSubmit = () => {
    setOpen(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/userpanel/upgrade/plan/${singlePackage.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      )
      .then((response) => {
        setOpen(false);
        setModalOpen(false);
        toast.success(response.data.message);
        router.replace("plan-history");
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
  //  Functions
  //----------
  const subscribe = (id) => {
    setModalOpen(true);
    let filter = data.filter((f) => f.id == id);
    setSinglePackage(filter[0]);
  };

  //----------
  //  JSX
  //----------
  return (
    <div>
      <h3>Plan Subscription</h3>
      {data.success ? (
        <Grid item xs={12} md={5}>
          <Card
            component="div"
            sx={{
              position: "relative",
              mb: 7,
              textAlign: "center",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography component="div" variant="p">
                {data.message}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : Array.isArray(data) ? (
        <Grid
          container
          spacing={6}
          className="match-height"
          sx={{
            position: "relative",
            mb: 7,
            textAlign: "center",
            minHeight: "300px",
          }}
        >
          {data.map((pack) => {
            return (
              <Grid item xs={12} md={5}>
                <Card
                  component="div"
                  sx={{
                    position: "relative",
                    mb: 7,
                    textAlign: "center",
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <CardContent>
                    <Typography
                      component="div"
                      variant="p"
                      sx={{ fontWeight: "bold", mb: 3 }}
                    >
                      {pack.name}
                    </Typography>

                    <Typography
                      component="h1"
                      variant="p"
                      sx={{ fontWeight: "500" }}
                    >
                      {new Intl.NumberFormat(`${localStorage.localization}`, {
                        style: "currency",
                        currency: process.env.NEXT_PUBLIC_CURRENCY,
                      }).format(pack.amount)}
                    </Typography>
                    <Typography component="div" variant="p">
                      Target Duration : 1 Month
                    </Typography>
                    <Typography component="div" variant="p">
                      Target Sale :{" "}
                      {new Intl.NumberFormat(`${localStorage.localization}`, {
                        style: "currency",
                        currency: process.env.NEXT_PUBLIC_CURRENCY,
                      }).format(pack.amount)}
                    </Typography>
                    <Typography component="div" variant="p">
                      Max Earning :{" "}
                      {new Intl.NumberFormat(`${localStorage.localization}`, {
                        style: "currency",
                        currency: process.env.NEXT_PUBLIC_CURRENCY,
                      }).format(pack.capping)}
                    </Typography>
                  </CardContent>
                  <Button
                    sx={{ maxWidth: "150px", mb: "20px" }}
                    variant="contained"
                    onClick={() => subscribe(pack.id)}
                  >
                    Subscribe
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Grid item xs={12} md={5}>
          <Card
            component="div"
            sx={{
              position: "relative",
              mb: 7,
              textAlign: "center",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography component="div" variant="p">
                No package Found!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}

      <div>
        <Dialog
          open={modalOpen}
          onClose={handleClose}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            Are you sure want to subscribe this package ?
          </DialogTitle>
          <DialogContent dividers={"paper"}>
            <Typography component="div" variant="h6">
              {singlePackage?.name}
            </Typography>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Card component="div" sx={{ position: "relative", mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} color={"green"}>
                      TARGET SALE :{" "}
                      {new Intl.NumberFormat(`${localStorage.localization}`, {
                        style: "currency",
                        currency: process.env.NEXT_PUBLIC_CURRENCY,
                      }).format(singlePackage?.amount)}
                    </Grid>
                    <Grid item xs={12} color={"green"}>
                      TARGET DAYS : 1 MONTH
                    </Grid>
                    <Grid item xs={12} color={"green"}>
                      MAX EARNING :{" "}
                      {new Intl.NumberFormat(`${localStorage.localization}`, {
                        style: "currency",
                        currency: process.env.NEXT_PUBLIC_CURRENCY,
                      }).format(singlePackage?.capping)}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={continueSubmit}>Continue</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: 10000 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Plan;
