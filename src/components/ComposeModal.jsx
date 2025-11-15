import { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { api } from "../api/client";

export default function ComposeModal({ open, onClose, defaultFrom, defaultTo = "", defaultSubject = "", defaultBody = "", replyToId }) {
  const [from, setFrom] = useState(defaultFrom || "");
  const [to, setTo] = useState(defaultTo || "");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [body, setBody] = useState(defaultBody || "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setFrom(defaultFrom || "");
      setTo(defaultTo);
      setSubject(defaultSubject);
      setBody(defaultBody);
      setSent(false);
      setError("");
    }
  }, [open, defaultFrom, defaultTo, defaultSubject, defaultBody]);

  const send = async () => {
    try {
      setSending(true); setError("");
      await api.sendEmail({ from, to, subject, body, replyToId });
      setSent(true);
      setTimeout(onClose, 800);
    } catch (e) {
      setError(e.message || "Failed to send");
    } finally { setSending(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b"><div className="font-medium">Compose</div><button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button></div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="border rounded-md px-3 py-2 text-sm" placeholder="From" value={from} onChange={(e)=>setFrom(e.target.value)} />
            <input className="border rounded-md px-3 py-2 text-sm" placeholder="To" value={to} onChange={(e)=>setTo(e.target.value)} />
          </div>
          <input className="border rounded-md px-3 py-2 text-sm w-full" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
          <textarea className="border rounded-md px-3 py-2 text-sm w-full h-64" placeholder="Write your message..." value={body} onChange={(e)=>setBody(e.target.value)} />
          {error && <div className="text-sm text-rose-600">{error}</div>}
          {sent && <div className="text-sm text-emerald-600">Sent!</div>}
        </div>
        <div className="px-4 py-3 border-t flex justify-end">
          <button disabled={sending} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 disabled:opacity-50" onClick={send}><Send className="w-4 h-4"/>Send</button>
        </div>
      </div>
    </div>
  );
}
