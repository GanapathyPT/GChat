import { createContext, ReactChild, useContext, useState } from "react";
import { getAuthActions } from "./auth-services";

export interface AuthInfo {
  id?: number;
  username?: string;
  email?: string;
}

export interface AuthActions {
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

export type AuthContextType = AuthInfo & AuthActions;

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({});

  const contextValue: AuthContextType = {
    ...authInfo,
    ...getAuthActions(setAuthInfo),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
