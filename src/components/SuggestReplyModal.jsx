import { useEffect, useState } from "react";
import { X, Copy, Reply } from "lucide-react";
import { api } from "../api/client";

export default function SuggestReplyModal({ open, onClose, emailId, onReply }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!open || !emailId) return;
      try {
        setLoading(true); setError("");
        const res = await api.suggestReplies(emailId);
        setSuggestions(res);
      } catch (e) { setError(e.message || "Failed to fetch suggestions"); }
      finally { setLoading(false); }
    };
    run();
  }, [open, emailId]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b"><div className="font-medium">AI Reply Suggestions</div><button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button></div>
        <div className="p-4 space-y-3">
          {loading && <div className="text-sm text-slate-500">Generating suggestions…</div>}
          {error && <div className="text-sm text-rose-600">{error}</div>}
          {!loading && !error && suggestions.map((s, i) => (
            <div key={i} className="border rounded-md p-3 bg-slate-50">
              <p className="text-sm whitespace-pre-wrap">{s}</p>
              <div className="mt-2 flex gap-2">
                <button className="px-2 py-1 text-xs border rounded-md flex items-center gap-1" onClick={() => navigator.clipboard.writeText(s)}><Copy className="w-3 h-3"/>Copy</button>
                <button className="px-2 py-1 text-xs border rounded-md flex items-center gap-1" onClick={() => onReply(s)}><Reply className="w-3 h-3"/>Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
