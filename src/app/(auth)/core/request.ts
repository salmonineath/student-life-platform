import axiosInstance from "@/lib/axios";
import {LoginPayload, LoginResponse} from "@/types/authType";

export const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await axiosInstance.post<LoginResponse>("/auth/login", payload);
    return res.data;
}