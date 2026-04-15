"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Calendar, BookOpen, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteAssignmentAction, getMyAssignmentAction } from "./core/action";
import AssignmentModal from "./modal/AssignmentModal";
import DeleteModal from "../components/DeleteModal";

function AssignmentCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="h-4 bg-slate-100 rounded w-2/5" />
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function AssignmentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    dispatch(getMyAssignmentAction());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedAssignmentId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteClick = async () => {
    if (!selectedAssignmentId) return;

    try {
      await dispatch(deleteAssignmentAction(selectedAssignmentId)).unwrap();

      console.log("Assignment deleted successfully");

      setDeleteModalOpen(false);
      setSelectedAssignmentId(null);
    } catch (error) {
      console.log("Failed to delete assignment", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Assignments</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          <Plus size={20} />
          Create New Assignment
        </button>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AssignmentCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && assignments.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <BookOpen className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-700 mb-2">
            No assignments yet
          </h3>
          <p className="text-slate-500 mb-6">
            Create your first assignment to get started
          </p>
        </div>
      )}

      {!loading && !error && assignments.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
            >
              <Link href={`/assignment/${assignment.id}`}>
                <div className="mb-4 cursor-pointer">
                  <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                    {assignment.title}
                  </h3>
                  <p className="text-blue-600 font-medium mt-1">
                    {assignment.subject}
                  </p>
                </div>
              </Link>
              <p className="text-slate-600 text-sm line-clamp-3 mb-5">
                {assignment.description}
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Calendar size={16} />
                <span>Due: {formatDate(assignment.dueDate)}</span>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-sm font-medium transition">
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(assignment.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-medium transition"
                >
                  <Trash2 size={16} /> Delete
                </button>

                <DeleteModal
                  isOpen={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  onConfirm={handleConfirmDeleteClick}
                  title="Delete Assignment"
                  description="This action cannot be undone."
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {createModalOpen && (
        <AssignmentModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => dispatch(getMyAssignmentAction())}
        />
      )}
    </div>
  );
}
