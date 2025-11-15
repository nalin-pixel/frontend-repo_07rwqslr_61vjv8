import { useEffect, useState } from "react";
import { Mail, Inbox, Send, Archive, Folder, FolderOpen, Bot } from "lucide-react";
import { api } from "../api/client";

export default function Sidebar({ selectedAccount, onSelectAccount, selectedFolder, onSelectFolder }) {
  const [accounts, setAccounts] = useState([]);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    api.getAccounts().then(setAccounts);
    api.getFolders().then((f) => setFolders(["All", ...f]));
  }, []);

  return (
    <aside className="w-full sm:w-72 border-r border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="p-4 flex items-center gap-2 font-semibold text-slate-800">
        <Mail className="w-5 h-5 text-blue-600" />
        Mailbox
      </div>
      <div className="px-3 pb-4 space-y-2">
        <div className="text-xs uppercase tracking-wide text-slate-500 px-2">Accounts</div>
        {accounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => onSelectAccount(acc.address)}
            className={`w-full text-left px-3 py-2 rounded-md transition hover:bg-blue-50 flex items-center justify-between ${
              selectedAccount === acc.address ? "bg-blue-100 text-blue-700" : "text-slate-700"
            }`}
          >
            <span>{acc.address}</span>
            <Bot className="w-4 h-4 text-slate-400" />
          </button>
        ))}

        <div className="text-xs uppercase tracking-wide text-slate-500 px-2 pt-2">Folders</div>
        <nav className="space-y-1">
          {folders.map((f) => {
            const Icon =
              f === "Inbox" ? Inbox : f === "Sent" ? Send : f === "Archive" ? Archive : f === "All" ? FolderOpen : Folder;
            return (
              <button
                key={f}
                onClick={() => onSelectFolder(f)}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2 transition ${
                  selectedFolder === f ? "bg-blue-100 text-blue-700" : "text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{f}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
