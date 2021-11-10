import { createContext, ReactChild, useContext, useState } from "react";
import { getAuthActions } from "./auth-services";

export enum AuthStatus {
  NotAuthenticated = "NOT_AUTHENTICATED",
  Authenticated = "AUTHENTICATED",
  AuthenticationLoading = "AUTHENTICATION_LOADING",
}
export interface AuthInfo {
  id?: number;
  username?: string;
  email?: string;
  status: AuthStatus;
}

export interface AuthActions {
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  authenticate: (accessToken: string) => Promise<void>;
}

export type AuthContextType = AuthInfo & AuthActions;

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    status: AuthStatus.AuthenticationLoading,
  });

  const contextValue: AuthContextType = {
    ...authInfo,
    ...getAuthActions(setAuthInfo),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
