"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi, teachersApi, subjectsApi, ClassOut, TeacherOut, SubjectOut } from "@/lib/api";
import { School, Users, UserCheck, Plus, X, Send, Trash2 } from "lucide-react";

export default function ClassesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", section: "", session_year: "2025-2026", capacity: "45", class_teacher_id: "" });

  const { data: classes = [], isLoading } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: teachers = [] } = useQuery<TeacherOut[]>({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.list(),
  });

  const subjectCounts = useQuery({
    queryKey: ["subjects-all"],
    queryFn: () => subjectsApi.list(),
  });
  const subjectsByClass = ((subjectCounts.data ?? []) as SubjectOut[]).reduce<Record<string, number>>((acc, s) => {
    acc[s.class_id] = (acc[s.class_id] ?? 0) + 1;
    return acc;
  }, {});

  const teacherMap = Object.fromEntries((teachers as TeacherOut[]).map((t) => [t.id, t.user?.name ?? "—"]));

  const { mutate: createClass, isPending } = useMutation({
    mutationFn: () => classesApi.create({
      name: form.name, section: form.section, session_year: form.session_year,
      capacity: parseInt(form.capacity) || 45,
      class_teacher_id: form.class_teacher_id || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setForm({ name: "", section: "", session_year: "2025-2026", capacity: "45", class_teacher_id: "" });
      setShowForm(false); setError("");
    },
    onError: (err: unknown) => {
      const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof d === "string" ? d : Array.isArray(d) ? d[0]?.msg : "Failed to create class.");
    },
  });

  const { mutate: deleteClass } = useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["classes"] }),
  });

  const totalStudents = (classes as ClassOut[]).reduce((s, c) => s + (c.student_count ?? 0), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes & Sections</h1>
          <p className="text-gray-500 text-sm mt-1">{classes.length} sections · {totalStudents} total students</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Class"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Class</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Class Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="9" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Section *</label>
              <input type="text" value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}
                placeholder="A" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Session Year</label>
              <input type="text" value={form.session_year} onChange={(e) => setForm((p) => ({ ...p, session_year: e.target.value }))}
                placeholder="2025-2026" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                placeholder="45" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Class Teacher</label>
              <select value={form.class_teacher_id} onChange={(e) => setForm((p) => ({ ...p, class_teacher_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">— None —</option>
                {(teachers as TeacherOut[]).map((t) => (
                  <option key={t.id} value={t.id}>{t.user?.name ?? "Teacher"}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => {
              if (!form.name || !form.section) { setError("Class name and section are required."); return; }
              createClass();
            }} disabled={isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              <Send className="w-4 h-4" />{isPending ? "Creating..." : "Create Class"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-100 rounded mb-4 w-1/2" /><div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">No classes created yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(classes as ClassOut[]).map((cls) => {
            const occupancy = cls.capacity > 0 ? Math.round((cls.student_count / cls.capacity) * 100) : 0;
            const subjectCount = subjectsByClass[cls.id] ?? 0;
            return (
              <div key={cls.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-green-600">Class {cls.name}-{cls.section}</h2>
                    <p className="text-gray-500 text-sm mt-1">Session {cls.session_year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <School className="w-6 h-6 text-green-600" />
                    </div>
                    <button onClick={() => deleteClass(cls.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Students", value: cls.student_count, icon: Users },
                    { label: "Subjects", value: subjectCount, icon: School },
                    { label: "Capacity", value: cls.capacity, icon: School },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center bg-gray-50 rounded-lg p-3">
                      <p className="text-xl font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
                {cls.class_teacher_id && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span>Class Teacher: <span className="font-medium text-gray-900">{teacherMap[cls.class_teacher_id] ?? "—"}</span></span>
                  </div>
                )}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Occupancy</span><span>{occupancy}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 rounded-full ${occupancy > 90 ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${Math.min(occupancy, 100)}%` }} />
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
