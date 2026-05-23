"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teachersApi, classesApi, TeacherOut, ClassOut } from "@/lib/api";
import { Plus, Phone, BookOpen, X, Send, Trash2 } from "lucide-react";

export default function TeachersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", qualification: "",
    father_name: "", cnic: "", joining_date: "", salary: "",
  });

  const { data: teachers = [], isLoading } = useQuery<TeacherOut[]>({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.list(),
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const classTeacherMap = Object.fromEntries(
    (classes as ClassOut[])
      .filter((c) => c.class_teacher_id)
      .map((c) => [c.class_teacher_id!, `${c.name}-${c.section}`])
  );

  const { mutate: createTeacher, isPending } = useMutation({
    mutationFn: () => teachersApi.create({
      name: form.name, email: form.email || undefined, phone: form.phone || undefined,
      password: form.password, qualification: form.qualification || undefined,
      father_name: form.father_name || undefined, cnic: form.cnic || undefined,
      joining_date: form.joining_date || undefined,
      salary: form.salary ? parseFloat(form.salary) : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setForm({ name: "", email: "", phone: "", password: "", qualification: "", father_name: "", cnic: "", joining_date: "", salary: "" });
      setShowForm(false);
      setError("");
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: unknown } } };
      const d = e?.response?.data?.detail;
      setError(typeof d === "string" ? d : Array.isArray(d) ? d[0]?.msg : "Failed to create teacher.");
    },
  });

  const { mutate: deleteTeacher } = useMutation({
    mutationFn: (id: string) => teachersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">{teachers.length} teaching staff members</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Teacher"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Teacher</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Full Name *", key: "name", type: "text", placeholder: "Muhammad Arif" },
              { label: "Email", key: "email", type: "email", placeholder: "arif@school.pk" },
              { label: "Phone", key: "phone", type: "text", placeholder: "0300-1234567" },
              { label: "Password *", key: "password", type: "password", placeholder: "••••••••" },
              { label: "Qualification", key: "qualification", type: "text", placeholder: "M.Sc Mathematics" },
              { label: "Father Name", key: "father_name", type: "text", placeholder: "Father name" },
              { label: "CNIC", key: "cnic", type: "text", placeholder: "13101-1234567-1" },
              { label: "Joining Date", key: "joining_date", type: "date", placeholder: "" },
              { label: "Salary (Rs.)", key: "salary", type: "number", placeholder: "25000" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} value={form[key as keyof typeof form]} onChange={set(key)}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => {
              if (!form.name || !form.password) { setError("Name and password are required."); return; }
              createTeacher();
            }} disabled={isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              <Send className="w-4 h-4" />{isPending ? "Saving..." : "Save Teacher"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-3" /><div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">No teachers added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(teachers as TeacherOut[]).map((t) => {
            const name = t.user?.name ?? "—";
            const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
            const assignedClass = classTeacherMap[t.id];
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                    {t.qualification && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                        <BookOpen className="w-3 h-3" />{t.qualification}
                      </div>
                    )}
                    {t.user?.email && <p className="text-xs text-gray-400 truncate mt-0.5">{t.user.email}</p>}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />{t.user?.phone ?? "—"}
                  </span>
                  {assignedClass && (
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                      Class {assignedClass}
                    </span>
                  )}
                </div>
                {t.salary && (
                  <p className="text-xs text-gray-400 mt-2">Salary: Rs. {t.salary.toLocaleString()}</p>
                )}
                <div className="flex justify-end mt-2">
                  <button onClick={() => deleteTeacher(t.id)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
