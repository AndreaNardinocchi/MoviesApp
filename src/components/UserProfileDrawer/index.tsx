import React, { useContext } from "react";
// https://mui.com/material-ui/react-drawer/
// https://mui.com/material-ui/react-divider/
// https://www.codingeasypeasy.com/blog/mastering-material-ui-drawer-a-comprehensive-guide-with-examples
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";

// Props expected by the UserProfileDrawer component
interface UserProfileDrawerProps {
  // Whether the drawer is open or not. It is controlled by the parent siteHeader
  open: boolean;
  // Function to close the drawer. Called when the user clicks outside or on the close button.
  onClose: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  open,
  onClose,
}) => {
  const auth = useContext(AuthContext);

  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  // Fallback user info from localStorage if context doesn't have it
  const userFirstName = localStorage.getItem("userFirstName") || "User";
  const userLastName = localStorage.getItem("userLastName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userRole = localStorage.getItem("userRole") || t("viewer");

  // Destructure signout safely
  const signout = auth?.signout;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320, padding: 3 } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">
          {/* User Profile */}
          {t("user_profile")}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close drawer">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          {/* Name: */}
          {t("name_user")}:
        </Typography>
        <Typography variant="body1">
          {/* Display first and last name from context if available. 
          Fallback to localStorage if context data is missing. */}
          {auth?.user?.firstName || userFirstName}{" "}
          {auth?.user?.lastName || userLastName}
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          {/* Email: */}
          {t("email")}:
        </Typography>
        <Typography variant="body1">
          {/* Display email from context if available. 
          Fallback to localStorage if context data is missing. */}
          {auth?.user?.email || userEmail}
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          {/* Role: */}
          {t("role")}:
        </Typography>
        <Typography variant="body1">
          {/* Display role from context if available. 
          Fallback to localStorage if context data is missing. */}
          {auth?.user?.role || userRole}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Button
        variant="contained"
        sx={{
          bgcolor: "#8E4585",
          color: "#ffffff",
        }}
        startIcon={<LogoutIcon />}
        fullWidth
        onClick={() => {
          if (signout) signout();
          onClose();
        }}
      >
        {/* Log Out */}
        {t("log_out")}
      </Button>
    </Drawer>
  );
};

export default UserProfileDrawer;
