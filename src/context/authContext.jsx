import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    const fetchLocalData = () => {
      setToken(localStorage.getItem("token"));
    };

    fetchLocalData();
    setIsLoaded(true);
  }, []);

  const login = (user) => {
    setUser(user);
    setToken(user.accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.accessToken);
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {isLoaded ? children : null}
    </AuthContext.Provider>
  );
};
