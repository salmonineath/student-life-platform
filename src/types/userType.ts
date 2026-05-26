export interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  university?: string;
  major?: string;
  academicYear?: string;
}

export interface UserProfile {
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
 
export interface GetProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: UserProfile;
}