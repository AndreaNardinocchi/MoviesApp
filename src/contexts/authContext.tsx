import React, { useState, createContext } from "react";
// import fakeAuth from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextInterface, User } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const [token, setToken] = useState<string | null>(null);

  /**
   * Declare a state variable `user` with a default value "User"
   * `setUser` is the function used to update this state
   * */
  const [user, setUser] = useState<User>({
    firstName: "User",
    lastName: "User",
    email: "user@example.com",
    role: t("viewer"),
  });

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Authenticates the user using Supabase login data and updates the app state.
   * supabaseData is an object containing the authenticated `user` and `session` from Supabase.
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authenticate = async (supabaseData: any) => {
    // Destructure the user and session from the Supabase response.
    // It replaces 'supabaseData.user' and 'supabaseData.session'
    const { user, session } = supabaseData;

    // Destructure the user and session from the Supabase response
    if (!user || !session) {
      console.error("Missing user or session");
      return;
    }

    // Extract the user data from Supabase's user metadata as seen in the console
    // Fallback values are provided in case some fields are missing.
    const newUser: User = {
      firstName: user.user_metadata.first_name || "User",
      lastName: user.user_metadata.last_name || "User",
      email: user.user_metadata.email || "user@example.com",
      role: user.user_metadata.role || t("viewer"), // or assign "viewer" by default
    };

    // Update the user state in the AuthContext
    setUser(newUser);
    // Store the access token for authenticated requests
    // https://supabase.com/docs/reference/javascript/auth-setsession
    setToken(session.access_token || null);

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
