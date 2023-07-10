//----------
//  React Imports
//----------
import { useEffect, useState } from "react";

//----------
//  MUI imports
//----------
import { Grid, Card, Typography, CardContent, Button } from "@mui/material";

//----------
//  MUI Icon imports
//----------
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/Whatsapp";
import TwitterIcon  from "@mui/icons-material/Twitter";
//----------
//  Other Libraries Imports
//----------
import axios from "axios";
import { toast } from "react-hot-toast";

//----------
//  Local Imports
//----------
import { useAuth } from "src/hooks/useAuth";

const RefferLink = () => {
  //----------
  // States
  //----------
  const [referral, setReferral] = useState(null);

  //----------
  // Hooks
  //----------
  const auth = useAuth();

  //----------
  //  Effects
  //----------
  useEffect(() => {
    let loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/userpanel`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
          },
        })
        .then((response) => {
          let url = `${process.env.NEXT_PUBLIC_BASE_URL}register?referral=${
            (response.data.referralLink != undefined &&
              response.data.referralLink) ||
            ""
          }`;
          setReferral(url);
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
  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    textarea.value = referral;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    toast.success("Copied");
  };

  const shareOnFb = () => {
    let url = `http://www.facebook.com/sharer.php?u=${referral}&pos=right`;
    window.open(url);
  };

  const shareOnWhatsapp = () => {
    let url = `https://api.whatsapp.com/send?text=${referral}&pos=right`;
    window.open(url);
  };

  const shareOnTwitter = () => {
    let url = `http://twitter.com/share?${referral}&pos=right`;
    window.open(url);
  };

  return (
    <div>
      <h3>REFERRAL LINK</h3>
      <Card component="div" sx={{ position: "relative", mb: 7 }}>
        <CardContent>
          <Typography
            variant="p"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>
              Referral Link:{" "}
              <a className="btn btn-light" target="__blank" href={referral}>
                {referral}
              </a>
            </Typography>

            <Typography>
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={copyToClipboard}
              >
                Copy
              </Button>
            </Typography>
          </Typography>

          <link></link>

          <Grid item md={6} xs={12} sx={{ mt: 20, mb: 10 }}>
            <Button
              style={{ background: "#3b5998" }}
              variant="contained"
              sx={{ mr: 2 }}
              onClick={shareOnFb}
              startIcon={<FacebookIcon />}
            >
              Share on facebook
            </Button>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={shareOnWhatsapp}
              style={{ background: "#075E54" }}
              startIcon={<WhatsAppIcon />}
            >
              Share on Whatsapp
            </Button>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={shareOnTwitter}
              style={{ background: "#00acee" }}
              startIcon={<TwitterIcon />}
            >
              Share on Twitter
            </Button>
            {/* <Button variant='contained' sx={{ mr: 2 }} onClick={shareOnGoogle} style={{background: '#db4a39'}} startIcon={<GoogleIcon />}>
            Share on Google
            </Button> */}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefferLink;
