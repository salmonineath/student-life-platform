import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function NavControls({ label, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* Today shortcut */}
      <button
        onClick={onToday}
        className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
      >
        Today
      </button>

      {/* Prev / Label / Next */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={onPrev}
          className="p-2 hover:bg-slate-50 transition-colors border-r border-slate-200"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="px-4 text-sm font-semibold text-slate-700 whitespace-nowrap min-w-[200px] text-center">
          {label}
        </span>
        <button
          onClick={onNext}
          className="p-2 hover:bg-slate-50 transition-colors border-l border-slate-200"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
