"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { classesApi, examsApi, studentsApi, subjectsApi, ClassOut, ExamOut, ResultOut, StudentOut, SubjectOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { SelectMenu } from "@/components/ui/select-menu";
import { CalendarDays, ClipboardList, Trophy, Users } from "lucide-react";

const EXAM_TYPE_LABELS: Record<string, string> = {
  monthly: "Monthly",
  midterm: "Mid-Term",
  annual: "Annual",
  board: "Board",
};

type ResultWithStudent = ResultOut & { student: StudentOut };

function deriveStatus(exam: ExamOut): "Upcoming" | "Ongoing" | "Completed" {
  const now = new Date();
  if (now < new Date(exam.start_date)) return "Upcoming";
  if (now > new Date(exam.end_date)) return "Completed";
  return "Ongoing";
}

export default function ResultsAdminPage() {
  const searchParams = useSearchParams();
  const [selectedExamId, setSelectedExamId] = useState(searchParams.get("examId") ?? "");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: exams = [], isLoading: loadingExams } = useQuery<ExamOut[]>({
    queryKey: ["exams"],
    queryFn: () => examsApi.list(),
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery<StudentOut[]>({
    queryKey: ["students-all"],
    queryFn: () => studentsApi.list(0, 500),
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects-all"],
    queryFn: () => subjectsApi.list(),
  });

  const selectedExam = (exams as ExamOut[]).find((exam) => exam.id === selectedExamId) ?? null;

  const { data: examResults = [], isLoading: loadingExamResults } = useQuery<ResultWithStudent[]>({
    queryKey: ["results-exam-admin", selectedExamId, (students as StudentOut[]).length],
    enabled: !!selectedExamId && (students as StudentOut[]).length > 0,
    queryFn: async () => {
      const bundles = await Promise.all(
        (students as StudentOut[]).map(async (student) => {
          const results = await examsApi.getStudentResults(student.id, selectedExamId);
          return results.map((result) => ({ ...result, student }));
        })
      );
      return bundles.flat();
    },
  });

  const classMap = Object.fromEntries((classes as ClassOut[]).map((cls) => [cls.id, `Class ${cls.name}-${cls.section}`]));
  const subjectMap = Object.fromEntries((subjects as SubjectOut[]).map((subject) => [subject.id, subject.name]));
  const studentsInScope = selectedClassId
    ? (students as StudentOut[]).filter((student) => student.class_id === selectedClassId)
    : (students as StudentOut[]);

  const visibleSubjectIds = Array.from(new Set(examResults.map((result) => result.subject_id)));
  const subjectOptions = (subjects as SubjectOut[]).filter((subject) => visibleSubjectIds.includes(subject.id));

  const filteredResults = examResults.filter((result) => {
    if (selectedClassId && result.student.class_id !== selectedClassId) return false;
    if (selectedSubjectId && result.subject_id !== selectedSubjectId) return false;
    if (selectedStudentId && result.student_id !== selectedStudentId) return false;
    if (statusFilter === "pass" && !result.is_passed) return false;
    if (statusFilter === "fail" && result.is_passed) return false;
    return true;
  });

  const studentSummaries = studentsInScope.map((student) => {
    const results = filteredResults.filter((result) => result.student_id === student.id);
    const totalPct = results.reduce((sum, result) => sum + result.percentage, 0);
    return {
      student,
      results,
      subjectsCount: results.length,
      avgPercentage: results.length > 0 ? Math.round(totalPct / results.length) : 0,
      passCount: results.filter((result) => result.is_passed).length,
      failCount: results.filter((result) => !result.is_passed).length,
    };
  }).filter((summary) => {
    if (statusFilter === "graded") return summary.results.length > 0;
    if (statusFilter === "missing") return summary.results.length === 0;
    if (statusFilter === "pass") return summary.results.length > 0 && summary.failCount === 0;
    if (statusFilter === "fail") return summary.failCount > 0;
    return true;
  });

  const selectedStudentSummary = studentSummaries.find((summary) => summary.student.id === selectedStudentId) ?? null;

  const subjectSummaries = visibleSubjectIds.map((subjectId) => {
    const results = examResults.filter((result) => {
      if (result.subject_id !== subjectId) return false;
      if (selectedClassId && result.student.class_id !== selectedClassId) return false;
      return true;
    });
    const avgPercentage = results.length > 0
      ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length)
      : 0;
    return {
      subjectId,
      subjectName: subjectMap[subjectId] ?? "Subject",
      entries: results.length,
      studentsCount: new Set(results.map((result) => result.student_id)).size,
      avgPercentage,
      passCount: results.filter((result) => result.is_passed).length,
    };
  }).filter((summary) => !selectedSubjectId || summary.subjectId === selectedSubjectId);

  const gradedStudentIds = new Set(examResults
    .filter((result) => !selectedClassId || result.student.class_id === selectedClassId)
    .map((result) => result.student_id));
  const totalStudentsInExamScope = studentsInScope.length;
  const missingStudentsCount = Math.max(0, totalStudentsInExamScope - gradedStudentIds.size);
  const avgPercentage = examResults.length > 0
    ? Math.round(examResults.reduce((sum, result) => sum + result.percentage, 0) / examResults.length)
    : 0;
  const status = selectedExam ? deriveStatus(selectedExam) : null;
  const examSelectOptions = (exams as ExamOut[]).map((exam) => ({
    value: exam.id,
    label: `${exam.name} (${exam.session_year})`,
  }));
  const classSelectOptions = (classes as ClassOut[]).map((cls) => ({
    value: cls.id,
    label: classMap[cls.id],
  }));
  const subjectSelectOptions = subjectOptions.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }));
  const studentSelectOptions = studentSummaries
    .filter((summary) => summary.results.length > 0 || statusFilter === "missing" || statusFilter === "all")
    .map((summary) => ({
      value: summary.student.id,
      label: `${summary.student.user?.name ?? "—"} (${summary.student.roll_number})`,
    }));
  const statusSelectOptions = [
    { value: "all", label: "All Statuses" },
    { value: "graded", label: "Graded Students" },
    { value: "missing", label: "Missing Students" },
    { value: "pass", label: "Pass Only" },
    { value: "fail", label: "Has Failures" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Results Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Review one exam at a time, then drill into classes, subjects, and students.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-full sm:w-auto sm:min-w-[240px]">
          <SelectMenu
            value={selectedExamId}
            options={examSelectOptions}
            placeholder="— Select Exam —"
            onChange={(nextValue) => {
              setSelectedExamId(nextValue);
              setSelectedClassId("");
              setSelectedSubjectId("");
              setSelectedStudentId("");
              setStatusFilter("all");
            }}
          />
        </div>
        {selectedExamId && (
          <button
            onClick={() => {
              setSelectedExamId("");
              setSelectedClassId("");
              setSelectedSubjectId("");
              setSelectedStudentId("");
              setStatusFilter("all");
            }}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Clear Selection
          </button>
        )}
      </div>

      {!selectedExamId && (
        loadingExams ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold text-gray-900">Choose an Exam</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Exam", "Type", "Session", "Dates", "Status", "Published", "Action"].map((heading) => (
                      <th key={heading} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(exams as ExamOut[]).map((exam) => {
                    const examStatus = deriveStatus(exam);
                    return (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{exam.name}</td>
                        <td className="px-4 py-3"><Badge variant="info">{EXAM_TYPE_LABELS[exam.type] ?? exam.type}</Badge></td>
                        <td className="px-4 py-3 text-gray-600">{exam.session_year}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(exam.start_date).toLocaleDateString()} – {new Date(exam.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={examStatus === "Completed" ? "default" : examStatus === "Ongoing" ? "warning" : "success"}>{examStatus}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={exam.is_published ? "success" : "default"}>{exam.is_published ? "Published" : "Draft"}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedExamId(exam.id)}
                            className="text-green-600 hover:text-green-700 font-medium whitespace-nowrap"
                          >
                            Open Results
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {selectedExam && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedExam.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedExam.start_date).toLocaleDateString()} – {new Date(selectedExam.end_date).toLocaleDateString()}
                    {" · "}{selectedExam.session_year}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedExam.is_published ? "Published to viewers" : "Still in draft mode"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info">{EXAM_TYPE_LABELS[selectedExam.type] ?? selectedExam.type}</Badge>
                {status && (
                  <Badge variant={status === "Completed" ? "default" : status === "Ongoing" ? "warning" : "success"}>{status}</Badge>
                )}
                <Badge variant={selectedExam.is_published ? "success" : "default"}>
                  {selectedExam.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </div>

          {loadingStudents || loadingExamResults ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : examResults.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-lg font-semibold text-gray-900">This exam has been created, but no results have been entered yet.</p>
              <p className="text-sm text-gray-500 mt-2">Next step: enter marks by class and subject, then come back here to review progress and publish readiness.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: "Result Entries", value: String(examResults.length), color: "text-gray-900", icon: ClipboardList },
                  { label: "Subjects Covered", value: String(visibleSubjectIds.length), color: "text-blue-600", icon: Trophy },
                  { label: "Students Graded", value: String(gradedStudentIds.size), color: "text-green-600", icon: Users },
                  { label: "Missing Students", value: String(missingStudentsCount), color: "text-amber-600", icon: Users },
                  { label: "Average %", value: `${avgPercentage}%`, color: "text-purple-600", icon: Trophy },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-500">{label}</p>
                      <Icon className="w-4 h-4 text-gray-300" />
                    </div>
                    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <SelectMenu
                    value={selectedClassId}
                    options={classSelectOptions}
                    placeholder="All Classes"
                    onChange={(nextValue) => {
                      setSelectedClassId(nextValue);
                      setSelectedStudentId("");
                    }}
                  />
                  <SelectMenu
                    value={selectedSubjectId}
                    options={subjectSelectOptions}
                    placeholder="All Subjects"
                    onChange={(nextValue) => {
                      setSelectedSubjectId(nextValue);
                      setSelectedStudentId("");
                    }}
                  />
                  <SelectMenu
                    value={selectedStudentId}
                    options={studentSelectOptions}
                    placeholder="All Students"
                    onChange={(nextValue) => setSelectedStudentId(nextValue)}
                  />
                  <SelectMenu
                    value={statusFilter}
                    options={statusSelectOptions}
                    placeholder="All Statuses"
                    onChange={(nextValue) => {
                      setStatusFilter(nextValue);
                      setSelectedStudentId("");
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Subject Progress</h2>
                  <p className="text-sm text-gray-500 mt-1">See which subjects already have marks entered for this exam.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Subject", "Entries", "Students", "Pass", "Avg %"].map((heading) => (
                          <th key={heading} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subjectSummaries.map((summary) => (
                        <tr key={summary.subjectId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{summary.subjectName}</td>
                          <td className="px-4 py-3 text-gray-700">{summary.entries}</td>
                          <td className="px-4 py-3 text-gray-700">{summary.studentsCount}</td>
                          <td className="px-4 py-3 text-gray-700">{summary.passCount}</td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{summary.avgPercentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Student Progress</h2>
                  <p className="text-sm text-gray-500 mt-1">Track which students already have results and open a subject-wise breakdown.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Student", "Roll No", "Class", "Subjects", "Avg %", "Pass / Fail"].map((heading) => (
                          <th key={heading} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {studentSummaries.map((summary) => (
                        <tr
                          key={summary.student.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedStudentId === summary.student.id ? "bg-green-50/60" : ""}`}
                          onClick={() => setSelectedStudentId(selectedStudentId === summary.student.id ? "" : summary.student.id)}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">{summary.student.user?.name ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono text-xs">{summary.student.roll_number}</td>
                          <td className="px-4 py-3 text-gray-700">{summary.student.class_id ? classMap[summary.student.class_id] ?? "—" : "—"}</td>
                          <td className="px-4 py-3">
                            {summary.results.length > 0 ? (
                              <Badge variant="info">{summary.subjectsCount} recorded</Badge>
                            ) : (
                              <Badge variant="default">No results</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{summary.results.length > 0 ? `${summary.avgPercentage}%` : "—"}</td>
                          <td className="px-4 py-3">
                            {summary.results.length > 0 ? (
                              <Badge variant={summary.failCount > 0 ? "warning" : "success"}>
                                {summary.passCount} pass / {summary.failCount} fail
                              </Badge>
                            ) : (
                              <Badge variant="default">Pending</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedStudentSummary && selectedStudentSummary.results.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">
                      Subject-wise Results for {selectedStudentSummary.student.user?.name ?? "Student"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedStudentSummary.student.roll_number} · {selectedStudentSummary.student.class_id ? classMap[selectedStudentSummary.student.class_id] ?? "—" : "—"}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {["Subject", "Obtained", "Total", "%", "Grade", "Result"].map((heading) => (
                            <th key={heading} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{heading}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedStudentSummary.results.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{subjectMap[result.subject_id] ?? "Subject"}</td>
                            <td className="px-4 py-3 text-gray-700">{result.marks_obtained}</td>
                            <td className="px-4 py-3 text-gray-500">{result.total_marks}</td>
                            <td className="px-4 py-3 font-semibold text-blue-600">{result.percentage}%</td>
                            <td className="px-4 py-3"><Badge variant="info">{result.grade}</Badge></td>
                            <td className="px-4 py-3">
                              <Badge variant={result.is_passed ? "success" : "danger"}>{result.is_passed ? "Pass" : "Fail"}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
