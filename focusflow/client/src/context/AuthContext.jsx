import { createContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((userData, accessTok, refreshTok) => {
    setUser(userData);
    setAccessToken(accessTok);
    setRefreshToken(refreshTok);
    localStorage.setItem('accessToken', accessTok);
    localStorage.setItem('refreshToken', refreshTok);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser({ ...user, ...userData });
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  }, [user]);

  const value = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    setIsLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
