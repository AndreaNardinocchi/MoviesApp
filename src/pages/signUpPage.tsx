import React, { useState } from "react";
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

const SignUpPage: React.FC = () => {
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

  const handleSignUp = () => {
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
    // Store data in the local storage
    localStorage.setItem("userFirstName", firstName);
    localStorage.setItem("userLastName", lastName);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    // Simulate sign-up logic
    console.log("User registered:", { firstName, lastName, email, password });

    // Redirect to login page once signed up
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Create an Account
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="First name"
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={nameError}
          helperText={
            nameError
              ? "Please enter your first name (letters and spaces only)"
              : ""
          }
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
          label="Last name"
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={nameError}
          helperText={
            nameError
              ? "Please enter your last name (letters and spaces only)"
              : ""
          }
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
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={nameError}
          helperText={nameError ? "Please enter your email" : ""}
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
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={nameError}
          helperText={nameError ? "Please enter your password" : ""}
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
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        <Button onClick={() => navigate("/login")}>
          Already have an account? Log in
        </Button>
      </Box>
    </Container>
  );
};

export default SignUpPage;
