"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noticesApi, NoticeOut, NoticeCreate } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Pin, X, Send, Trash2, Pencil } from "lucide-react";

const NOTICE_TYPES = ["general", "academic", "event", "holiday", "exam", "fee"];
const TYPE_VARIANT: Record<string, "warning" | "danger" | "info" | "default"> = {
  exam: "warning", fee: "danger", academic: "info",
};

const emptyForm = (): NoticeCreate & { is_pinned: boolean } => ({
  title: "", body: "", notice_type: "general", is_pinned: false,
  attachment: null,
  published_at: new Date().toISOString(),
});

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  const { data: notices = [], isLoading } = useQuery<NoticeOut[]>({
    queryKey: ["notices"],
    queryFn: () => noticesApi.list(0, 100),
  });

  const { mutate: createNotice, isPending: creating } = useMutation({
    mutationFn: (payload: NoticeCreate) => noticesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setForm(emptyForm()); setShowForm(false); setError("");
    },
    onError: (err: unknown) => {
      const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof d === "string" ? d : "Failed to post notice.");
    },
  });

  const { mutate: updateNotice, isPending: updating } = useMutation({
    mutationFn: (payload: NoticeCreate) => noticesApi.update(editingId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setForm(emptyForm()); setEditingId(null); setError("");
    },
    onError: (err: unknown) => {
      const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof d === "string" ? d : "Failed to update notice.");
    },
  });

  const { mutate: deleteNotice } = useMutation({
    mutationFn: (id: string) => noticesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });

  const startEdit = (n: NoticeOut) => {
    setEditingId(n.id);
    setForm({
      title: n.title,
      body: n.body,
      notice_type: n.notice_type,
      is_pinned: n.is_pinned,
      attachment: null,
      published_at: n.published_at,
    });
    setShowForm(true);
    setError("");
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm()); setError(""); };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) { setError("Title and body are required."); return; }
    const payload: NoticeCreate = editingId
      ? form
      : { ...form, published_at: new Date().toISOString() };
    if (editingId) {
      updateNotice(payload);
    } else {
      createNotice(payload);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-500 text-sm mt-1">School-wide announcements</p>
        </div>
        <button onClick={() => { closeForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" /> Post Notice
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{editingId ? "Edit Notice" : "New Notice"}</h2>
            <button onClick={closeForm}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Notice title..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Body *</label>
              <textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                rows={4} placeholder="Notice content..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select value={form.notice_type} onChange={(e) => setForm((p) => ({ ...p, notice_type: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  {NOTICE_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-4">
                <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))}
                  className="w-4 h-4 accent-green-600" />
                Pin this notice
              </label>
              <div className="ml-auto">
                <button onClick={handleSubmit} disabled={creating || updating}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
                  <Send className="w-4 h-4" />{(creating || updating) ? "Saving..." : (editingId ? "Update" : "Post Notice")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-2" /><div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">No notices yet.</div>
      ) : (
        <div className="space-y-4">
          {(notices as NoticeOut[]).map((notice) => (
            <div key={notice.id} className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${notice.is_pinned ? "border-yellow-300 bg-yellow-50/20" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    notice.notice_type === "exam" ? "bg-yellow-100" : notice.notice_type === "fee" ? "bg-red-100" : "bg-blue-100"
                  }`}>
                    {notice.is_pinned ? <Pin className="w-5 h-5 text-yellow-600" /> : <Bell className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      {notice.is_pinned && <Pin className="w-3.5 h-3.5 text-yellow-500" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={TYPE_VARIANT[notice.notice_type] ?? "default"}>{notice.notice_type}</Badge>
                      <span className="text-xs text-gray-400">{new Date(notice.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(notice)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => deleteNotice(notice.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-100 px-2.5 py-1 rounded">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
