"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feesApi, studentsApi, classesApi, StudentOut, ClassOut, FeeStructureOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, AlertCircle, Plus, X, Send } from "lucide-react";

export default function FeesPage() {
  const queryClient = useQueryClient();
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState<string | null>(null); // student id
  const [structureForm, setStructureForm] = useState({ name: "", amount: "", class_id: "", session_year: "2025-2026" });
  const [payAmount, setPayAmount] = useState("");
  const [selectedStructure, setSelectedStructure] = useState("");
  const [error, setError] = useState("");

  const { data: feeStructures = [] } = useQuery<FeeStructureOut[]>({
    queryKey: ["fee-structures"],
    queryFn: () => feesApi.listStructures(),
  });

  const { data: students = [], isLoading } = useQuery<StudentOut[]>({
    queryKey: ["students"],
    queryFn: () => studentsApi.list(0, 500),
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const classMap = Object.fromEntries((classes as ClassOut[]).map((c) => [c.id, `${c.name}-${c.section}`]));

  const { mutate: createStructure, isPending: creatingStructure } = useMutation({
    mutationFn: () => feesApi.createStructure({
      name: structureForm.name,
      amount: parseFloat(structureForm.amount),
      class_id: structureForm.class_id || undefined,
      session_year: structureForm.session_year,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-structures"] });
      setStructureForm({ name: "", amount: "", class_id: "", session_year: "2025-2026" });
      setShowStructureForm(false);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: unknown } } };
      const d = e?.response?.data?.detail;
      setError(typeof d === "string" ? d : "Failed to create fee structure.");
    },
  });

  const { mutate: recordPayment, isPending: payingFee } = useMutation({
    mutationFn: (studentId: string) => feesApi.recordPayment({
      studentId, amount: parseFloat(payAmount), feeStructureId: selectedStructure,
      date: new Date().toISOString().split("T")[0],
    }),
    onSuccess: () => {
      setShowPayForm(null);
      setPayAmount("");
      setSelectedStructure("");
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: unknown } } };
      const d = e?.response?.data?.detail;
      setError(typeof d === "string" ? d : "Failed to record payment.");
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-sm mt-1">{feeStructures.length} fee structures · {students.length} students</p>
        </div>
        <button onClick={() => { setShowStructureForm(!showStructureForm); setError(""); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
          {showStructureForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showStructureForm ? "Cancel" : "Add Fee Structure"}
        </button>
      </div>

      {showStructureForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">New Fee Structure</h2>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={structureForm.name} onChange={(e) => setStructureForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Monthly Fee" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount (Rs.) *</label>
              <input type="number" value={structureForm.amount} onChange={(e) => setStructureForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="800" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Class (optional)</label>
              <select value={structureForm.class_id} onChange={(e) => setStructureForm((p) => ({ ...p, class_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">All Classes</option>
                {(classes as ClassOut[]).map((c) => <option key={c.id} value={c.id}>Class {c.name}-{c.section}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Session Year</label>
              <input type="text" value={structureForm.session_year} onChange={(e) => setStructureForm((p) => ({ ...p, session_year: e.target.value }))}
                placeholder="2025-2026" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => {
              if (!structureForm.name || !structureForm.amount) { setError("Name and amount are required."); return; }
              createStructure();
            }} disabled={creatingStructure}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              <Send className="w-4 h-4" />{creatingStructure ? "Saving..." : "Save Structure"}
            </button>
          </div>
        </div>
      )}

      {/* Fee Structures */}
      {feeStructures.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(feeStructures as FeeStructureOut[]).map((fs) => (
            <div key={fs.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-900">{fs.name}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">Rs. {fs.amount.toLocaleString()}</p>
              {fs.class && <p className="text-xs text-gray-500 mt-1">Class: {fs.class as string}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: String(students.length), sub: "enrolled", icon: DollarSign, bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Active Students", value: String((students as StudentOut[]).filter((s) => s.is_active).length), sub: "active", icon: TrendingUp, bg: "bg-green-50", iconColor: "text-green-600" },
          { label: "Inactive", value: String((students as StudentOut[]).filter((s) => !s.is_active).length), sub: "inactive students", icon: AlertCircle, bg: "bg-red-50", iconColor: "text-red-600" },
        ].map(({ label, value, sub, icon: Icon, bg, iconColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Student Fee Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Students</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Student", "Class", "Roll No", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                  ))
                : (students as StudentOut[]).map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                            {(s.user?.name ?? "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{s.user?.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{s.class_id ? (classMap[s.class_id] ?? s.class_id.slice(0, 8)) : "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.roll_number}</td>
                      <td className="px-4 py-3">
                        <Badge variant={s.is_active ? "success" : "danger"}>{s.is_active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {showPayForm === s.id ? (
                          <div className="flex items-center gap-2">
                            <select value={selectedStructure} onChange={(e) => setSelectedStructure(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 bg-white">
                              <option value="">Select fee type</option>
                              {(feeStructures as FeeStructureOut[]).map((fs) => (
                                <option key={fs.id} value={fs.id}>{fs.name} (Rs.{fs.amount})</option>
                              ))}
                            </select>
                            <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)}
                              placeholder="Amount" className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none" />
                            <button onClick={() => recordPayment(s.id)} disabled={payingFee || !selectedStructure || !payAmount}
                              className="text-xs text-white bg-green-600 px-2 py-1 rounded disabled:opacity-50">Pay</button>
                            <button onClick={() => setShowPayForm(null)} className="text-xs text-gray-500">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setShowPayForm(s.id); setError(""); }}
                            className="text-xs text-green-600 font-medium hover:text-green-700 border border-green-200 px-2.5 py-1 rounded">
                            Record Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
