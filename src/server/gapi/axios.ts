"use server";

import axios from "axios";
import { auth } from "../auth";
import { getUserToken } from "./token";

const formsapi = axios.create({
  baseURL: "https://forms.googleapis.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

formsapi.interceptors.request.use(async (config) => {
  const user = (await auth())?.user?.id;
  if (!user) return config;
  const token = await getUserToken(user);
  if (!token) return config;
  console.log(token);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default formsapi;
