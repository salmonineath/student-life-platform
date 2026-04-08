"use client";

import { useParams } from "next/navigation";

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Assignment Detail
      </h1>

      <p className="text-slate-600">
        Assignment ID: <span className="font-semibold">{id}</span>
      </p>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-700">
          Here you will show assignment info from API.
        </p>
      </div>
    </div>
  );
}