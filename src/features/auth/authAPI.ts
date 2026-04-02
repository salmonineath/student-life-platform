import axiosInstance, { setLoggingOut } from "@/lib/axios";
import { LoginData } from "@/types/authType";

interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  university?: string;
  major?: string;
  academicYear?: string;
}

export const fetchMeAPI = async () => {
  const res = await axiosInstance.get("/me");
  return res.data.data;
};

export const loginAPI = async (data: LoginData) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data.data;
};

export const registerAPI = async (data: RegisterData) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data.data;
};

export const logoutAPI = async () => {
  setLoggingOut(true);
  await axiosInstance.post("/auth/logout");
};
