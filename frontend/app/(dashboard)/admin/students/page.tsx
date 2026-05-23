"use client";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, StudentOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsApi.list(0, 500),
  });

  const filtered = (students as StudentOut[]).filter((s) => {
    const name = s.user?.name?.toLowerCase() ?? "";
    const roll = s.roll_number?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    return name.includes(q) || roll.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} total students enrolled</p>
        </div>
        <Link
          href="/admin/students/new"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Student
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Student", "Roll No", "Class", "Gender", "Session", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : paginated.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        {search ? "No students match your search." : "No students enrolled yet."}
                      </td>
                    </tr>
                  )
                : paginated.map((s: StudentOut) => {
                    const initials = (s.user?.name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{s.user?.name ?? "—"}</p>
                              <p className="text-xs text-gray-400">{s.user?.email ?? ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.roll_number}</td>
                        <td className="px-4 py-3 text-gray-700">{s.class_id ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-700 capitalize">{s.gender?.toLowerCase() ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{s.session_year}</td>
                        <td className="px-4 py-3">
                          <Badge variant={s.is_active ? "success" : "danger"}>
                            {s.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/students/${s.id}`}
                            className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1"
                          >
                            <UserCircle className="w-3.5 h-3.5" /> View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {paginated.length} of {filtered.length} students</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded border ${p === page ? "bg-green-600 text-white border-green-600" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
