//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import {
  Grid,
  Card,
  Typography,
  CardContent,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from "@mui/material/LinearProgress";

//----------
//  Other Libraries Imports
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

//----------
//  Styled Components
//----------
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const Dashboard = () => {
  //----------
  // States
  //----------
  var [data, setData] = useState([]);

  //----------
  // Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel`, {
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
  //  JSX
  //----------
  return (
    <div>
      <Card component="div" sx={{ position: "relative", mb: 7 }}>
        <CardContent>
          <Typography variant="p">
            Referral Link:{" "}
            <a
              className="btn btn-light"
              target="__blank"
              href={`${process.env.NEXT_PUBLIC_BASE_URL}register?referral=${
                (data.referralLink != undefined && data.referralLink) || ""
              }`}
            >
              {process.env.NEXT_PUBLIC_BASE_URL}register?referral=
              {(data.referralLink != undefined && data.referralLink) || ""}
            </a>
          </Typography>
          <link></link>
        </CardContent>
      </Card>

      <Grid
        container
        spacing={6}
        className="match-height"
        sx={{ position: "relative", mb: 7 }}
      >
        <Grid item xs={12} md={4}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Capping
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                {data?.capping?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={6}
        md={12}
        className="match-height"
        sx={{ position: "relative", mb: 7 }}
      >
        <Grid item xs={12} md={12}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <div sx={{ display: "flex" }}>
                <Typography
                  component="div"
                  variant="p"
                  sx={{ fontWeight: "bold", mb: 10 }}
                >
                  Your Monthly Target Meter
                </Typography>

                <Typography
                  component="div"
                  sx={{ position: "relative", mb: 10 }}
                >
                  <Typography
                    component="div"
                    sx={{
                      display: "block",
                      position: "absolute",
                      width: "100%",
                      zIndex: "2",
                      display: "flex",
                      justifyContent: "center",
                      color: "black",
                      alignItems: "center",
                    }}
                  >
                    {data.monthlyTargetMeterPercentage?.toFixed(2)}%
                  </Typography>
                  <BorderLinearProgress
                    sx={{ height: 30 }}
                    variant="determinate"
                    value={data.monthlyTargetMeterPercentage?.toFixed(2)}
                  />
                </Typography>
              </div>
              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                Monthly Target:{" "}
                {(0).toLocaleString(undefined, { minimumFractionDigits: 0 })} -{" "}
                {data?.monthlyTarget?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                Monthly Purchase:{" "}
                {data?.currentMonthSale?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <div sx={{ display: "flex" }}>
                <Typography
                  component="div"
                  variant="p"
                  sx={{ fontWeight: "bold", mb: 10 }}
                >
                  Your Annual Target Meter
                </Typography>
                <Typography
                  component="div"
                  sx={{ position: "relative", mb: 10 }}
                >
                  <Typography
                    component="div"
                    sx={{
                      display: "block",
                      position: "absolute",
                      width: "100%",
                      zIndex: "2",
                      display: "flex",
                      justifyContent: "center",
                      color: "black",
                      alignItems: "center",
                    }}
                  >
                    {data.annualTargetMeterPercentage?.toFixed(2)}%
                  </Typography>
                  <BorderLinearProgress
                    sx={{ height: 30 }}
                    variant="determinate"
                    value={data.annualTargetMeterPercentage?.toFixed(2)}
                  />
                </Typography>
              </div>
              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                Annual Target:{" "}
                {(0).toLocaleString(undefined, { minimumFractionDigits: 0 })} -{" "}
                {data?.anualTarget?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                Annual Purchase:{" "}
                {data?.totalSale?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} className="match-height">
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Level Earning
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                {data?.totalIncome?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Income Wallet
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                {data?.walletAmount?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Purchase(Current month)
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                {data?.currentMonthSale?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Target(Current month)
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                {data?.monthlyTarget?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 5 }} className="match-height">
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Co-founder Income
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                {data?.totalCofounderIncome?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {data?.totalSale?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                TOTAL PURCHASE
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {data?.totalIncome?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}{" "}
                Points
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                TOTAL INCOME
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {data.total_downline}
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                TOTAL DOWNLINE
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card component="div" sx={{ position: "relative", mb: 7 }}>
            <CardContent>
              <Typography
                component="div"
                variant="p"
                sx={{
                  fontWeight: "bold",
                  mb: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {data.direct_downline}
                <Avatar sx={{}} variant="rounded"></Avatar>
              </Typography>

              <Typography
                component="div"
                variant="p"
                sx={{ fontWeight: "bold" }}
              >
                TOTAL DIRECT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
