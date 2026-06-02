"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { AppDispatch, RootState } from "@/redux/store";
import { getProfileAction, updateProfileAction } from "./core/action";
import { clearUpdateStatus } from "./core/reducer";
import { UpdateProfilePayload } from "@/types/userType";
import {
  GraduationCap,
  Phone,
  BookOpen,
  Building2,
  Calendar,
  Shield,
  Mail,
  SquarePen,
  X,
  Check,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Shimmer({ className }: { className: string }) {
  return (
    <div className={`animate-pulse bg-stone-200 rounded-lg ${className}`} />
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium
        ${type === "success"
          ? "bg-white border-emerald-200 text-emerald-700"
          : "bg-white border-rose-200 text-rose-700"
        }`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
        ${type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}
      >
        {type === "success"
          ? <Check className="w-3.5 h-3.5 text-emerald-600" />
          : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        }
      </div>
      {message}
    </motion.div>
  );
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────

interface EditDrawerProps {
  open: boolean;
  onClose: () => void;
  initial: UpdateProfilePayload;
  updating: boolean;
  onSave: (payload: UpdateProfilePayload) => void;
}

function EditDrawer({ open, onClose, initial, updating, onSave }: EditDrawerProps) {
  const [form, setForm] = useState<UpdateProfilePayload>(initial);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const fields: { key: keyof UpdateProfilePayload; label: string; placeholder: string; icon: React.ReactNode }[] = [
    { key: "fullname",      label: "Full Name",     placeholder: "e.g. Mony Dara",         icon: <User      className="w-4 h-4" /> },
    { key: "phone",         label: "Phone",         placeholder: "e.g. +85512345678",       icon: <Phone     className="w-4 h-4" /> },
    { key: "university",    label: "University",    placeholder: "e.g. RUPP",               icon: <Building2 className="w-4 h-4" /> },
    { key: "major",         label: "Major",         placeholder: "e.g. Computer Science",   icon: <BookOpen  className="w-4 h-4" /> },
    { key: "academic_year", label: "Academic Year", placeholder: "e.g. Year 3",             icon: <Calendar  className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 mb-0.5">
                  Edit
                </p>
                <h2
                  className="text-lg font-bold text-stone-900"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  Update Profile
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1.5">
                    <span className="text-stone-400">{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={(form[f.key] as string) ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-stone-100 flex gap-3">
              <button
                onClick={onClose}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(form)}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : (
                  <><Check className="w-4 h-4" /> Save changes</>
                )}
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error, updating, updateSuccess, updateError } =
    useSelector((state: RootState) => state.profile);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setDrawerOpen(false);
      const t = setTimeout(() => dispatch(clearUpdateStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (updateError) {
      const t = setTimeout(() => dispatch(clearUpdateStatus()), 4000);
      return () => clearTimeout(t);
    }
  }, [updateError, dispatch]);

  function handleSave(payload: UpdateProfilePayload) {
    dispatch(updateProfileAction(payload));
  }

  const editInitial: UpdateProfilePayload = {
    fullname:      profile?.fullname      ?? "",
    phone:         profile?.phone         ?? "",
    university:    profile?.university    ?? "",
    major:         profile?.major         ?? "",
    academic_year: profile?.academicYear  ?? "",
  };

  // ── Error state ──
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-rose-100 rounded-2xl p-8 flex flex-col items-center gap-3 text-center max-w-sm shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-sm font-bold text-stone-800">Failed to load profile</p>
          <p className="text-xs text-stone-500">{error}</p>
          <button
            onClick={() => dispatch(getProfileAction())}
            className="mt-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            Try again →
          </button>
        </div>
      </div>
    );
  }

  const infoFields = [
    { icon: <User      className="w-4 h-4" />, label: "Full Name",     value: profile?.fullname,     accent: "bg-indigo-50 text-indigo-500"  },
    { icon: <Mail      className="w-4 h-4" />, label: "Email",         value: profile?.email,         accent: "bg-sky-50 text-sky-500"        },
    { icon: <Phone     className="w-4 h-4" />, label: "Phone",         value: profile?.phone,         accent: "bg-violet-50 text-violet-500"  },
    { icon: <Building2 className="w-4 h-4" />, label: "University",    value: profile?.university,    accent: "bg-amber-50 text-amber-500"    },
    { icon: <BookOpen  className="w-4 h-4" />, label: "Major",         value: profile?.major,         accent: "bg-emerald-50 text-emerald-500"},
    { icon: <Calendar  className="w-4 h-4" />, label: "Academic Year", value: profile?.academicYear,  accent: "bg-rose-50 text-rose-400"      },
  ];

  return (
    <>
      {/* ── Toast ── */}
      <AnimatePresence>
        {updateSuccess && <Toast key="ok"  message="Profile updated successfully." type="success" />}
        {updateError   && <Toast key="err" message={updateError}                    type="error"   />}
      </AnimatePresence>

      {/* ── Edit Drawer ── */}
      <EditDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editInitial}
        updating={updating}
        onSave={handleSave}
      />

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 mb-1">
          Account
        </p>
        <h1
          className="text-3xl font-bold text-stone-900"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          My Profile
        </h1>
      </motion.div>

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white border border-stone-200/80 rounded-2xl overflow-hidden mb-4 shadow-sm"
      >
        {/* Background gradient strip */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="px-7 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar */}
            {loading ? (
              <div className="w-20 h-20 rounded-2xl bg-stone-200 animate-pulse ring-4 ring-white shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black ring-4 ring-white shrink-0 select-none shadow-md">
                {profile ? getInitials(profile.fullname) : "—"}
              </div>
            )}

            {/* Edit button */}
            <button
              disabled={loading}
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <SquarePen className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              <Shimmer className="h-6 w-48" />
              <Shimmer className="h-4 w-32" />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2
                  className="text-xl font-bold text-stone-900"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {profile?.fullname}
                </h2>
                {profile?.roles?.[0] && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {profile.roles[0]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap">
                {profile?.university && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {profile.university}
                  </span>
                )}
                {profile?.major && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {profile.major}
                  </span>
                )}
                {profile?.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {formatDate(profile.createdAt)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Two-column body ── */}
      <div className="grid grid-cols-12 gap-4">

        {/* ── Left column ── */}
        <div className="col-span-4 flex flex-col gap-4">

          {/* Account stats */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 mb-4">
              Account Details
            </p>

            {[
              { icon: <Shield        className="w-3.5 h-3.5" />, label: "Role",          value: profile?.roles?.[0],   accent: "bg-indigo-50 text-indigo-500"  },
              { icon: <GraduationCap className="w-3.5 h-3.5" />, label: "Academic Year", value: profile?.academicYear,  accent: "bg-violet-50 text-violet-500"  },
              { icon: <Mail          className="w-3.5 h-3.5" />, label: "Email",         value: profile?.email,         accent: "bg-sky-50 text-sky-500"        },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 py-3 ${i < 2 ? "border-b border-stone-100" : ""}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.accent}`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-stone-400 font-medium">{item.label}</p>
                  {loading ? (
                    <Shimmer className="h-3 w-24 mt-1" />
                  ) : (
                    <p className="text-xs font-semibold text-stone-700 truncate capitalize">
                      {item.value || "—"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Edit CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 overflow-hidden shadow-sm"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="relative">
              <p
                className="text-white font-bold text-sm mb-1"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Keep it up to date
              </p>
              <p className="text-indigo-200 text-xs mb-4">
                Complete your profile so classmates can find and connect with you.
              </p>
              <button
                disabled={loading}
                onClick={() => setDrawerOpen(true)}
                className="w-full py-2 rounded-xl bg-white text-indigo-600 text-xs font-bold hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <SquarePen className="w-3.5 h-3.5" />
                Update Profile
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-8 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm"
        >
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 mb-0.5">
              Details
            </p>
            <h3
              className="text-base font-bold text-stone-900"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {infoFields.map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.18 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50/50 transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${field.accent} transition-colors`}>
                  {field.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-stone-400 mb-1">
                    {field.label}
                  </p>
                  {loading ? (
                    <Shimmer className="h-4 w-3/4" />
                  ) : (
                    <p className="text-sm font-semibold text-stone-800 truncate">
                      {field.value || <span className="text-stone-300 font-normal">Not set</span>}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </>
  );
}
