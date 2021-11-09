export enum Token {
  AcessToken = "ACCESS_TOKEN",
  RefreshToken = "REFRESH_TOKEN",
}

export const setToken = (tokenType: Token, token: string) => {
  localStorage.setItem(tokenType, token);
};

export const removeToken = (tokenType: Token) => {
  localStorage.removeItem(tokenType);
};

export const getToken = (tokenType: Token): string | null => {
  return localStorage.getItem(tokenType);
};
