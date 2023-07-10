//----------
//  React imports
//----------
import { useState, useEffect } from "react";

//----------
//  MUI imports
//----------
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

//----------
//  Icons
//----------
import Icon from "src/@core/components/icon";

//----------
//  Other Libraries
//----------
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";

const OpenTicket = () => {
  //----------
  //  States
  //----------
  const [categories, setCategories] = useState(undefined);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  //----------
  //  Hooks
  //----------
  const auth = useAuth();
  const router = useRouter();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadCategories = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/help-desk/ticket-categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => setCategories(response.data.categories))
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
    loadCategories();
  }, []);

  //----------
  //  Handlers
  //----------
  const submitHandler = (e) => {
    e.preventDefault();
    let errors = 0;
    if (!selectedCategory) {
      toast.error("Category is required!");
      errors++;
    }
    if (!subject) {
      toast.error("Subject is required!");
      errors++;
    }

    if (!message) {
      toast.error("Message is required!");
      errors++;
    }
    // TODO: Add API call here
    if (!errors) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/help-desk/open-ticket`,
          {
            category: selectedCategory,
            subject: subject,
            message: message,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          toast.success(`${response.data.message}`);
          router.replace("/help-desk-system/ticket-response");
        })
        .catch((error) => {
          toast.error(
            `${error.response.status}: ${error.response.data.message}`
          );
          if (error.response.status == 401) {
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
              OpenTicket
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            value={selectedCategory}
            fullWidth
            label="SUBJECT"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories &&
              categories.map((cat) => <MenuItem value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          xs={6}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          label="SUBJECT"
          placeholder="SUBJECT"
        />
      </Grid>
      <Grid item xs={12}>
        {/* <TextField xs={6} value={message} onChange={e => setMessage(e.target.value)} fullWidth label='MESSAGE' placeholder='MESSAGE' /> */}
        <textarea
          className=""
          xs={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="MESSAGE"
          placeholder="MESSAGE"
          rows={4}
          style={{ width: "100%" }}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={submitHandler}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default OpenTicket;
