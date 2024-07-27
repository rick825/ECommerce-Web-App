import React, { createContext, useContext, useEffect, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const getDataFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage`, error);
      return defaultValue;
    }
  };

  const [loggedInUser, setLoggedInUser] = useState(() => getDataFromStorage('loggedInUser', ''));
  const [loggedIn, setLoggedIn] = useState(() => getDataFromStorage('loginStatus', false));

  useEffect(() => {
    localStorage.setItem('loginStatus', loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    console.log("in context",loggedInUser);
  }, [loggedInUser]);

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn, loggedInUser, setLoggedInUser }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginStatus = () => useContext(LoginContext);
