// import { useContext } from "react";
// import { AuthContext } from "../contexts/authContext";

// const LoginPage = () => {
//   const authContext = useContext(AuthContext);
//   const { authenticate } = authContext || {};

//   const login = () => {
//     const password = Math.random().toString(36).substring(7);
//     authenticate && authenticate("user1", password);
//   };

//   return (
//     <>
//       <h2>Login page</h2>
//       <p>You must log in to view the protected pages </p>
//       {/* Login web form  */}
//       <button onClick={login}>Submit</button>
//     </>
//   );
// };

// export default LoginPage;

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

// import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
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
      setLoginError("No account found with this email.");
    } else if (savedPassword !== password) {
      setLoginError("The password you entered is incorrect.");
    } else {
      // if no error, then, authenticate
      setLoginError("");
      if (authenticate) {
        authenticate(email, password);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Let's go to the cinema tonight!
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        {/* Email Field 
        https://muhimasri.com/blogs/mui-validation/*/}
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          helperText={emailError ? "Please enter your email" : ""}
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
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          helperText={passwordError ? "Please enter your email" : ""}
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
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={login}
        >
          Submit
        </Button>
        <Button onClick={() => navigate("/signup")}>
          Don't have an account? Sign Up
        </Button>
        {loginError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
