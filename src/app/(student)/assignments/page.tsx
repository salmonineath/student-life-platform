"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import {
  Plus, Search, Sparkles, BookOpen,
  CheckCircle2, AlertTriangle, BarChart2, SlidersHorizontal,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteAssignmentAction, getMyAssignmentAction } from "./core/action";
import AssignmentModal from "./modal/AssignmentModal";
import EditAssignmentModal from "./modal/EditAssignmentModal";
import DeleteModal from "../components/DeleteModal";
import AssignmentCard from "./components/AssignmentCard";
import { Assignments } from "@/types/assignmentType";
import { STATUS_MAP } from "./components/StatusMap";

type Filter = "all" | "pending" | "completed" | "late";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",       label: "All"    },
  { key: "pending",   label: "Active" },
  { key: "completed", label: "Done"   },
  { key: "late",      label: "Late"   },
];

function CardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 border-l-4 border-l-stone-200 rounded-2xl p-5 h-64 animate-pulse">
      <div className="flex justify-between gap-2 mb-3">
        <div className="h-4 bg-stone-100 rounded w-2/3" />
        <div className="h-5 bg-stone-100 rounded w-16" />
      </div>
      <div className="h-3 bg-stone-100 rounded w-20 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-stone-100 rounded" />
        <div className="h-3 bg-stone-100 rounded w-4/5" />
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-2 bg-stone-100 rounded" />
        <div className="h-1.5 bg-stone-100 rounded-full" />
      </div>
      <div className="h-8 bg-stone-100 rounded-xl mt-auto" />
    </div>
  );
}

export default function AssignmentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );

  const [filter, setFilter]                     = useState<Filter>("all");
  const [query, setQuery]                       = useState("");
  const [createModalOpen, setCreateModalOpen]   = useState(false);
  const [deleteModalOpen, setDeleteModalOpen]   = useState(false);
  const [selectedId, setSelectedId]             = useState<number | null>(null);
  const [editAssignment, setEditAssignment]     = useState<Assignments | null>(null);

  useEffect(() => {
    dispatch(getMyAssignmentAction());
  }, [dispatch]);

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((a) => {
        const mapped = STATUS_MAP[a.status] || "pending";
        if (filter === "all") return true;
        return mapped === filter;
      })
      .filter((a) =>
        query.trim()
          ? (a.title + " " + a.subject + " " + (a.description ?? ""))
              .toLowerCase()
              .includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [assignments, filter, query]);

  const stats = useMemo(() => {
    const total     = assignments.length;
    const completed = assignments.filter((a) => a.status === "COMPLETED").length;
    const overdue   = assignments.filter((a) => STATUS_MAP[a.status] === "late").length;
    const avg       = total > 0
      ? Math.round(assignments.reduce((s, a) => s + (a.progress || 0), 0) / total)
      : 0;
    return { total, completed, overdue, avg };
  }, [assignments]);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await dispatch(deleteAssignmentAction(selectedId)).unwrap();
      setDeleteModalOpen(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Failed to delete assignment", err);
    }
  };

  const statCards = [
    {
      label:      "Total",
      value:      stats.total,
      icon:       <BookOpen className="w-4 h-4" />,
      iconBg:     "bg-indigo-100",
      iconColor:  "text-indigo-600",
      valueColor: "text-indigo-600",
    },
    {
      label:      "Completed",
      value:      stats.completed,
      icon:       <CheckCircle2 className="w-4 h-4" />,
      iconBg:     "bg-emerald-100",
      iconColor:  "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label:      "Overdue",
      value:      stats.overdue,
      icon:       <AlertTriangle className="w-4 h-4" />,
      iconBg:     "bg-red-100",
      iconColor:  "text-red-500",
      valueColor: "text-red-500",
    },
    {
      label:      "Avg Progress",
      value:      `${stats.avg}%`,
      icon:       <BarChart2 className="w-4 h-4" />,
      iconBg:     "bg-amber-100",
      iconColor:  "text-amber-600",
      valueColor: "text-stone-800",
    },
  ];

  const subtitle = stats.overdue > 0
    ? <><span className="font-semibold text-red-500">{stats.overdue} overdue</span> — take care of them first.</>
    : stats.total === 0
    ? "Start strong — create your first assignment."
    : <><span className="font-semibold text-emerald-500">{stats.completed} completed</span> — keep the momentum going.</>;

  return (
    <>
      {/* ── Sticky Header ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-5 bg-gray-100"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-stone-400 mb-1.5">
              Assignments
            </p>
            <h1
              className="text-[1.9rem] font-bold text-stone-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              My Assignments
            </h1>
            <p className="text-sm text-stone-500 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        </div>
      </motion.header>

      <main className="space-y-7 mt-8">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-stone-200 rounded-2xl px-5 py-5 flex items-center gap-4 hover:shadow-md hover:shadow-stone-100 transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-black tabular-nums leading-none ${s.valueColor}`}>
                  {s.value}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-1">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Search + Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, subject, or description…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex bg-white border border-stone-200 rounded-xl p-1 gap-1 shrink-0">
            <div className="flex items-center pl-2 pr-1 text-stone-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  filter === f.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                }`}
              >
                {f.label}
                {f.key !== "all" && (
                  <span className={`ml-1.5 text-[10px] tabular-nums ${filter === f.key ? "text-indigo-200" : "text-stone-400"}`}>
                    {f.key === "pending"   ? assignments.filter((a) => STATUS_MAP[a.status] === "pending").length
                    : f.key === "completed" ? stats.completed
                    : stats.overdue}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-100 text-red-600 text-sm p-5 rounded-2xl"
          >
            {error}
          </motion.div>
        ) : filteredAssignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-dashed border-stone-200 rounded-2xl py-20 flex flex-col items-center text-center"
          >
            {/* Decorative rings */}
            <div className="relative mb-5">
              <div className="absolute inset-0 -m-4 rounded-full border-2 border-dashed border-indigo-100 animate-[spin_18s_linear_infinite]" />
              <div className="absolute inset-0 -m-8 rounded-full border border-dashed border-stone-100 animate-[spin_26s_linear_infinite_reverse]" />
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center relative">
                {assignments.length === 0
                  ? <Sparkles className="w-7 h-7 text-indigo-400" />
                  : <BookOpen className="w-7 h-7 text-indigo-400" />
                }
              </div>
            </div>

            <h3 className="text-base font-bold text-stone-800 mb-1.5" style={{ fontFamily: "var(--font-sora)" }}>
              {assignments.length === 0 ? "Start your study journey" : "Nothing matches"}
            </h3>
            <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
              {assignments.length === 0
                ? "Create your first assignment, set a deadline, and track your progress toward completion."
                : "No assignments match your current filter or search query."}
            </p>

            {assignments.length === 0 && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" /> Create Assignment
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment, i) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                index={i}
                onDeleteClick={handleDeleteClick}
                onEditClick={setEditAssignment}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment"
        description="This will also delete the linked schedule. This action cannot be undone."
      />
      {createModalOpen && (
        <AssignmentModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            dispatch(getMyAssignmentAction());
            setCreateModalOpen(false);
          }}
        />
      )}
      {editAssignment && (
        <EditAssignmentModal
          assignment={editAssignment}
          onClose={() => setEditAssignment(null)}
          onSuccess={() => setEditAssignment(null)}
        />
      )}
    </>
  );
}
