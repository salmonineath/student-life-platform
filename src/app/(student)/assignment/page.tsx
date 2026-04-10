"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Plus, Calendar, BookOpen, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignments } from "@/features/assignment/assignmentSlice";
import { RootState, AppDispatch } from "@/store/store";

export default function AssignmentPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { assignments, loading, error } = useSelector(
    (state: RootState) => state.assignment
  );

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Assignments</h1>
        <Link
          href="/assignment/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          <Plus size={20} />
          Create New Assignment
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && assignments.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <BookOpen className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-700 mb-2">No assignments yet</h3>
          <p className="text-slate-500 mb-6">Create your first assignment to get started</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && assignments.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                  {assignment.title}
                </h3>
                <p className="text-blue-600 font-medium mt-1">{assignment.subject}</p>
              </div>

              <p className="text-slate-600 text-sm line-clamp-3 mb-5">
                {assignment.description}
              </p>

              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Calendar size={16} />
                <span>Due: {formatDate(assignment.due_date)}</span>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-sm font-medium transition">
                  <Edit2 size={16} />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-medium transition">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}