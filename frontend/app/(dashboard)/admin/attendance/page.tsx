"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { classesApi, attendanceApi, studentsApi, ClassOut, AttendanceOut, StudentOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

type Summary = { present: number; absent: number; late: number; leave: number; total: number };

function summarise(records: AttendanceOut[], total: number): Summary {
  const s = { present: 0, absent: 0, late: 0, leave: 0, total };
  for (const r of records) {
    if (r.status === "present") s.present++;
    else if (r.status === "absent") s.absent++;
    else if (r.status === "late") s.late++;
    else if (r.status === "leave") s.leave++;
  }
  return s;
}

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState("");

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: students = [] } = useQuery<StudentOut[]>({
    queryKey: ["students-all"],
    queryFn: () => studentsApi.list(0, 500),
    enabled: classes.length > 0,
  });

  // Attendance for each class on selected date
  const classAttendanceQueries = (classes as ClassOut[]).map((cls) => ({
    classId: cls.id,
    name: `${cls.name}-${cls.section}`,
    studentCount: cls.student_count,
  }));

  const { data: classRecords = [] } = useQuery<AttendanceOut[]>({
    queryKey: ["attendance-class", selectedClass, date],
    queryFn: () => attendanceApi.getByClass(selectedClass, date),
    enabled: !!selectedClass,
  });

  const classStudents = selectedClass
    ? (students as StudentOut[]).filter((s) => s.class_id === selectedClass)
    : [];

  const selectedClassInfo = (classes as ClassOut[]).find((c) => c.id === selectedClass);
  const summary = selectedClass
    ? summarise(classRecords, classStudents.length)
    : null;

  // Overall stats from classes
  const totalStudents = (classes as ClassOut[]).reduce((acc, c) => acc + c.student_count, 0);

  const statusOf = (studentId: string) =>
    classRecords.find((r) => r.studentId === studentId || (r as { student_id?: string }).student_id === studentId)?.status ?? "—";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
          <option value="">— All Classes —</option>
          {classAttendanceQueries.map((c) => (
            <option key={c.classId} value={c.classId}>Class {c.name}</option>
          ))}
        </select>
        <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalStudents, color: "text-gray-900" },
          { label: "Present", value: summary?.present ?? "—", color: "text-green-600" },
          { label: "Absent", value: summary?.absent ?? "—", color: "text-red-600" },
          { label: "Late / Leave", value: summary ? (summary.late + summary.leave) : "—", color: "text-yellow-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Class list overview */}
      {!selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-green-600" /> Classes Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Class", "Total Students", "Session"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(classes as ClassOut[]).map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClass(cls.id)}>
                    <td className="px-4 py-3 font-semibold text-green-700">Class {cls.name}-{cls.section}</td>
                    <td className="px-4 py-3 text-gray-600">{cls.student_count}</td>
                    <td className="px-4 py-3 text-gray-500">{cls.session_year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Detailed class attendance */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-600" />
              Class {selectedClassInfo?.name}-{selectedClassInfo?.section} — {new Date(date).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {classRecords.length === 0 ? (
              <p className="text-sm text-gray-400 p-6">No attendance records found for this date. Use the Mark Attendance page to submit attendance.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Student", "Roll No", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classStudents.map((s, idx) => {
                    const st = statusOf(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.user?.name ?? "—"}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.roll_number}</td>
                        <td className="px-4 py-3">
                          <Badge variant={st === "present" ? "success" : st === "absent" ? "danger" : st === "late" ? "warning" : "default"}>
                            {st}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
