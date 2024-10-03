import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const Auth = ({ children }) => {
  //SETS THE USE STATES FOR LOGGING IN AND THE CURRENT USERNAME
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  //LOGIN METHOD SETS THE BOOLEAN TO TRUE AND SETS THE USERNAME
  //ALSO SETS THESE INTO THE SESSION STORAGE
  const login = (username, token) => {
    setIsLoggedIn(true);
    setUsername(username);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("token", token);
  };

  //CLEARS ALL DATA AFTER LOGGING OUT
  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    // GET THE SESSION DATA
    const savedUsername = sessionStorage.getItem("username");
    const savedToken = sessionStorage.getItem("token");

    //LOGGING BACK IN IF THE TOKEN IS STILL FOUND IN SESSION STORAGE
    if (savedUsername && savedToken) {
      login(savedUsername, savedToken);
    } else {
      console.log("User not logged in");
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
