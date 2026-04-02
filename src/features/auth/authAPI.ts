import axiosInstance, { setLoggingOut } from "@/lib/axios";
import { LoginData } from "@/types/authType";
import { RegisterData } from "@/types/authType";
import { setSessionCookie } from "@/lib/session";

export const fetchMeAPI = async () => {
  const res = await axiosInstance.get("/me");
  return res.data.data;
};

export const loginAPI = async (data: LoginData) => {
  const res = await axiosInstance.post("/auth/login", data);
  await setSessionCookie();
  return res.data.data;
};

export const registerAPI = async (data: RegisterData) => {
  const res = await axiosInstance.post("/auth/register", data);
  await setSessionCookie();
  return res.data.data;
};

export const logoutAPI = async () => {
  setLoggingOut(true);
  await axiosInstance.post("/auth/logout");
  await setSessionCookie();
};
