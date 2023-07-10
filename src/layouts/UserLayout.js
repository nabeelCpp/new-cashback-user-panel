//----------
// MUI imports
//----------
import { useMediaQuery, Box, Button } from "@mui/material";

//----------
//  Other Libraries Import
//----------
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";

//----------
//  Local Imports
//----------
import Layout from "src/@core/layouts/Layout";
import VerticalNavItems from "src/navigation/vertical";
import HorizontalNavItems from "src/navigation/horizontal";
import VerticalAppBarContent from "./components/vertical/AppBarContent";
import HorizontalAppBarContent from "./components/horizontal/AppBarContent";
import { useSettings } from "src/@core/hooks/useSettings";
import { useAuth } from "src/hooks/useAuth";
import { fullscreen } from "src/store/fullscreen";

const UserLayout = ({ children, contentHeightFixed }) => {
  //----------
  //  Hooks
  //----------
  const { settings, saveSettings } = useSettings();
  const auth = useAuth();
  const hide = useSelector((state) => state.fullscreen.value.hidden);
  const router = useRouter();
  const dispatch = useDispatch();
  const hidden = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  if (hidden && settings.layout === "horizontal") {
    settings.layout = "vertical";
  }

  return (
    <>
      {!hide ? (
        <Layout
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          contentHeightFixed={contentHeightFixed}
          verticalLayoutProps={{
            navMenu: {
              navItems: VerticalNavItems(auth.user.role),

              // Uncomment the below line when using server-side menu in vertical layout and comment the above line
              // navItems: verticalMenuItems
            },
            appBar: {
              content: (props) => (
                <VerticalAppBarContent
                  hidden={hidden}
                  settings={settings}
                  saveSettings={saveSettings}
                  toggleNavVisibility={props.toggleNavVisibility}
                />
              ),
            },
          }}
          {...(settings.layout === "horizontal" && {
            horizontalLayoutProps: {
              navMenu: {
                navItems: HorizontalNavItems(auth.user.role),

                // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
                // navItems: horizontalMenuItems
              },
              appBar: {
                content: () => (
                  <HorizontalAppBarContent
                    hidden={hidden}
                    settings={settings}
                    saveSettings={saveSettings}
                  />
                ),
              },
            },
          })}
        >
          {router.pathname.includes("requests") ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                paddingBottom: "30px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(fullscreen());
                }}
              >
                {hide === false ? (
                  <BiFullscreen size={25} />
                ) : (
                  <BiExitFullscreen size={25} />
                )}
              </Button>
            </Box>
          ) : null}

          {children}
        </Layout>
      ) : (
        <Box sx={{ padding: "20px" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              paddingBottom: "30px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                dispatch(fullscreen());
              }}
            >
              {hide === false ? (
                <BiFullscreen size={25} />
              ) : (
                <BiExitFullscreen size={25} />
              )}
            </Button>
          </Box>

          {children}
        </Box>
      )}
    </>
  );
};

export default UserLayout;
