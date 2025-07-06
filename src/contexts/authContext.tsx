import React, { useState, createContext } from "react";
import fakeAuth from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextInterface, User } from "../types/interfaces";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [token, setToken] = useState<string | null>(null);

  // Pull user data from localStorage
  const user: User = {
    firstName: localStorage.getItem("userFirstName") || "User",
    lastName: localStorage.getItem("userLastName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
    role: localStorage.getItem("userRole") || "Viewer",
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
