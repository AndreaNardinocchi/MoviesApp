import React, { useState, createContext, useEffect } from "react";
// import fakeAuth from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextInterface, User } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import { supabase } from "../supabaseClient";
import Spinner from "../components/spinner";

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

    /**
     * Since we have now added the getSession() function, we need to ensure that
     * the 'origin' redirection does occur if 'origin' is there and avoid a fallback to '/'
     * Without the 'if' condition, it won't work
     */
    const origin = location.state?.intent?.pathname;
    if (origin) {
      navigate(origin);
    }
  };

  useEffect(() => {
    /**
     * This async function tries to restore an existing user session on page load or refresh.
     * If a valid session is found, it will `authenticate()` to set user state and token again
     * The session data will be fetched from the localStorage and the session will be resumed.
     */

    async function fetchSession() {
      // https://supabase.com/docs/reference/javascript/auth-getsession
      // https://github.com/orgs/supabase/discussions/32783
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to restore session");
        return;
      }

      console.log("getSession(): ", data.session, error);

      // We create a const variable called 'session'
      const session = data.session;

      // If the session and user of that session exist, then, we will authenticate them again and
      // the session will be restored (authenticate() takes the 2 values as per 'const { user, session } = supabaseData;')
      if (session && session.user) {
        authenticate({ user: session.user, session });
      }
    }

    fetchSession();
  });

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
