import { useEffect, useMemo, useState } from "react";
import { Tag, Reply, Sparkles } from "lucide-react";
import { api, LABELS } from "../api/client";
import SuggestReplyModal from "./SuggestReplyModal";
import ComposeModal from "./ComposeModal";

export default function EmailDetail({ emailId }) {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const [prefillBody, setPrefillBody] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!emailId) return;
      try {
        setLoading(true); setError("");
        const e = await api.getEmailById(emailId);
        setEmail(e);
        setLabel(e?.label || "");
      } catch (err) { setError(err.message || "Failed to load email"); }
      finally { setLoading(false); }
    };
    load();
  }, [emailId]);

  const onChangeLabel = async (l) => {
    try {
      setLabel(l);
      await api.updateLabel(emailId, l);
    } catch (e) {
      setError(e.message || "Failed to update label");
    }
  };

  const onReplyWith = (text) => {
    setPrefillBody(`\n\n> ${email?.body?.split("\n").join("\n> ") || ""}\n\n${text}`);
    setOpenSuggest(false);
    setOpenCompose(true);
  };

  if (!emailId) return (
    <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Select an email to view details</div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {loading && <div className="p-4 text-sm text-slate-500">Loading…</div>}
      {error && !loading && <div className="p-4 text-sm text-rose-600">{error}</div>}
      {!loading && email && (
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <div className="text-xl font-semibold text-slate-800">{email.subject}</div>
            <div className="text-sm text-slate-500">From: {email.from} • {new Date(email.date).toLocaleString()}</div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400"/>
              <select value={label} onChange={(e)=>onChangeLabel(e.target.value)} className="text-sm border rounded-md px-2 py-1">
                {LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={() => setOpenSuggest(true)} className="px-3 py-1.5 text-sm rounded-md border flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500"/>Suggest Reply</button>
            <button onClick={() => setOpenCompose(true)} className="px-3 py-1.5 text-sm rounded-md border flex items-center gap-2"><Reply className="w-4 h-4"/>Reply</button>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-slate-800 text-sm bg-white border rounded-md p-4">{email.body}</pre>
          </div>
          <div className="text-xs text-slate-500 border-t pt-3">
            <div className="font-medium mb-1">Metadata</div>
            {Object.entries(email.headers || {}).map(([k,v]) => (
              <div key={k}><span className="text-slate-400">{k}:</span> {String(v)}</div>
            ))}
          </div>
        </div>
      )}
      <SuggestReplyModal open={openSuggest} onClose={()=>setOpenSuggest(false)} emailId={emailId} onReply={onReplyWith} />
      <ComposeModal open={openCompose} onClose={()=>setOpenCompose(false)} defaultFrom={email?.account} defaultTo={email?.from} defaultSubject={`Re: ${email?.subject || ""}`} defaultBody={prefillBody} replyToId={emailId} />
    </div>
  );
}
