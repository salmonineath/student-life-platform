"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  university?: string;
  major?: string;
  academicYear?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/me");
        setUser(res.data.data);
      } catch (err) {
        // interceptor will handle refresh + redirect to login if needed
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (_) {}
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
