import axios from "axios";
import { constants } from "./constants";

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const removeAccessToken = (token: string) => {
  accessToken = "";
};

export const getApiInstance = () =>
  axios.create({
    baseURL: constants.baseURL,
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
