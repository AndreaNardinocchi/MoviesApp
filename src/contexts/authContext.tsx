import React, { useState, createContext } from "react";
import fakeAuth from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextInterface, User } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside your functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const [token, setToken] = useState<string | null>(null);

  // Pull user data from localStorage
  const user: User = {
    firstName: localStorage.getItem("userFirstName") || "User",
    lastName: localStorage.getItem("userLastName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
    role: localStorage.getItem("userRole") || t("viewer"),
  };

  const location = useLocation();
  const navigate = useNavigate();

  const authenticate = async (username: string, password: string) => {
    const token = await fakeAuth(username, password);
    setToken(token);
    const origin = location.state?.intent?.pathname || "/";
    navigate(origin);
  };

  const signout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authenticate,
        signout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
