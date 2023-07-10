//----------
//  React Imports
//----------
import { useState } from "react";

//----------
//  MUI imports
//----------
import {
  Button,
  TextField,
  InputLabel,
  IconButton,
  Box,
  FormControl,
  useMediaQuery,
  OutlinedInput,
  styled,
  useTheme,
  FormHelperText,
  InputAdornment,
  Typography,
  Divider,Card
} from "@mui/material";

//----------
//  Icons
//----------
import Icon from "src/@core/components/icon";

//----------
//  Local imports
//----------
import { useAuth } from "src/hooks/useAuth";
import { useSettings } from "src/@core/hooks/useSettings";
import themeConfig from "src/configs/themeConfig";
import BlankLayout from "src/@core/layouts/BlankLayout";

//----------
//  Other Libraries Import
//----------
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import * as yup from "yup";

//----------
//  Styled components
//----------
const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 400,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    maxWidth: 400,
  },
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.18px",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { marginTop: theme.spacing(8) },
}));

//----------
//  Yup Schema
//----------
const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().min(5).required(),
});

//----------
//  constants
//----------
const defaultValues = {
  password: "",
  email: "",
};

const LoginPage = () => {
  //----------
  //  States
  //----------
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  //----------
  // Hooks
  //----------
  const auth = useAuth();
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  //----------
  //  Variables
  //----------
  const { skin } = settings;

  //----------
  //  Handlers
  //----------
  const onSubmit = (data) => {
    setSubmitting(true);

    const { email, password } = data;

    auth.login({ email, password }, ({ success, message }) => {
      setSubmitting(false);
      if (success) toast.success("Logged In");
      else message.map((msg) => toast.error(msg));
    });
  };

  return (
    <Box sx={{ overflow: "auto" }} className="content-center cloudbg">
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Card
          sx={{
            p: 7,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
        >
          <BoxWrapper>
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
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* <RoleSelect role={role} setRole={setRole} /> */}
              <Divider />
              <FormControl fullWidth sx={{ my: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      type="text"
                      autoFocus
                      label="Email / Username"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder="Email / Username"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="auth-login-v2-password"
                  error={Boolean(errors.password)}
                >
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }} id="">
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ my: 7 }}
                disabled={isSubmitting}
              >
                Login
              </Button>
            </form>
            {/* <Link href="/register" variant="body2">
              Register
            </Link> */}
          </BoxWrapper>
        </Card>
      </RightWrapper>
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = true;

export default LoginPage;
