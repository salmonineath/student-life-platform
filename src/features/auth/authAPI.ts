import axiosInstance, { setLoggingOut } from "@/lib/axios";
import { LoginData, RegisterData } from "@/types/authType";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";

export const fetchMeAPI = async () => {
  const res = await axiosInstance.get("/me", {
    withCredentials: true,
  });
  return res.data.data;
};

export const loginAPI = async (data: LoginData) => {
  const res = await axiosInstance.post("/auth/login", data, {
    withCredentials: true,
  });
  await setSessionCookie();
  return res.data.data;
};

export const registerAPI = async (data: RegisterData) => {
  const res = await axiosInstance.post("/auth/register", data, {
    withCredentials: true,
  });
  await setSessionCookie();
  return res.data.data;
};

export const logoutAPI = async () => {
  setLoggingOut(true);

  await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

  // clear frontend session cookie
  await clearSessionCookie();
};
