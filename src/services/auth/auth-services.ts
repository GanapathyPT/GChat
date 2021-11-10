import { Dispatch, SetStateAction } from "react";
import { getApiInstance, setAccessToken } from "../../common/APIInstance";
import { setToken, Token } from "../../common/tokenLocalStorage";
import { AuthActions, AuthInfo, AuthStatus } from "./AuthContext";

interface TokenReponse {
  access: string;
  refresh: string;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<TokenReponse> {
  return (
    await getApiInstance().post("auth/register/", {
      username,
      email,
      password,
      confirm_password: password,
    })
  ).data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<TokenReponse> {
  return (
    await getApiInstance().post("auth/token/", {
      email,
      password,
    })
  ).data;
}

export async function getUserDetails(): Promise<AuthInfo> {
  return (await getApiInstance().get("auth/me/")).data;
}

export async function refreshToken(): Promise<Omit<TokenReponse, "refresh">> {
  return (await getApiInstance().get("auth/refresh/")).data;
}

// as we do same for both login and register for now
// writing a single function to pass it there
const saveTokenAndGetUserDetails = async (
  tokens: TokenReponse
): Promise<AuthInfo> => {
  // for further querying
  setAccessToken(tokens.access);

  // for storing login session
  setToken(Token.AcessToken, tokens.access);
  setToken(Token.RefreshToken, tokens.refresh);

  return await getUserDetails();
};

export const getAuthActions = (
  setAuthInfo: Dispatch<SetStateAction<AuthInfo>>
): AuthActions => ({
  login: async (email: string, password: string) => {
    const tokens = await loginUser(email, password);
    const authInfo = await saveTokenAndGetUserDetails(tokens);
    setAuthInfo({ ...authInfo, status: AuthStatus.Authenticated });
  },
  register: async (username: string, email: string, password: string) => {
    const tokens = await registerUser(username, email, password);
    const authInfo = await saveTokenAndGetUserDetails(tokens);
    setAuthInfo({ ...authInfo, status: AuthStatus.Authenticated });
  },
  authenticate: async (accessToken: string | null) => {
    if (accessToken === null) {
      setAuthInfo((info) => ({ ...info, status: AuthStatus.NotAuthenticated }));
      return;
    }
    try {
      setAuthInfo((info) => ({
        ...info,
        status: AuthStatus.AuthenticationLoading,
      }));
      setAccessToken(accessToken);
      const authInfo = await getUserDetails();
      setAuthInfo({ ...authInfo, status: AuthStatus.Authenticated });
    } catch (err) {
      console.error(err);
      try {
        // access token may be expired so refresh and try again once more
        const newAccessToken = await refreshToken();
        setAccessToken(newAccessToken.access);
        const authInfo = await getUserDetails();
        setAuthInfo({ ...authInfo, status: AuthStatus.Authenticated });
      } catch (err) {
        console.error(err);
        // if we still get error
        // refresh token is not valid
        setAuthInfo((info) => ({
          ...info,
          status: AuthStatus.NotAuthenticated,
        }));
      }
    }
  },
});
