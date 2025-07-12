import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
// https://v5-0-6.mui.com/components/text-fields/?
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  /**
   * Input Adornments in Material-UI's mui textfield offer a flexible way
   * to incorporate additional elements like prefixes, suffixes, or
   * interactive icons directly within the text field.
   * https://www.php.cn/faq/1796604601.html?
   * https://v5-0-6.mui.com/components/text-fields/?
   * */
  InputAdornment,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

const LoginPage: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const { authenticate } = useContext(AuthContext) || {};

  // useSate() hooks for storing user input from the login form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /**
   * As we would like to handle empty field errors, we will set an error and
   * handle it in the handleSignUp function below.
   * https://muhimasri.com/blogs/mui-validation/
   */
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  /**
   * As we would like to handle incorrect data inputted by the user,
   * we will set an error and handle it in the handleSignUp function below.
   */
  const [loginError, setLoginError] = useState("");

  /**
   * Handles login logic when the user submits the form.
   * If an 'authenticate' function is available (from context),
   * it is called with the current email and password values.
   * This triggers authentication logging and checking credentials
   */
  const login = () => {
    // Create a boolean variable which indicates whether the error exists or not
    let hasError = false;
    // The email field can't be empty
    if (email.trim() === "") {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    // The password field can't be empty
    if (password.trim() === "") {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    // Error message
    if (hasError) {
      setLoginError("Fill in all required fields!");
    }

    // Creating variables carrying the values stored in local storage
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    // Check the inputted value against what stored in the local storage
    if (savedEmail !== email) {
      setLoginError(t("no_account_login"));
    } else if (savedPassword !== password) {
      setLoginError(t("incorrect_password"));
    } else {
      // if no error, then, authenticate
      setLoginError("");
      if (authenticate) {
        authenticate(email, password);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "50vh",
          padding: 10,
          margin: 0,
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            {t("login_header")}
            {/* Let's go to the cinema tonight! */}
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            {/* Email Field 
        https://muhimasri.com/blogs/mui-validation/*/}
            <TextField
              fullWidth
              required
              id="outlined-required"
              label={t("email")}
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? t("email_text") : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Field 
        https://muhimasri.com/blogs/mui-validation/*/}
            <TextField
              fullWidth
              required
              id="outlined-required"
              label={t("password")}
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? t("password_text") : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              variant="contained"
              // color="primary"
              fullWidth
              onClick={login}
              sx={{
                mt: 3,
                bgcolor: "#8E4585",
                color: "#ffffff",
              }}
            >
              {t("login_cta")}
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              sx={{
                color: "#8E4585",
              }}
            >
              {t("login_text")}
            </Button>
            {loginError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {loginError}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
