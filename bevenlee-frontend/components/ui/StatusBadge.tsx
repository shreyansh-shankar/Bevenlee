interface Props {
  status: "planned" | "active" | "paused" | "completed";
}

const statusStyles: Record<Props["status"], string> = {
  planned: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  active: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-md capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
