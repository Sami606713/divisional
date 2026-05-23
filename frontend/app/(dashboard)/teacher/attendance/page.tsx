"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { classesApi, studentsApi, attendanceApi, ClassOut, StudentOut } from "@/lib/api";
import { CheckCircle, XCircle, Clock, FileText, Save } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "leave";

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: "present", label: "P", icon: CheckCircle, color: "bg-green-500 text-white" },
  { value: "absent",  label: "A", icon: XCircle,     color: "bg-red-500 text-white" },
  { value: "late",    label: "L", icon: Clock,        color: "bg-yellow-500 text-white" },
  { value: "leave",   label: "LV", icon: FileText,   color: "bg-blue-500 text-white" },
];

export default function TeacherAttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(today);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery<StudentOut[]>({
    queryKey: ["students-by-class", selectedClassId],
    queryFn: () => studentsApi.list(0, 500),
    enabled: !!selectedClassId,
    select: (data) => data.filter((s) => s.class_id === selectedClassId),
  });

  // Default all students to "present" when class selected
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSubmitted(false);
    setStatuses({});
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const getStatus = (studentId: string): AttendanceStatus =>
    statuses[studentId] ?? "present";

  const { mutate: submitAttendance, isPending } = useMutation({
    mutationFn: () =>
      attendanceApi.bulkMark({
        class_id: selectedClassId,
        date,
        entries: students.map((s) => ({
          student_id: s.id,
          status: getStatus(s.id),
        })),
      }),
    onSuccess: () => setSubmitted(true),
  });

  const counts = students.reduce(
    (acc, s) => {
      acc[getStatus(s.id)] = (acc[getStatus(s.id)] ?? 0) + 1;
      return acc;
    },
    {} as Record<AttendanceStatus, number>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedClassId}
          onChange={(e) => handleClassChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">— Select Class —</option>
          {(classes as ClassOut[]).map((c) => (
            <option key={c.id} value={c.id}>
              Class {c.name}-{c.section} ({c.session_year})
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {!selectedClassId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          Select a class above to load the student list.
        </div>
      )}

      {selectedClassId && (
        <>
          {/* Summary bar */}
          {students.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {[
                { key: "present", label: "Present", color: "bg-green-100 text-green-700" },
                { key: "absent",  label: "Absent",  color: "bg-red-100 text-red-700" },
                { key: "late",    label: "Late",    color: "bg-yellow-100 text-yellow-700" },
                { key: "leave",   label: "Leave",   color: "bg-blue-100 text-blue-700" },
              ].map(({ key, label, color }) => (
                <div key={key} className={`px-4 py-2 rounded-lg text-sm font-semibold ${color}`}>
                  {label}: {counts[key as AttendanceStatus] ?? 0}
                </div>
              ))}
            </div>
          )}

          {/* Student list */}
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
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s, idx) => {
                    const current = getStatus(s.id);
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
                          <div className="flex gap-1">
                            {STATUS_OPTIONS.map(({ value, label, color }) => (
                              <button
                                key={value}
                                onClick={() => setStatus(s.id, value)}
                                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                                  current === value ? color : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Submit */}
          {students.length > 0 && (
            <div className="flex items-center gap-4">
              {submitted ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" /> Attendance saved successfully!
                </div>
              ) : (
                <button
                  onClick={() => submitAttendance()}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Saving..." : `Save Attendance (${students.length} students)`}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
