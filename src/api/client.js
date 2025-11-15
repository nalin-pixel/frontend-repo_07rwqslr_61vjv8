// Simple mock API client with polling-based real-time updates
// In production, swap implementations to use your backend endpoints.

const sampleLabels = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office",
];

function randomLabel() {
  return sampleLabels[Math.floor(Math.random() * sampleLabels.length)];
}

function generateSampleEmails(count = 25) {
  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => ({
    id: `${now}-${i}`,
    account: i % 2 === 0 ? "sales@acme.com" : "team@acme.com",
    folder: i % 5 === 0 ? "Spam" : i % 3 === 0 ? "Sent" : "Inbox",
    from: i % 4 === 0 ? "alex@prospect.io" : "morgan@company.com",
    subject: `Follow up ${i + 1}`,
    snippet:
      "Thanks for reaching out. We'd love to learn more about your solution...",
    date: new Date(now - i * 1000 * 60 * 60).toISOString(),
    label: randomLabel(),
    body:
      "Hi team,\n\nThanks for the information you shared. Could you send pricing and a brief deck?\n\nBest,\nAlex",
    headers: {
      "Message-ID": `<msg-${now}-${i}@mail>`,
      "In-Reply-To": i % 2 === 0 ? `<ref-${i}@mail>` : undefined,
      "X-Mailer": "Acme Mailer 2.0",
    },
  }));
}

const initialEmails = generateSampleEmails(42);

class APIClient {
  constructor() {
    this.emails = [...initialEmails];
    this.accounts = [
      { id: "acc1", address: "sales@acme.com" },
      { id: "acc2", address: "team@acme.com" },
    ];
    this.folders = ["Inbox", "Sent", "Spam", "Archive", "Custom"];
    this.subscribers = new Set();
    // Start polling to simulate realtime updates
    this._startPolling();
  }

  _startPolling() {
    // Every 20s, randomly update a label or add a new email
    setInterval(() => {
      const r = Math.random();
      if (r < 0.6 && this.emails.length > 0) {
        const idx = Math.floor(Math.random() * this.emails.length);
        this.emails[idx] = { ...this.emails[idx], label: randomLabel() };
      } else {
        const newEmail = generateSampleEmails(1)[0];
        this.emails.unshift(newEmail);
      }
      this._emit();
    }, 20000);
  }

  onUpdate(cb) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  _emit() {
    this.subscribers.forEach((cb) => cb());
  }

  async getAccounts() {
    return this.accounts;
  }

  async getFolders() {
    return this.folders;
  }

  async getEmails({ page = 1, pageSize = 10, account, folder, label, q } = {}) {
    await new Promise((r) => setTimeout(r, 300));
    let list = [...this.emails];
    if (account) list = list.filter((e) => e.account === account);
    if (folder && folder !== "All") list = list.filter((e) => e.folder === folder);
    if (label && label !== "All") list = list.filter((e) => e.label === label);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.subject.toLowerCase().includes(s) ||
          e.from.toLowerCase().includes(s) ||
          e.snippet.toLowerCase().includes(s)
      );
    }
    const total = list.length;
    const start = (page - 1) * pageSize;
    const items = list.slice(start, start + pageSize);
    return { items, total };
  }

  async getEmailById(id) {
    await new Promise((r) => setTimeout(r, 200));
    return this.emails.find((e) => e.id === id);
  }

  async updateLabel(id, label) {
    const idx = this.emails.findIndex((e) => e.id === id);
    if (idx >= 0) {
      this.emails[idx] = { ...this.emails[idx], label };
      this._emit();
      return { success: true };
    }
    throw new Error("Email not found");
  }

  async suggestReplies(id) {
    await new Promise((r) => setTimeout(r, 500));
    const email = await this.getEmailById(id);
    const name = email?.from?.split("@")[0] || "there";
    return [
      `Hi ${name}, thanks for the note — happy to share pricing. Are you free for a quick call this week?`,
      `Appreciate your interest! Here's a brief overview and next steps. Would next Tuesday 2pm work?`,
      `Thanks for reaching out. Looping in the right teammate to assist and share a deck shortly.`,
    ];
  }

  async sendEmail({ from, to, subject, body, replyToId }) {
    await new Promise((r) => setTimeout(r, 500));
    // Just simulate success
    return { success: true, id: `${Date.now()}` };
  }

  async saveSettings({ webhookUrl, bookingLink }) {
    await new Promise((r) => setTimeout(r, 300));
    this.settings = { webhookUrl, bookingLink };
    return { success: true };
  }

  async testSlack() {
    await new Promise((r) => setTimeout(r, 400));
    return { success: true };
  }
}

export const api = new APIClient();
export const LABELS = sampleLabels;
