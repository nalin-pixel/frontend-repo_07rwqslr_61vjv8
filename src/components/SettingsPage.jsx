import { useState } from "react";
import { Link2, Send, Save } from "lucide-react";
import { api } from "../api/client";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    try { setSaving(true); setError(""); setSaved(false);
      await api.saveSettings({ webhookUrl, bookingLink });
      setSaved(true);
    } catch (e) { setError(e.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const testSlack = async () => {
    try { setTesting(true); setError("");
      await api.testSlack();
    } catch (e) { setError(e.message || "Failed to test Slack"); }
    finally { setTesting(false); }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-lg font-semibold">Settings</div>
      <div className="space-y-2">
        <label className="text-sm text-slate-600">Webhook URL</label>
        <div className="flex gap-2">
          <input className="flex-1 border rounded-md px-3 py-2 text-sm" value={webhookUrl} onChange={(e)=>setWebhookUrl(e.target.value)} placeholder="https://..." />
          <button onClick={testSlack} disabled={testing} className="px-3 py-2 text-sm border rounded-md flex items-center gap-2 disabled:opacity-50"><Send className="w-4 h-4"/>Test Slack</button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-600">Booking Link</label>
        <input className="w-full border rounded-md px-3 py-2 text-sm" value={bookingLink} onChange={(e)=>setBookingLink(e.target.value)} placeholder="https://cal.com/you" />
      </div>
      {error && <div className="text-sm text-rose-600">{error}</div>}
      {saved && <div className="text-sm text-emerald-600">Saved</div>}
      <div>
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>Save</button>
      </div>
    </div>
  );
}
