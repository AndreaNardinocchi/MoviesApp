import React, { useState, createContext } from "react";
import fakeAuth from "../util";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextInterface } from "../types/interfaces";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [token, setToken] = useState<string | null>(null);
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

    // localStorage.removeItem("userName");
    // localStorage.removeItem("userEmail");
    // localStorage.removeItem("userPassword");

    // localStorage.removeItem("User email");
    // localStorage.removeItem("password");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        authenticate,
        signout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
