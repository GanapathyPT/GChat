import { Dispatch, SetStateAction } from "react";
import { getApiInstance, setAccessToken } from "../../common/APIInstance";
import { setToken, Token } from "../../common/tokenLocalStorage";
import { AuthActions, AuthInfo } from "./AuthContext";

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

// as we do same for both login and register for now
// writing a single function to pass it there
const authenticate = async (tokens: TokenReponse): Promise<AuthInfo> => {
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
    const authInfo = await authenticate(tokens);
    setAuthInfo(authInfo);
  },
  register: async (username: string, email: string, password: string) => {
    const tokens = await registerUser(username, email, password);
    const authInfo = await authenticate(tokens);
    setAuthInfo(authInfo);
  },
});
