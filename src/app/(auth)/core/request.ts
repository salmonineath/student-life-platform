import axiosInstance from "@/lib/axios";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  MeResponse,
  LogoutResponse,
} from "@/types/authType";

export const loginRequest = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", payload);
  return res.data;
};

export const registerRequest = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const res = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return res.data;
};

export const getMeRequest = async (): Promise<MeResponse> => {
  const res = await axiosInstance.get<MeResponse>("/me");
  return res.data;
};

export const requestLogout = async (): Promise<LogoutResponse> => {
  const res = await axiosInstance.post<LogoutResponse>("/auth/logout");
  return res.data;
};
