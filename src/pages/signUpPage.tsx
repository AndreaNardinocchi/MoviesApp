import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import { supabase } from "../supabaseClient"; // adjust path as needed

const SignUpPage: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("sign_up")} | MovieApp`;
  }, [t]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /**
   * As we would like to handle empty field errors, we will set an error and
   * handle it in the handleSignUp function below.
   * https://muhimasri.com/blogs/mui-validation/
   */
  const [nameError, setNameError] = useState(false);

  const handleSignUp = async () => {
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setNameError(true);
      return;
    } else {
      setNameError(false);
    }

    // Call Supabase signUp
    // https://supabase.com/docs/guides/auth/managing-user-data
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      // Optionally display this error to the user
      return;
    }

    console.log("User signed up:", data);

    // Store data in the local storage
    // localStorage.setItem("userFirstName", firstName);
    // localStorage.setItem("userLastName", lastName);
    // localStorage.setItem("userEmail", email);
    // localStorage.setItem("userPassword", password);

    // Simulate sign-up logic
    console.log("User registered:", { firstName, lastName, email });

    // Redirect to login page once signed up
    navigate("/login");
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "50vh",
          padding: 10,
          paddingTop: 5,
          margin: 0,
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            {t("create_account")}
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              required
              id="outlined-required"
              label={t("first_name")}
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={nameError}
              helperText={nameError ? t("first_name_text") : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              id="outlined-required"
              label={t("last_name")}
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={nameError}
              helperText={nameError ? t("last_name_text") : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              id="outlined-required"
              label={t("email")}
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={nameError}
              helperText={nameError ? t("email_text") : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              id="outlined-required"
              label={t("password")}
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={nameError}
              helperText={nameError ? t("password_text") : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              // color="primary"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "#8E4585",
                color: "#ffffff",
              }}
              onClick={handleSignUp}
            >
              {t("sign_up")}
            </Button>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: "#8E4585",
              }}
            >
              {t("account_exist")}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SignUpPage;
