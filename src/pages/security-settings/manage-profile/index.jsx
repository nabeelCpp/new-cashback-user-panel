//----------
//  React Imports
//----------
import { useState, forwardRef, useEffect } from "react";

//----------
//  MUI imports
//----------
import {
  Box,
  Grid,
  Button,
  TextField,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  FormControl,
  Backdrop,
  CircularProgress,
  Select,Typography
} from "@mui/material";

//----------
//  Other Libraries import
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

//----------
//  Local Imports
//----------
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";

const ManageProfile = () => {
  //----------
  //  States
  //----------
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [telephone, setTelephone] = useState("");
  const [phonecode, setPhonecode] = useState("");
  const [countries, setCountries] = useState([]);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [uploadLogo, setUploadLogo] = useState(null);

  //----------
  //  Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Functions
  //----------
  const submitLogoHandler = () => {
    setOpen(true);
    const formData = new FormData();
    formData.append("image", uploadLogo);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/userpanel/profile/update/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        }
      )
      .then((resp) => {
        setUploadLogo(null);
        setImage(resp.data.image);
        auth.user.image = resp.data.image;
        toast.success(resp.data.message);
        setOpen(false);
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

  const handleLogoUpload = (event) => {
    const selectedImage = event.target.files[0];
    setUploadLogo(selectedImage);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    countries.forEach((c) => {
      if (c.name == event.target.value) {
        setPhonecode(c.phonecode);
      }
    });
  };
  //----------
  //  API calls
  //----------
  const loadProfile = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
      .then((response) => {
        let user = response.data;
        setUsername(user.username || "");
        setFirstname(user.first_name || "");
        setLastname(user.last_name || "");
        setEmail(user.email || "");
        setCountry(user.country || "");
        setPhonecode(user.phonecode || "");
        setTelephone(user.telephone || "");
        setImage(user.image || "");
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
  const submitProfileHandler = (event) => {
    setOpen(true);
    let updateArr = {
      first_name: firstname,
      last_name: lastname,
      country: country,
      phonecode: phonecode,
      mobile: telephone,
      email: email,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/userpanel/profile`, updateArr, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
        },
      })
      .then((resp) => {
        setOpen(false);
        let data = resp.data;
        if (data.success) {
          toast.success(data.message);
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

  //----------
  //  Effects
  //----------
  useEffect(() => {
    loadProfile();
    loadCountries();
  }, []);

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
              Personal Information
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          xs={6}
          value={username}
          fullWidth
          label="USERNAME:"
          placeholder="USERNAME:"
          disabled
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
          fullWidth
          label="FirstName"
          placeholder="FirstName"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
          fullWidth
          label="LastName"
          placeholder="LastName"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={email}
          fullWidth
          label="Email"
          placeholder="abc@gmail.com"
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={country}
              value={country}
              label="Country"
              onChange={handleCountryChange}
            >
              {countries.map((c) => (
                <MenuItem value={c.name} selected={c.name == country}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item md={3} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setPhonecode(e.target.value)}
          value={phonecode}
          fullWidth
          label="CODE:"
          placeholder="CODE:"
          disabled
        />
      </Grid>
      <Grid item md={9} xs={12}>
        <TextField
          xs={6}
          onChange={(e) => setTelephone(e.target.value)}
          value={telephone}
          fullWidth
          label="MOBILE NUMBER:"
          placeholder="MOBILE NUMBER:"
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={submitProfileHandler}
        >
          Update Profile
        </Button>
      </Grid>
      <Grid item md={12} xs={12}>
        <Button variant="contained" sx={{ mr: 2 }} component="label">
          Upload Image
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleLogoUpload}
          />
        </Button>
        {!uploadLogo && image ? (
          <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
            <ImageListItem key={image}>
              <img
                src={`${image}`}
                srcSet={`${image}`}
                alt={image}
                loading="lazy"
              />
            </ImageListItem>
          </ImageList>
        ) : (
          uploadLogo && (
            <ImageList
              sx={{ width: 500, height: 200 }}
              cols={3}
              rowHeight={164}
            >
              <ImageListItem key={URL.createObjectURL(uploadLogo)}>
                <img
                  src={`${URL.createObjectURL(uploadLogo)}`}
                  srcSet={`${URL.createObjectURL(uploadLogo)}`}
                  alt={URL.createObjectURL(uploadLogo)}
                  loading="lazy"
                />
              </ImageListItem>
            </ImageList>
          )
        )}
      </Grid>

      <Grid item md={6} xs={12}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={submitLogoHandler}>
          Submit
        </Button>
      </Grid>

      <Backdrop sx={{ color: "#fff", zIndex: 1000000 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};

export default ManageProfile;
