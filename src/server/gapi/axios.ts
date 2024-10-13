import axios, { type InternalAxiosRequestConfig } from "axios";
import { auth } from "../auth";
import { getUserToken } from "./token";

const formsapi = axios.create({
  baseURL: "https://forms.googleapis.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const driveapi = axios.create({
  baseURL: "https://www.googleapis.com/drive/v3/files",
  headers: {
    "Content-Type": "application/json",
  },
});

async function addToken(config: InternalAxiosRequestConfig) {
  const user = (await auth())?.user?.id;
  if (!user) return config;
  const token = await getUserToken(user);
  console.log(token);
  if (!token) return config;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}

formsapi.interceptors.request.use(addToken);

driveapi.interceptors.request.use(addToken);

const gapi = {
  formsapi,
  driveapi,
};

export default gapi;
