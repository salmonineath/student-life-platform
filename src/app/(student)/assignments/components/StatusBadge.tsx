import { STATUS_MAP } from "./StatusMap";

const StatusBadge = ({ status }: { status: string }) => {
  const mapped = STATUS_MAP[status] || "pending";

  const styles: Record<string, string> = {
    pending:   "bg-indigo-50 text-indigo-600 border border-indigo-100",
    completed: "bg-green-50  text-green-600  border border-green-100",
    late:      "bg-red-50    text-red-500    border border-red-100",
  };

  const labels: Record<string, string> = {
    pending:   status.replace("_", " "),
    completed: "Completed",
    late:      "Overdue",
  };

  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${styles[mapped]}`}
    >
      {labels[mapped]}
    </span>
  );
};

export default StatusBadge;