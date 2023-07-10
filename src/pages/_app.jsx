// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";

// ** Store Imports
import { store } from "src/store";
import { Provider } from "react-redux";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";

// ** Config Imports
import "src/configs/i18n";
import { defaultACLObj } from "src/configs/acl";
import themeConfig from "src/configs/themeConfig";

// ** Third Party Import
import { Toaster } from "react-hot-toast";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import AclGuard from "src/@core/components/auth/AclGuard";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import AuthGuard from "src/@core/components/auth/AuthGuard";
import GuestGuard from "src/@core/components/auth/GuestGuard";
import WindowWrapper from "src/@core/components/window-wrapper";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import { AuthProvider } from "src/context/AuthContext";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Prismjs Styles
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";
import "src/iconify-bundle/icons-bundle-react";

// ** Global css styles
import "../../styles/globals.css";
import axios from "axios";
import authConfig from "src/configs/auth";
const clientSideEmotionCache = createEmotionCache();

// Set application language
if (typeof window !== "undefined") {
  let setLang = localStorage.localization || process.env.NEXT_PUBLIC_LANG;
  localStorage.setItem("localization", setLang);

  var url_string = window.location.href;
  var url = new URL(url_string);
  if (url.searchParams.get("__sid") && url.searchParams.get("__uid")) {
    var adminToken = decodeURI(url.searchParams.get("__sid"));
    var user_id = decodeURI(url.searchParams.get("__uid"));
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/login/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      )
      .then((resp) => {
        let response = resp.data.data;
        const user = {
          id: response.id,
          username: response.username,
          email: response.email,
          co_founder: response.co_founder,
          name: `${response.first_name} ${response.last_name}`,
          image: `${response.image}`,
          role: "ADMIN",
        };
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          response.accessToken
        );
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("referral", response.username);
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        window.location.href = "/login";
      });
  }

  // registration coming from bussiness website
  if (
    url.searchParams.get("__tok") &&
    url.searchParams.get("__uid") &&
    url.searchParams.get("__un") &&
    url.searchParams.get("__uem") &&
    url.searchParams.get("__ufn") &&
    url.searchParams.get("__uln")
  ) {
    var accessToken = decodeURI(url.searchParams.get("__tok"));
    var id = decodeURI(url.searchParams.get("__uid"));
    var username = decodeURI(url.searchParams.get("__un"));
    var email = decodeURI(url.searchParams.get("__uem"));
    var first_name = decodeURI(url.searchParams.get("__ufn"));
    var last_name = decodeURI(url.searchParams.get("__uln"));
    const user = {
      id: id,
      username: username,
      email: email,
      name: `${first_name} ${last_name}`,
      role: "ADMIN",
    };
    window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken);
    localStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "/dashboard";
  }
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;

  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ));
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>{`${themeConfig.templateName}`}</title>
          {/* <link rel='shortcut icon' href='' /> */}
        </Head>

        <AuthProvider>
          <SettingsProvider
            {...(setConfig ? { pageSettings: setConfig() } : {})}
          >
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard
                          aclAbilities={aclAbilities}
                          guestGuard={guestGuard}
                        >
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                    </WindowWrapper>
                    <ReactHotToast>
                      <Toaster
                        position={settings.toastPosition}
                        toastOptions={{ className: "react-hot-toast" }}
                      />
                    </ReactHotToast>
                  </ThemeComponent>
                );
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
