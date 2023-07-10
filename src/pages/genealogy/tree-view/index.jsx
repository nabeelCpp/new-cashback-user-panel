//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI Imports
//----------
import {
  Grid,
  Card,
  TextField,
  Avatar,
  Typography,
  Button,
} from "@mui/material";

//----------
//  Other Libraries Import
//----------
import { toast } from "react-hot-toast";
import axios from "axios";

const MyTreeView = () => {
  //----------
  // States
  //----------
  const [tree, setTree] = useState([]);
  const [root, setRoot] = useState([]);
  const [referral, setReferral] = useState(0);
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState(null);

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/genealogy/tree-view`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setTree(response.data.tree);
          setRoot(response.data.root);
          setReferral(response.data.referrals);
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
  const searchUserId = (event) => {
    let s = event.target.value;
    setUserId(s);
    setSearch(s);
  };

  const searchHandler = () => {
    if (!userId) {
      toast.error("Search cannot be empty!");
    } else {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/userpanel/genealogy/tree-view`,
          { user_id: userId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`,
            },
          }
        )
        .then((response) => {
          setTree(response.data.tree);
          setRoot(response.data.root);
          setReferral(response.data.referrals);
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
    }
  };

  const back = () => {
    setSearch("");
    loadData();
  };

  //----------
  //  JSX
  //----------
  return (
    <Grid item xs={12}>
      <Grid container spacing={6} sx={{ my: 10 }} className="match-height">
        <Grid item md={6} xs={12}>
          <TextField
            xs={6}
            fullWidth
            label="USERID:"
            placeholder="USERID:"
            value={search}
            onChange={searchUserId}
          />
        </Grid>
        <Grid item spacing={2} md={6} xs={12}>
          <Button
            variant="contained"
            sx={{ height: "100%" }}
            onClick={searchHandler}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            sx={{ height: "100%", ml: 5 }}
            onClick={back}
          >
            Back
          </Button>
        </Grid>
      </Grid>

      <Typography>
        You have <b>{referral}</b> referral members.
      </Typography>
      <Card
        sx={{
          minHeight: "500px",
          p: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul id="myUL">
          <li>
            {" "}
            <Typography sx={{ display: "flex" }} className="caret">
              <Avatar
                src={root.image}
                width={50}
                height={50}
                alt="Profile Picture"
              />
              <Typography sx={{ display: "flex", flexDirection: "column" }}>
                <span>{root && root.user_id}</span>
                <span>{root && root.first_name + " " + root.last_name}</span>
              </Typography>
              <Card
                className="treeCard"
                sx={{
                  position: "absolute",
                  right: "+150px",
                  p: 5,
                  width: "300px",
                }}
              >
                <Typography sx={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    {" "}
                    <b>User ID</b> {root.user_id}
                  </span>
                  <span>
                    {" "}
                    <b>User Name</b> {root.user_name}
                  </span>
                  <span>
                    {" "}
                    <b>Full Name</b> {root.first_name} {root.last_name}
                  </span>
                  <span>
                    {" "}
                    <b>Country</b> {root.country}
                  </span>
                  <span>
                    {" "}
                    <b>Sponsor Id</b> {root.ref_id}
                  </span>
                  <span>
                    {" "}
                    <b>Self Bussiness</b> {root.selfBussiness}
                  </span>
                  <span>
                    {" "}
                    <b>Team Bussiness</b> {root.teamBussiness}
                  </span>
                </Typography>
              </Card>
            </Typography>
            <ul className="nested">
              {tree &&
                tree.map((t) => {
                  return (
                    <li>
                      <Typography
                        sx={{ display: "flex", position: "relative" }}
                      >
                        <Avatar
                          src={t && t.image}
                          width={50}
                          height={50}
                          alt={t.first_name + " " + t.last_name}
                        />
                        <Typography
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "300px",
                          }}
                        >
                          <span>{t.user_id}</span>
                          <span>{t.first_name + " " + t.last_name}</span>
                        </Typography>
                        <Card
                          className="treeCard"
                          sx={{
                            position: "absolute",
                            right: "-150px",
                            p: 5,
                            width: "300px",
                          }}
                        >
                          <Typography
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>
                              {" "}
                              <b>User ID</b> {t.user_id}
                            </span>
                            <span>
                              {" "}
                              <b>User Name</b> {t.user_name}
                            </span>
                            <span>
                              {" "}
                              <b>Full Name</b> {t.first_name} {t.last_name}
                            </span>
                            <span>
                              {" "}
                              <b>Country</b> {t.country}
                            </span>
                            <span>
                              {" "}
                              <b>Sponsor Id</b> {t.ref_id}
                            </span>
                            <span>
                              {" "}
                              <b>Self Bussiness</b> {t.selfBussiness}
                            </span>
                            <span>
                              {" "}
                              <b>Team Bussiness</b> {t.teamBussiness}
                            </span>
                          </Typography>
                        </Card>
                      </Typography>
                    </li>
                  );
                })}
            </ul>
          </li>
        </ul>
      </Card>
    </Grid>
  );
};
export default MyTreeView;
