import { User } from "@/types/userType";

export interface LoginPayload {
  email_or_username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  academicYear: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface RegisterPayload {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}
