import { User } from "@/types/userType";

export interface LoginData {
  email_or_username: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
