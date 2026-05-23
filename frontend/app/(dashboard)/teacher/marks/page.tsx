"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { classesApi, studentsApi, examsApi, subjectsApi, ClassOut, StudentOut, ExamOut, SubjectOut } from "@/lib/api";
import { CheckCircle, Save } from "lucide-react";

export default function MarksEntryPage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: exams = [] } = useQuery<ExamOut[]>({
    queryKey: ["exams"],
    queryFn: () => examsApi.list(),
  });

  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects", selectedClassId],
    queryFn: () => subjectsApi.list(selectedClassId),
    enabled: !!selectedClassId,
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery<StudentOut[]>({
    queryKey: ["students-by-class", selectedClassId],
    queryFn: () => studentsApi.list(0, 500),
    enabled: !!selectedClassId,
    select: (data) => data.filter((s) => s.class_id === selectedClassId),
  });

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectId("");
    setMarks({});
    setSubmitted(false);
  };

  const setMark = (studentId: string, value: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const getMark = (studentId: string) => marks[studentId] ?? "";

  const getPercentage = (studentId: string) => {
    const m = parseFloat(getMark(studentId));
    if (isNaN(m) || totalMarks <= 0) return null;
    return Math.round((m / totalMarks) * 100);
  };

  const percentColor = (pct: number | null) => {
    if (pct === null) return "text-gray-400";
    if (pct >= 80) return "text-green-600";
    if (pct >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const canSubmit = selectedClassId && selectedExamId && selectedSubjectId && students.length > 0;

  const { mutate: submitMarks, isPending } = useMutation({
    mutationFn: () => {
      const entries = students
        .map((s) => ({ student_id: s.id, marks_obtained: parseFloat(getMark(s.id)) || 0 }));
      return examsApi.enterResults({
        exam_id: selectedExamId,
        subject_id: selectedSubjectId,
        class_id: selectedClassId,
        total_marks: totalMarks,
        entries,
      });
    },
    onSuccess: () => setSubmitted(true),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
        <p className="text-gray-500 text-sm mt-1">Enter exam marks for your class</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          value={selectedClassId}
          onChange={(e) => handleClassChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">— Select Class —</option>
          {(classes as ClassOut[]).map((c) => (
            <option key={c.id} value={c.id}>
              Class {c.name}{c.section ? `-${c.section}` : ""}
            </option>
          ))}
        </select>

        <select
          value={selectedExamId}
          onChange={(e) => { setSelectedExamId(e.target.value); setSubmitted(false); }}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">— Select Exam —</option>
          {(exams as ExamOut[]).map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <select
          value={selectedSubjectId}
          onChange={(e) => { setSelectedSubjectId(e.target.value); setSubmitted(false); }}
          disabled={!selectedClassId}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:opacity-50"
        >
          <option value="">— Select Subject —</option>
          {(subjects as SubjectOut[]).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Total Marks:</label>
          <input
            type="number"
            min={1}
            max={1000}
            value={totalMarks}
            onChange={(e) => setTotalMarks(parseInt(e.target.value) || 100)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {!selectedClassId || !selectedExamId ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          Select a class and exam above to load the student list.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loadingStudents ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No students found in this class.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Roll No</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Marks / {totalMarks}</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s, idx) => {
                    const pct = getPercentage(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                              {(s.user?.name ?? "?")[0].toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{s.user?.name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.roll_number}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            max={totalMarks}
                            value={getMark(s.id)}
                            onChange={(e) => setMark(s.id, e.target.value)}
                            placeholder="—"
                            className="w-24 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </td>
                        <td className={`px-4 py-3 font-semibold ${percentColor(pct)}`}>
                          {pct !== null ? `${pct}%` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {students.length > 0 && (
            <div className="flex items-center gap-4">
              {submitted ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" /> Marks saved successfully!
                </div>
              ) : (
                <button
                  onClick={() => submitMarks()}
                  disabled={isPending || !canSubmit}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Saving..." : `Save Marks (${students.length} students)`}
                </button>
              )}
              {!selectedSubjectId && (
                <p className="text-sm text-amber-600">Please select a subject before saving.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
