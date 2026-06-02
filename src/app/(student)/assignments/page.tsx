"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Plus, Search, Sparkles, BookOpen } from "lucide-react";
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

export default function AssignmentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editAssignment, setEditAssignment] = useState<Assignments | null>(null);

  useEffect(() => {
    dispatch(getMyAssignmentAction());
  }, [dispatch]);

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((a) => {
        const mappedStatus = STATUS_MAP[a.status] || "pending";
        if (filter === "all") return true;
        return mappedStatus === filter;
      })
      .filter((a) =>
        query.trim()
          ? (a.title + " " + a.subject + " " + a.description)
              .toLowerCase()
              .includes(query.toLowerCase())
          : true,
      )
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );
  }, [assignments, filter, query]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === "COMPLETED").length;
    const overdue = assignments.filter((a) => STATUS_MAP[a.status] === "late").length;
    const avg =
      total > 0
        ? Math.round(assignments.reduce((sum, a) => sum + (a.progress || 0), 0) / total)
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
    { label: "Total",        value: stats.total,      valueClass: "text-indigo-600"  },
    { label: "Completed",    value: stats.completed,  valueClass: "text-green-600"   },
    { label: "Overdue",      value: stats.overdue,    valueClass: "text-red-500"     },
    { label: "Avg Progress", value: `${stats.avg}%`,  valueClass: "text-stone-800"   },
  ];

  const filters: { key: Filter; label: string }[] = [
    { key: "all",       label: "All"    },
    { key: "pending",   label: "Active" },
    { key: "completed", label: "Done"   },
    { key: "late",      label: "Late"   },
  ];

  return (
    <>

      {/* ── Sticky Header ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-5 bg-gray-100 flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium text-stone-600 tracking-widest uppercase mb-1.5">
            Assignments
          </p>
          <h1
            className="text-[1.9rem] font-bold text-stone-900 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            My Assignments
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {stats.overdue > 0 ? (
              <>You have <span className="font-semibold text-red-500">{stats.overdue} overdue</span> — don&apos;t let them slip.</>
            ) : stats.total > 0 ? (
              <>Looking good — <span className="font-semibold text-green-500">{stats.completed} completed</span> so far.</>
            ) : (
              <>Start strong — create your first assignment.</>
            )}
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </motion.header>

      <main className="space-y-6 mt-6">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-stone-200 rounded-2xl px-5 py-4 hover:shadow-md hover:shadow-stone-100 transition-shadow"
            >
              <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-600 mb-1">
                {s.label}
              </p>
              <p className={`text-3xl font-bold ${s.valueClass}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex bg-white border border-stone-200 rounded-xl p-1 gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  filter === f.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-stone-200 rounded-2xl p-6 animate-pulse h-72"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-5 rounded-2xl">
            {error}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-200 rounded-2xl p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              {assignments.length === 0
                ? <Sparkles className="w-6 h-6 text-indigo-500" />
                : <BookOpen className="w-6 h-6 text-indigo-500" />
              }
            </div>
            <h3 className="text-base font-bold text-stone-800 mb-1">
              {assignments.length === 0 ? "Start your study journey" : "Nothing here"}
            </h3>
            <p className="text-sm text-stone-600 max-w-sm">
              {assignments.length === 0
                ? "Create your first assignment, set a deadline, and track your progress."
                : "No assignments match your current filter or search."}
            </p>
            {assignments.length === 0 && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" /> Create assignment
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
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