import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const Auth = ({ children }) => {

  //SETS THE USE STATES FOR LOGGING IN AND THE CURRENT USERNAME
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');


  //LOGIN METHOD SETS THE BOOLEAN TO TRUE AND SETS THE USERNAME
  //ALSO SETS THESE INTO THE SESSION STORAGE
  const login = (username, token) => {

    setIsLoggedIn(true);
    setUsername(username);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('token', token);

  };


  //CLEARS ALL DATA AFTER LOGGING OUT
  const logout = () => {

    setIsLoggedIn(false);
    setUsername('');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');

  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};