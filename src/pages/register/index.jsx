//----------
//  React Imports
//----------
import { useEffect, useState,useRef } from "react";

//----------
//  MUI imports
//----------
import {
  Button,
  TextField,
  InputLabel,
  Box,
  Grid,
  FormControl,
  styled,
  Typography,
  Card,
  Checkbox,
  Select,
  Backdrop,
  CircularProgress,
  MenuItem,
  Link,
  Divider,
  Modal 
} from "@mui/material";

//----------
//  Local imports
//----------
import BlankLayout from "src/@core/layouts/BlankLayout";
import themeConfig from "src/configs/themeConfig";
import { useAuth } from "src/hooks/useAuth";

import CardContent from '@mui/material/CardContent'
//----------
//  Other Libraries imports
//----------
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import axios from "axios";

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
//----------
//  Styled components
//----------
const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.18px",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { marginTop: theme.spacing(8) },
}));

//----------
//  Yup Schemas
//----------
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
});

//----------
//  Constants
//----------
const defaultValues = {
  password: "",
  email: "",
};

const LoginPage = () => {
  //----------
  //  States
  //----------
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [country, setCountry] = useState(null);
  const [telephone, setTelephone] = useState(null);
  const [sponsorId, setSponsorId] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [phonecode, setPhonecode] = useState(null);
  const [packages, setPackages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [submitButton, setSubmitButton] = useState(false);
  const [readOnlySponsor, setReadOnlySponsor] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(null)
  const [viewModal, setViewModal] = useState(false);
  const [termsConditions, setTermsConditions] = useState(null);
  const [scroll, setScroll] = useState('paper')

   //----------
  //  Refs
  //----------
  const descriptionElementRef = useRef(null);
  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      if (typeof window !== "undefined") {
        var url_string = window.location.href;
        var url = new URL(url_string);
        if (url.searchParams.get("referral")) {
          setSponsorId(url.searchParams.get("referral"));
          setReadOnlySponsor(true);
        }
      }
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/packages`)
        .then((response) => {
          setPackages(response.data);
        })
        .catch((error) => {
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
        });


        // Axios for getting terms & conditions data.
        axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/terms-and-conditions`)
        .then((response) => {
          setTermsConditions(response.data?.description);
        })
        .catch((error) => {
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
        });
    };
    loadData();
    const loadCountries = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/countries`)
        .then((response) => {
          setCountries(response.data);
        })
        .catch((error) => {
          toast.error(
            `${error.response ? error.response.status : ""}: ${
              error.response ? error.response.data.message : error
            }`
          );
        });
    };
    loadCountries();
  }, []);


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute' ,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    width:'100%',
    p: 4,
  };

  //----------
  //  Handlers
  //----------
  const termsHandler = (e) => {
    let checked = e.target.checked;
    if (checked) {
      setSubmitButton(true);
    } else {
      setSubmitButton(false);
    }
  };

  const registerHandler = (e) => {
    setOpen(true);
    let updateArr = {
      action: "UserRegistration",
      sponsorid: sponsorId,
      platform: pkg,
      username: username,
      password: password,
      confirm_password: confirmPassword,
      transaction_pwd1: "",
      firstname: firstName,
      lastname: lastName,
      email: email,
      confirm_email: confirmEmail,
      country: country,
      phonecode: phonecode,
      mobile: telephone,
      term_cond: "yes",
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, updateArr)
      .then((resp) => {
        setOpen(false);
        let data = resp.data;
        let user = data.data;
        if (data.success) {
          toast.success(data.message);
          let url = `${process.env.NEXT_PUBLIC_BASE_URL}?__tok=${encodeURI(
            user.accessToken
          )}&__uid=${encodeURI(user.id)}&__un=${encodeURI(
            user.username
          )}&__uem=${encodeURI(user.email)}&__ufn=${encodeURI(
            user.first_name
          )}&__uln=${encodeURI(user.last_name)}`;
          window.location.href = url;
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
  };
  const { handleSubmit } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { email, password } = data;

    auth.login({ email, password, role: null }, ({ success, message }) => {
      if (success) toast.success("Logged In");
      else message.map((msg) => toast.error(msg));
    });
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    countries.forEach((c) => {
      if (c.name == event.target.value) {
        setPhonecode(c.phonecode);
      }
    });
  };

  return (
    <Box sx={{ overflow: "auto" }} className="content-center cloudbg">
      <Card
        sx={{
          p: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.paper",
          width: "100%",
          maxWidth: "850px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 6,
              }}
            >
              <img
                src="/images/logo.png"
                style={{ width: 150, objectFit: "cover" }}
              />
            </Box>

            <TypographyStyled variant="h5">{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
            <Typography variant="body2">
              Please sign-up your new account and start the adventure
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Divider />

            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TypographyStyled variant="h6">
                  Sponsor Information
                </TypographyStyled>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  fullWidth
                  label="Sponsor ID"
                  placeholder="Sponsor ID"
                  value={sponsorId}
                  onChange={(e) => setSponsorId(e.target.value)}
                  disabled={readOnlySponsor ? true : false}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Package</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={pkg || ""}
                    label="Package"
                    onChange={(e) => setPkg(e.target.value)}
                  >
                    {packages
                      ? packages.map((p) => (
                          <MenuItem value={p.id}>
                            {p.name} ({p.amount})
                          </MenuItem>
                        ))
                      : ""}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TypographyStyled variant="h6">
                  Create Login Information
                </TypographyStyled>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  xs={6}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  label="UserName"
                  placeholder="UserName"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  type="password"
                  fullWidth
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TypographyStyled variant="h6">
                  Personal Information
                </TypographyStyled>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  label="First Name"
                  placeholder="First Name"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  label="Last Name"
                  placeholder="Last Name"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="Email"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  xs={6}
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  fullWidth
                  label="Confirm Email"
                  placeholder="Confirm Email"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Country"
                    placeholder="Select Country"
                    value={country}
                    onChange={handleCountryChange}
                  >
                    {countries.map((c) => (
                      <MenuItem value={c.name} selected={c.name == country}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <TextField
                  fullWidth
                  label="Phonecode"
                  placeholder="Phonecode"
                  disabled={true}
                  value={phonecode}
                />
              </Grid>
              <Grid item md={4} xs={8}>
                <TextField
                  xs={4}
                  fullWidth
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  label="Mobile Number"
                  placeholder="Mobile Number"
                />
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox onChange={termsHandler} />
                <Typography>I have read & accept  <Link sx={{cursor:'pointer'}} onClick={handleOpen}>Terms & Conditions</Link> </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ maxWidth: "170px" }}
                  disabled={!submitButton ? true : false}
                  onClick={registerHandler}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
          <Link href="/dashboard" variant="body2">
            Back
          </Link>
        </Box>
      </Card>
      {/* <Backdrop sx={{ color: "#fff", zIndex: 1000000 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop> */}

      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={style}>

          <Typography id="modal-modal-title" variant="h5" component="h2">
          Terms & Conditions
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {termsConditions}
          </Typography>
          <Button sx={{float:'right'}} onClick={handleClose}>close</Button>
        </Card>
      </Modal> */}

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>Terms & Conditions</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>

              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                    <Grid container>
                      {termsConditions}
                    </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>


    </Box>
  );
};

LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = false;

export default LoginPage;
