"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi, timetableApi, subjectsApi, teachersApi, ClassOut, TimetableOut, SubjectOut, TeacherOut } from "@/lib/api";
import { Clock, Plus, X, Send } from "lucide-react";

const DAYS = [
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
] as const;

export default function TimetablePage() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ subject_id: "", teacher_id: "", day: "mon", period: "1", start_time: "08:00", end_time: "08:40" });

  const { data: classes = [] } = useQuery<ClassOut[]>({ queryKey: ["classes"], queryFn: () => classesApi.list() });
  const { data: teachers = [] } = useQuery<TeacherOut[]>({ queryKey: ["teachers"], queryFn: () => teachersApi.list() });
  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects", selectedClassId],
    queryFn: () => subjectsApi.list(selectedClassId),
    enabled: !!selectedClassId,
  });

  const { data: timetable = [], isLoading } = useQuery<TimetableOut[]>({
    queryKey: ["timetable-class", selectedClassId],
    queryFn: () => timetableApi.getByClass(selectedClassId),
    enabled: !!selectedClassId,
  });

  const subjectMap = Object.fromEntries((subjects as SubjectOut[]).map((s) => [s.id, s.name]));
  const teacherMap = Object.fromEntries((teachers as TeacherOut[]).map((t) => [t.id, t.user?.name ?? "—"]));

  const maxPeriod = (timetable as TimetableOut[]).length > 0
    ? Math.max(...(timetable as TimetableOut[]).map((t) => t.period))
    : 0;
  const periods = Array.from({ length: Math.max(maxPeriod, 6) }, (_, i) => i + 1);

  const getSlot = (day: string, period: number) =>
    (timetable as TimetableOut[]).find((t) => t.day === day && t.period === period);

  const { mutate: addSlot, isPending } = useMutation({
    mutationFn: () => timetableApi.create({
      class_id: selectedClassId, subject_id: form.subject_id, teacher_id: form.teacher_id,
      day: form.day, period: parseInt(form.period), start_time: form.start_time, end_time: form.end_time,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-class", selectedClassId] });
      setForm({ subject_id: "", teacher_id: "", day: "mon", period: "1", start_time: "08:00", end_time: "08:40" });
      setShowForm(false); setError("");
    },
    onError: (err: unknown) => {
      const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof d === "string" ? d : "Failed to add slot.");
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500 text-sm mt-1">Class weekly schedule</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedClassId} onChange={(e) => { setSelectedClassId(e.target.value); setShowForm(false); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
            <option value="">— Select Class —</option>
            {(classes as ClassOut[]).map((c) => <option key={c.id} value={c.id}>Class {c.name}-{c.section}</option>)}
          </select>
          {selectedClassId && (
            <button onClick={() => { setShowForm(!showForm); setError(""); }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "Add Slot"}
            </button>
          )}
        </div>
      </div>

      {showForm && selectedClassId && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Add Timetable Slot</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
              <select value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Period</label>
              <input type="number" min={1} max={10} value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
              <select value={form.subject_id} onChange={(e) => setForm((p) => ({ ...p, subject_id: e.target.value }))}
                disabled={(subjects as SubjectOut[]).length === 0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-50 disabled:text-gray-400">
                <option value="">{(subjects as SubjectOut[]).length === 0 ? "No subjects available" : "— Select —"}</option>
                {(subjects as SubjectOut[]).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {(subjects as SubjectOut[]).length === 0 && (
                <p className="mt-1 text-xs text-amber-600">This class has no subjects assigned yet, so timetable slots cannot be created.</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Teacher</label>
              <select value={form.teacher_id} onChange={(e) => setForm((p) => ({ ...p, teacher_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">— Select —</option>
                {(teachers as TeacherOut[]).map((t) => <option key={t.id} value={t.id}>{t.user?.name ?? "—"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start</label>
              <input type="time" value={form.start_time} onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End</label>
              <input type="time" value={form.end_time} onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => {
              if (!form.subject_id || !form.teacher_id) { setError("Subject and teacher are required."); return; }
              addSlot();
            }} disabled={isPending || (subjects as SubjectOut[]).length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              <Send className="w-4 h-4" />{isPending ? "Saving..." : "Add Slot"}
            </button>
          </div>
        </div>
      )}

      {!selectedClassId ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">Select a class to view its timetable.</div>
      ) : isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Period</div>
                  </th>
                  {DAYS.map((d) => <th key={d.value} className="text-center px-4 py-3 font-semibold text-gray-600">{d.label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periods.map((period) => (
                  <tr key={period} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">P{period}</td>
                    {DAYS.map((day) => {
                      const slot = getSlot(day.value, period);
                      if (!slot) return <td key={day.value} className="px-2 py-3 text-center"><span className="text-gray-200">—</span></td>;
                      return (
                        <td key={day.value} className="px-2 py-2 text-center">
                          <div className="inline-block bg-green-50 text-green-700 px-2 py-1.5 rounded-lg text-xs font-medium group relative">
                            <div>{subjectMap[slot.subject_id] ?? "Subject"}</div>
                            <div className="text-[10px] opacity-70">{teacherMap[slot.teacher_id] ?? "—"}</div>
                            {slot.start_time && <div className="text-[10px] font-mono opacity-60">{slot.start_time}–{slot.end_time}</div>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(timetable as TimetableOut[]).length === 0 && (
            <p className="text-sm text-gray-400 p-6 text-center">No timetable entries yet. Add slots using the button above.</p>
          )}
        </div>
      )}
    </div>
  );
}
