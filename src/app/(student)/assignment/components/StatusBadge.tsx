import { STATUS_MAP } from "./StatusMap";

const StatusBadge = ({ status }: { status: string }) => {
  const mapped = STATUS_MAP[status] || "pending";
  const styles = {
    pending: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    late: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${styles[mapped as keyof typeof styles]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;
