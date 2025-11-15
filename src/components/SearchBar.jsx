import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { LABELS } from "../api/client";

export default function SearchBar({ account, setAccount, folder, setFolder, label, setLabel, q, setQ, accounts = [], folders = [] }) {
  const [localQ, setLocalQ] = useState(q || "");

  useEffect(() => {
    const t = setTimeout(() => setQ(localQ), 400);
    return () => clearTimeout(t);
  }, [localQ]);

  return (
    <div className="w-full px-3 py-2 border-b border-slate-200 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Search emails..."
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm"><Filter className="w-4 h-4" />Filters</div>
          <select value={account || ""} onChange={(e) => setAccount(e.target.value)} className="text-sm border border-slate-200 rounded-md px-2 py-2">
            <option value="">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.address} value={a.address}>{a.address}</option>
            ))}
          </select>
          <select value={folder || "All"} onChange={(e) => setFolder(e.target.value)} className="text-sm border border-slate-200 rounded-md px-2 py-2">
            {(folders.length ? folders : ["All","Inbox","Sent","Spam","Archive","Custom"]).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select value={label || "All"} onChange={(e) => setLabel(e.target.value)} className="text-sm border border-slate-200 rounded-md px-2 py-2">
            {["All", ...LABELS].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
