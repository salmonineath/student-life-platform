"use client";

import { useEffect } from "react";
import { SquarePen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hook/useAuth";
import { fetchMe } from "@/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // only fetch if user not already loaded
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch, user]);

  if (loading) {
    return <p className="p-6 text-slate-500">Loading profile...</p>;
  }

  if (!user) {
    return <p className="p-6 text-red-500">Failed to load user.</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg">
          {user.fullname?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {user.fullname}
          </h2>
          <p className="text-sm text-slate-500">{user.academicYear}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-700">Personal Information</h2>

          <button className="flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md">
            <SquarePen className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-slate-400">Fullname</p>
            <p className="font-medium">{user.fullname}</p>
          </div>

          <div>
            <p className="text-slate-400">Phone Number</p>
            <p className="font-medium">{user.phone || "-"}</p>
          </div>

          <div>
            <p className="text-slate-400">University</p>
            <p className="font-medium">{user.university || "-"}</p>
          </div>

          <div>
            <p className="text-slate-400">Major</p>
            <p className="font-medium">{user.major || "-"}</p>
          </div>

          <div>
            <p className="text-slate-400">Academic Year</p>
            <p className="font-medium">{user.academicYear || "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
