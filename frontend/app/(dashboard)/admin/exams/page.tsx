"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsApi, ExamOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, X, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

const EXAM_TYPE_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "midterm", label: "Mid-Term" },
  { value: "annual", label: "Annual" },
  { value: "board", label: "Board" },
] as const;

const EXAM_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  EXAM_TYPE_OPTIONS.map(({ value, label }) => [value, label])
);

function deriveStatus(exam: ExamOut): "Upcoming" | "Ongoing" | "Completed" {
  const now = new Date();
  const start = new Date(exam.start_date);
  const end = new Date(exam.end_date);
  if (now < start) return "Upcoming";
  if (now > end) return "Completed";
  return "Ongoing";
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "default"> = {
  Upcoming: "success", Ongoing: "warning", Completed: "default",
};
const TYPE_VARIANT: Record<string, "danger" | "warning" | "info"> = {
  monthly: "info",
  midterm: "warning",
  annual: "danger",
  board: "danger",
};

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", type: "midterm", session_year: "2025-2026", start_date: "", end_date: "" });

  const { data: exams = [], isLoading } = useQuery<ExamOut[]>({
    queryKey: ["exams"],
    queryFn: () => examsApi.list(),
  });

  const { mutate: createExam, isPending } = useMutation({
    mutationFn: () => examsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setForm({ name: "", type: "midterm", session_year: "2025-2026", start_date: "", end_date: "" });
      setShowForm(false);
      setError("");
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: unknown } } };
      const d = e?.response?.data?.detail;
      setError(typeof d === "string" ? d : Array.isArray(d) ? d[0]?.msg : "Failed to create exam.");
    },
  });

  const { mutate: publishExam } = useMutation({
    mutationFn: (id: string) => examsApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exams"] }),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
          <p className="text-gray-500 text-sm mt-1">{exams.length} exams scheduled</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Create Exam"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Exam</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Exam Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Mid-Term Examination" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {EXAM_TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Session Year *</label>
              <input type="text" value={form.session_year} onChange={(e) => setForm((p) => ({ ...p, session_year: e.target.value }))}
                placeholder="2025-2026" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => {
              if (!form.name || !form.start_date || !form.end_date) { setError("Name, start date and end date are required."); return; }
              createExam();
            }} disabled={isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              <Send className="w-4 h-4" />{isPending ? "Creating..." : "Create Exam"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-2" /><div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">No exams created yet.</div>
      ) : (
        <div className="space-y-4">
          {(exams as ExamOut[]).map((exam) => {
            const status = deriveStatus(exam);
            const iconBg = status === "Completed" ? "bg-gray-100" : status === "Ongoing" ? "bg-yellow-100" : "bg-green-100";
            const iconColor = status === "Completed" ? "text-gray-500" : status === "Ongoing" ? "text-yellow-600" : "text-green-600";
            return (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <CalendarDays className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(exam.start_date).toLocaleDateString()} – {new Date(exam.end_date).toLocaleDateString()}
                        {" · "}{exam.session_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={TYPE_VARIANT[exam.type] ?? "info"}>{EXAM_TYPE_LABELS[exam.type] ?? exam.type}</Badge>
                    <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                    <Link
                      href={`/admin/results?examId=${exam.id}`}
                      className="text-xs text-green-700 hover:text-green-800 font-medium border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg"
                    >
                      Open Results
                    </Link>
                    {exam.is_published ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Published
                      </span>
                    ) : (
                      <button onClick={() => publishExam(exam.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-3 py-1.5 rounded-lg">
                        Publish Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
