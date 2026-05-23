"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classesApi, subjectsApi, teachersApi, ClassOut, SubjectOut, TeacherOut } from "@/lib/api";
import { BookOpen, Plus, Send, Trash2, X } from "lucide-react";

export default function SubjectsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [form, setForm] = useState({ name: "", code: "", class_id: "", teacher_id: "" });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: teachers = [] } = useQuery<TeacherOut[]>({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.list(),
  });

  const { data: subjects = [], isLoading } = useQuery<SubjectOut[]>({
    queryKey: ["subjects-all"],
    queryFn: () => subjectsApi.list(),
  });

  const classMap = Object.fromEntries((classes as ClassOut[]).map((c) => [c.id, `Class ${c.name}-${c.section}`]));

  const filteredSubjects = selectedClassId
    ? (subjects as SubjectOut[]).filter((subject) => subject.class_id === selectedClassId)
    : (subjects as SubjectOut[]);

  const { mutate: createSubject, isPending } = useMutation({
    mutationFn: () =>
      subjectsApi.create({
        name: form.name,
        code: form.code || undefined,
        class_id: form.class_id,
        teacher_id: form.teacher_id || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects-all"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setForm({ name: "", code: "", class_id: "", teacher_id: "" });
      setShowForm(false);
      setError("");
    },
    onError: (err: unknown) => {
      const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof d === "string" ? d : Array.isArray(d) ? d[0]?.msg : "Failed to create subject.");
    },
  });

  const { mutate: assignTeacher } = useMutation({
    mutationFn: ({ id, teacherId }: { id: string; teacherId: string }) =>
      subjectsApi.update(id, { teacher_id: teacherId || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects-all"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  const { mutate: deleteSubject } = useMutation({
    mutationFn: (id: string) => subjectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects-all"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredSubjects.length} subjects available</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Subject"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Subject</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Mathematics"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                placeholder="MTH"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Class *</label>
              <select
                value={form.class_id}
                onChange={(e) => setForm((p) => ({ ...p, class_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">— Select Class —</option>
                {(classes as ClassOut[]).map((c) => (
                  <option key={c.id} value={c.id}>{`Class ${c.name}-${c.section}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Teacher</label>
              <select
                value={form.teacher_id}
                onChange={(e) => setForm((p) => ({ ...p, teacher_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">— Unassigned —</option>
                {(teachers as TeacherOut[]).map((t) => (
                  <option key={t.id} value={t.id}>{t.user?.name ?? "Teacher"}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                if (!form.name || !form.class_id) {
                  setError("Subject name and class are required.");
                  return;
                }
                createSubject();
              }}
              disabled={isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />{isPending ? "Creating..." : "Create Subject"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Subject Directory</h2>
            <p className="text-sm text-gray-500 mt-1">Create subjects and assign a teacher to each one.</p>
          </div>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">All Classes</option>
            {(classes as ClassOut[]).map((c) => (
              <option key={c.id} value={c.id}>{`Class ${c.name}-${c.section}`}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No subjects found for the selected class.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Subject", "Code", "Class", "Assigned Teacher", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-green-700" />
                        </div>
                        <span className="font-medium text-gray-900">{subject.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{subject.code ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{classMap[subject.class_id] ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={subject.teacher_id ?? ""}
                        onChange={(e) => assignTeacher({ id: subject.id, teacherId: e.target.value })}
                        className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="">— Unassigned —</option>
                        {(teachers as TeacherOut[]).map((t) => (
                          <option key={t.id} value={t.id}>{t.user?.name ?? "Teacher"}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
