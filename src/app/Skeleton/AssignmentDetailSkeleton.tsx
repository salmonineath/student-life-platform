const AssignmentDetailSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-2/3" />
      <div className="h-4 bg-slate-100 rounded w-1/4" />
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="flex gap-3 pt-2">
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
};

export default AssignmentDetailSkeleton;
