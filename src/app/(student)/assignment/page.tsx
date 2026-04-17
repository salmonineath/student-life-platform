"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, GraduationCap, Search, Sparkles, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteAssignmentAction, getMyAssignmentAction } from "./core/action";
import AssignmentModal from "./modal/AssignmentModal";
import DeleteModal from "../components/DeleteModal";
import AssignmentCard from "./components/AssignmentCard";
import { STATUS_MAP } from "./components/StatusMap";

type Filter = "all" | "pending" | "completed" | "late"; // map your statuses accordingly

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

  useEffect(() => {
    dispatch(getMyAssignmentAction());
  }, [dispatch]);

  // Filter + search + sort (by due date)
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

  // Stats
  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(
      (a) => a.status === "COMPLETED",
    ).length;
    const overdue = assignments.filter(
      (a) => STATUS_MAP[a.status] === "late",
    ).length;
    const avg =
      total > 0
        ? Math.round(
            assignments.reduce((sum, a) => sum + (a.progress || 0), 0) / total,
          )
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">My Assignments</h1>
          <p className="text-md text-muted-foreground hidden sm:block">
            Track assignments, beat deadlines.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          <Plus size={20} />
          New Assignment
        </button>
      </header>

      <main className="py-6 space-y-6">
        {/* ReminderBanner — you can implement later or leave empty */}
        {/* <ReminderBanner items={assignments} /> */}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-primary" },
            {
              label: "Completed",
              value: stats.completed,
              color: "text-success",
            },
            {
              label: "Overdue",
              value: stats.overdue,
              color: "text-destructive",
            },
            {
              label: "Avg progress",
              value: `${stats.avg}%`,
              color: "text-foreground",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft"
            >
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments…"
              className="w-full pl-9 bg-card border border-border/60 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex bg-card border border-border/60 rounded-xl p-1">
            {(["all", "pending", "completed", "late"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "pending"
                    ? "Active"
                    : f === "completed"
                      ? "Done"
                      : "Late"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border/60 rounded-2xl p-6 animate-pulse h-80"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-2xl">
            {error}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-gradient-soft p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              {assignments.length === 0 ? (
                <Sparkles className="h-6 w-6" />
              ) : (
                <BookOpen className="h-6 w-6" />
              )}
            </div>
            <h3 className="mt-4 font-semibold text-lg">
              {assignments.length === 0
                ? "Start your study journey"
                : "Nothing here"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              {assignments.length === 0
                ? "Create your first assignment, set a deadline, and let the AI assistant build a study plan for you."
                : "No assignments match your current filter or search."}
            </p>
            {assignments.length === 0 && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-5 bg-gradient-primary text-primary-foreground hover:opacity-90 px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" /> Create assignment
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
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
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
    </div>
  );
}
