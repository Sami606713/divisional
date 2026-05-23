"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { examsApi, ExamOut, PublicExamResultsSummary } from "@/lib/api";
import { ExternalLink, Trophy, TrendingUp } from "lucide-react";

const EXAM_TYPE_LABELS: Record<string, string> = {
  monthly: "Monthly",
  midterm: "Mid-Term",
  annual: "Annual",
  board: "Board",
};

export function ResultsClient() {
  const [selectedExamId, setSelectedExamId] = useState("");

  const { data: exams = [], isLoading: loadingExams } = useQuery<ExamOut[]>({
    queryKey: ["exams-public"],
    queryFn: () => examsApi.listPublic(),
  });

  const activeExamId = selectedExamId || exams[0]?.id || "";

  const { data: summary, isLoading: loadingSummary } = useQuery<PublicExamResultsSummary>({
    queryKey: ["exam-results-public", activeExamId],
    enabled: !!activeExamId,
    queryFn: () => examsApi.getPublicResults(activeExamId),
  });

  const selectedExam = exams.find((exam) => exam.id === activeExamId) ?? summary?.exam ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Examination Results</h1>
        <p className="text-sm text-gray-500 sm:text-base">Published examination results and live merit list for DPHS Pharhala</p>
      </div>

      <div className="mb-8 flex justify-center sm:mb-10">
        {loadingExams ? (
          <div className="h-11 w-full max-w-md rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <select
            value={activeExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full max-w-md rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} · {exam.session_year}
              </option>
            ))}
          </select>
        )}
      </div>

      {loadingSummary ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
          <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      ) : !summary || summary.merit_list.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          No published result records are available for this exam yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Pass Rate", value: `${summary.pass_rate}%`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
              { label: "A+ Grade Students", value: String(summary.a_plus_students), icon: Trophy, color: "text-yellow-600 bg-yellow-50" },
              { label: "Total Students Appeared", value: String(summary.total_students), icon: Trophy, color: "text-blue-600 bg-blue-50" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 mb-8 overflow-hidden">
            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-gray-900">
                  Merit List — {selectedExam?.name ?? "Published Exam"}
                </h2>
              </div>
              {selectedExam && (
                <div className="text-sm text-gray-500">
                  {EXAM_TYPE_LABELS[selectedExam.type] ?? selectedExam.type} · {selectedExam.session_year}
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Rank", "Student Name", "Class", "Total Marks", "Obtained", "Percentage", "Grade"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summary.merit_list.map((row) => (
                    <tr key={row.student_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${row.rank <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{row.student_name}</td>
                      <td className="px-4 py-3 text-gray-600">{row.class_name}</td>
                      <td className="px-4 py-3 text-gray-600">{row.total_marks}</td>
                      <td className="px-4 py-3 text-gray-600">{row.obtained_marks}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">{row.percentage}%</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">{row.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">BISE Abbottabad Board Results</h3>
              <p className="text-blue-700 text-sm">For official board examination results, visit the BISE Abbottabad website.</p>
            </div>
            <a href="https://www.biseatd.edu.pk/" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
              Visit BISE Abbottabad <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
