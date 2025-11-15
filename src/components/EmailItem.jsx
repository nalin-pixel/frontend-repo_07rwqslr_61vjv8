import { BadgeCheck } from "lucide-react";

const labelColor = (label) => {
  switch (label) {
    case "Interested":
      return "bg-emerald-100 text-emerald-700";
    case "Meeting Booked":
      return "bg-indigo-100 text-indigo-700";
    case "Not Interested":
      return "bg-slate-100 text-slate-600";
    case "Spam":
      return "bg-rose-100 text-rose-700";
    case "Out of Office":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export default function EmailItem({ email, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition ${
        selected ? "bg-slate-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="truncate font-medium text-slate-800 flex-1">{email.subject}</div>
        <div className={`text-[10px] px-2 py-1 rounded-full ${labelColor(email.label)}`}>{email.label}</div>
        <div className="text-xs text-slate-500 shrink-0">{new Date(email.date).toLocaleString()}</div>
      </div>
      <div className="text-xs text-slate-500 truncate">From: {email.from}</div>
      <div className="text-sm text-slate-600 truncate">{email.snippet}</div>
    </button>
  );
}
