import { useEffect, useState } from "react";
import EmailItem from "./EmailItem";
import { api } from "../api/client";

export default function EmailList({ account, folder, label, q, onSelectEmail, selectedId }) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getEmails({ page, pageSize, account, folder, label, q });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [account, folder, label, q]);

  useEffect(() => {
    load();
  }, [page, account, folder, label, q]);

  useEffect(() => {
    const unsub = api.onUpdate(() => load());
    return () => unsub();
  }, [page, account, folder, label, q]);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {loading && (
        <div className="p-4 text-sm text-slate-500">Loading emails…</div>
      )}
      {error && !loading && (
        <div className="p-4 text-sm text-rose-600">{error}</div>
      )}
      {!loading && !error && data.items.length === 0 && (
        <div className="p-6 text-sm text-slate-500">No emails found. Try adjusting filters.</div>
      )}
      <div className="divide-y divide-slate-100 overflow-auto">
        {data.items.map((e) => (
          <EmailItem key={e.id} email={e} onClick={() => onSelectEmail(e.id)} selected={selectedId === e.id} />
        ))}
      </div>
      <div className="p-3 flex items-center justify-between border-t border-slate-100">
        <div className="text-xs text-slate-500">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
