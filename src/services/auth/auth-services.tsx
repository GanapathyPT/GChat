import axios, { CancelTokenSource } from "axios";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { SearchProps, SearchResultData } from "semantic-ui-react";
import { getApiInstance, setAccessToken } from "../../common/APIInstance";
import { getToken, setToken, Token } from "../../common/tokenLocalStorage";
import { addNewRoom, useChat, User } from "../chat/chat-service";
import { AuthActions, AuthInfo, AuthStatus, useAuth } from "./AuthContext";

interface TokenReponse {
  access: string;
  refresh: string;
}

async function registerUser(
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

async function loginUser(
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

async function getUserDetails(): Promise<AuthInfo> {
  return (await getApiInstance().get("auth/me/")).data;
}

async function refreshToken(
  refresh: string
): Promise<Omit<TokenReponse, "refresh">> {
  return (
    await getApiInstance().post("auth/refresh/", {
      refresh,
    })
  ).data;
}

async function searchUser(username: string): Promise<User[]> {
  return (await getApiInstance().get(`auth/search/?username=${username}`)).data;
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
        const refresh = getToken(Token.RefreshToken);
        if (refresh === null) return;
        // access token may be expired so refresh and try again once more
        const newAccessToken = await refreshToken(refresh);
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

// cancel token storage
let cancelTokenSource: CancelTokenSource | undefined;

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

export function useUserSearch() {
  const { id } = useAuth();
  const { addRoom } = useChat();
  const [searchText, setSearchText] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  const getUsers = async (query: string): Promise<SearchResult[]> => {
    // if already a request is there cancel it
    if (cancelTokenSource !== undefined) cancelTokenSource.cancel();

    cancelTokenSource = axios.CancelToken.source();
    const users = await searchUser(query);
    return users
      .filter((user) => user.id !== id)
      .map((user) => ({
        id: user.id,
        title: user.username,
        description: user.email,
      }));
  };

  const onSearchChange = async (
    e: MouseEvent<HTMLElement>,
    data: SearchProps
  ) => {
    if (data.value) {
      setSearchText(data.value);
      setSearchLoading(true);
      const users = await getUsers(data.value);
      setSearchResult(users);
      setSearchLoading(false);
    } else setSearchText("");
  };

  const onResultSelect = async (
    event: MouseEvent<HTMLDivElement>,
    data: SearchResultData
  ) => {
    const user = data.result.id as number;
    const newRoom = await addNewRoom([user]);
    addRoom(newRoom);
    setSearchResult([]);
    setSearchText("");
  };

  return {
    onSearchChange,
    onResultSelect,
    searchLoading,
    searchResult,
    searchText,
  };
}
