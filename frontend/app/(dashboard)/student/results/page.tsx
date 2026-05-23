"use client";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, subjectsApi, ResultOut, SubjectOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export default function StudentResultsPage() {
  const { data: me, isLoading: loadingMe } = useQuery({
    queryKey: ["student-me"],
    queryFn: () => studentsApi.me(),
  });

  const { data: results = [], isLoading: loadingResults } = useQuery<ResultOut[]>({
    queryKey: ["my-results", me?.id],
    queryFn: () => studentsApi.getResults(me!.id),
    enabled: !!me?.id,
  });

  // Fetch subjects for the student's class to resolve subject names
  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects", me?.class_id],
    queryFn: () => subjectsApi.list(me!.class_id!),
    enabled: !!me?.class_id,
  });

  const subjectMap = Object.fromEntries((subjects as SubjectOut[]).map((s) => [s.id, s.name]));

  const isLoading = loadingMe || loadingResults;
  const total    = results.reduce((a, r) => a + r.marks_obtained, 0);
  const totalMax = results.reduce((a, r) => a + r.total_marks, 0);
  const percent  = totalMax > 0 ? Math.round((total / totalMax) * 100) : 0;

  const overallGrade = percent >= 90 ? "A+" : percent >= 80 ? "A" : percent >= 70 ? "B" : percent >= 60 ? "C" : percent >= 50 ? "D" : "F";
  const passed = results.every((r) => r.is_passed);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
        <p className="text-gray-500 text-sm mt-1">
          {me ? `Roll No: ${me.roll_number}` : "Academic performance"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
      ) : results.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          No results published yet. Check back after your exam results are released.
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Overall Performance</p>
                <p className="text-4xl font-bold mt-1">{percent}%</p>
                <p className="text-green-100 mt-1">{total} / {totalMax} marks</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold">Grade {overallGrade}</span>
                  <span className={`px-2 py-0.5 rounded text-sm font-semibold ${passed ? "bg-white/20" : "bg-red-500/60"}`}>
                    {passed ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Subject table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Subject-wise Marks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Subject", "Total Marks", "Obtained", "Percentage", "Grade", "Result"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {subjectMap[r.subject_id] ?? r.subject_id}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.total_marks}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{r.marks_obtained}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${r.percentage >= 80 ? "bg-green-500" : r.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${r.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{r.percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{r.grade}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.is_passed ? "success" : "danger"}>
                          {r.is_passed ? "Pass" : "Fail"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-green-50">
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                    <td className="px-4 py-3 font-bold text-gray-700">{totalMax}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{total}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{percent}%</td>
                    <td className="px-4 py-3 font-bold"><Badge variant="info">{overallGrade}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={passed ? "success" : "danger"}>{passed ? "Pass" : "Fail"}</Badge></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
