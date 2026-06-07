import axiosInstance from "@/lib/axios";
import { GetProfileResponse, UpdateProfilePayload } from "@/types/userType";
import { ApiResponse } from "@/types/apiResponseType";

export const getProfileRequest = async (): Promise<GetProfileResponse> => {
  const res = await axiosInstance.get<GetProfileResponse>("/me");
  return res.data;
};

export const updateProfileRequest = async (
  payload: UpdateProfilePayload,
): Promise<GetProfileResponse> => {
  const res = await axiosInstance.patch<ApiResponse<GetProfileResponse["data"]>>(
    "/me/update-profile",
    payload,
  );
  return res.data as unknown as GetProfileResponse;
};
