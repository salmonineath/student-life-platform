"use client";

import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";

interface Props {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
  isDeleting = false,
}: Props) {
  // Controls the CSS transition — starts false so the enter animation fires on mount
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay lets the browser paint the hidden state first,
    // so the transition actually plays
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  function handleCancel() {
    // Animate out before calling parent's onCancel
    setVisible(false);
    setTimeout(onCancel, 200);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-200
        ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200
          ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleCancel}
      />

      {/* Dialog — slides up slightly on enter */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6
          transition-all duration-200
          ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
      >
        {/* Close */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>

        {/* Content */}
        <h3 className="text-center text-slate-900 font-semibold text-lg">
          Delete Schedule
        </h3>
        <p className="text-center text-slate-500 text-sm mt-2 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-700">"{title}"</span>? This
          action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
              text-slate-700 font-medium text-sm hover:bg-slate-50
              transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600
              text-white font-medium text-sm transition-colors
              disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
