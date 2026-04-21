import axiosInstance from "@/lib/axios";
import { GetProfileResponse } from "@/types/userType";

export const getProfileRequest = async (): Promise<GetProfileResponse> => {
    const res = await axiosInstance.get<GetProfileResponse>("/me");
    return res.data;
}