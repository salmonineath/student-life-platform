"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getProfileAction } from "./core/action";
import {
  SquarePen,
  GraduationCap,
  Phone,
  BookOpen,
  Building2,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import UserSkeleton from "@/app/Skeleton/UserSkeleton";

// ── Helpers ──────────────────────────────────────────────
function getInitials(fullname: string): string {
  return fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Main Page ─────────────────────────────────────────────
export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  // ── Error state ──
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 p-8 flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-2xl p-8 flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Failed to load profile</p>
          <p className="text-xs text-stone-400">{error}</p>
          <button
            onClick={() => dispatch(getProfileAction())}
            className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
          >
            Try again →
          </button>
        </div>
      </div>
    );
  }

  const fields = [
    { icon: <GraduationCap className="w-4 h-4" />, label: "Full Name",     value: profile?.fullname     },
    { icon: <Phone         className="w-4 h-4" />, label: "Phone Number",  value: profile?.phone        },
    { icon: <Building2     className="w-4 h-4" />, label: "University",    value: profile?.university   },
    { icon: <BookOpen      className="w-4 h-4" />, label: "Major",         value: profile?.major        },
    { icon: <Calendar      className="w-4 h-4" />, label: "Academic Year", value: profile?.academicYear },
  ];

  return (
      <>

        {/* ── Page title ── */}
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-widest uppercase text-stone-400 mb-1">
            Account
          </p>
          <h1 className="text-4xl font-bold text-stone-900">My Profile</h1>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Left: Identity card ── */}
          <div className="w-64 shrink-0 flex flex-col gap-4">

            {/* Avatar card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              {loading ? (
                <>
                  <UserSkeleton className="w-20 h-20 rounded-full mb-4" />
                  <UserSkeleton className="w-32 h-4 mb-2" />
                  <UserSkeleton className="w-24 h-3 mb-3" />
                  <UserSkeleton className="w-16 h-5 rounded-full" />
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-indigo-50 select-none">
                    {profile ? getInitials(profile.fullname) : "—"}
                  </div>
                  <h2 className="text-base font-bold text-stone-900 leading-tight mb-1">
                    {profile?.fullname}
                  </h2>
                  <p className="text-xs text-stone-400 mb-3">{profile?.major}</p>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                    {profile?.academicYear}
                  </span>
                </>
              )}
            </div>

            {/* Edit button */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <SquarePen className="w-4 h-4" />
              }
              Edit Profile
            </button>

            {/* Quick stats */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400">
                Quick Info
              </p>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400">Role</p>
                  {loading
                    ? <UserSkeleton className="w-20 h-3 mt-1" />
                    : <p className="text-xs font-semibold text-stone-700 capitalize">
                        {profile?.roles?.[0] ?? "—"}
                      </p>
                  }
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400">Academic Year</p>
                  {loading
                    ? <UserSkeleton className="w-16 h-3 mt-1" />
                    : <p className="text-xs font-semibold text-stone-700">
                        {profile?.academicYear ?? "—"}
                      </p>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Info panel ── */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Personal info card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="mb-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
                  Details
                </p>
                <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
              </div>

              <div className="flex flex-col divide-y divide-stone-100">
                {fields.map((field) => (
                  <div key={field.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                      {field.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-stone-400 mb-0.5">{field.label}</p>
                      {loading
                        ? <UserSkeleton className="w-40 h-3.5 mt-1" />
                        : <p className="text-sm font-semibold text-stone-800 truncate">
                            {field.value || "—"}
                          </p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder for future sections */}
            <div className="bg-white border border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[120px]">
              <p className="text-sm font-semibold text-stone-400">More sections coming soon</p>
              <p className="text-xs text-stone-300">Security, preferences, notifications…</p>
            </div>

          </div>
        </div>
      </>
  );
}