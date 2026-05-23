"use client";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, StudentOut, ResultOut, FeeRecordOut, AttendanceSummary } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, CalendarDays, BookOpen, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: student, isLoading: studentLoading } = useQuery<StudentOut>({
    queryKey: ["student", id],
    queryFn: () => studentsApi.get(id),
    enabled: Boolean(id),
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery<ResultOut[]>({
    queryKey: ["student-results", id],
    queryFn: () => studentsApi.getResults(id),
    enabled: Boolean(id),
  });

  const { data: fees = [], isLoading: feesLoading } = useQuery<FeeRecordOut[]>({
    queryKey: ["student-fees", id],
    queryFn: () => studentsApi.getFees(id),
    enabled: Boolean(id),
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery<AttendanceSummary>({
    queryKey: ["student-attendance", id],
    queryFn: () => studentsApi.getAttendanceSummary(id),
    enabled: Boolean(id),
  });

  const initials = student
    ? student.user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const totalObtained = results.reduce((a, r) => a + r.marks_obtained, 0);
  const totalMarks = results.reduce((a, r) => a + r.total_marks, 0);

  return (
    <div className="p-6">
      <Link href="/admin/students" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>

      {/* Profile Header */}
      {studentLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
          <div className="flex gap-5">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2 py-2">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      ) : student ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{student.user.name}</h1>
              <p className="text-gray-500 text-sm mt-1">Roll No: {student.roll_number} · Class {student.class_id ?? "—"}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant={student.is_active ? "success" : "danger"}>{student.is_active ? "Active" : "Inactive"}</Badge>
                <Badge variant="info">Session: {student.session_year}</Badge>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Personal Information</CardTitle></CardHeader>
          <CardContent>
            {studentLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
              </div>
            ) : student ? (
              <dl className="space-y-3 text-sm">
                {[
                  ["Full Name", student.user.name],
                  ["Father's Name", student.father_name],
                  ["Roll Number", student.roll_number],
                  ["Class", student.class_id ?? "—"],
                  ["Gender", student.gender],
                  ["Session Year", student.session_year],
                  ["Email", student.user.email ?? "—"],
                  ["Phone", student.user.phone ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-gray-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : <p className="text-sm text-gray-400">No data yet.</p>}
          </CardContent>
        </Card>

        {/* Attendance */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-green-500" /> Attendance Summary</CardTitle></CardHeader>
          <CardContent>
            {attendanceLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-16 bg-gray-200 rounded mx-auto w-24" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
              </div>
            ) : attendance ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold text-green-600">{attendance.percentage.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500 mt-1">Overall Attendance</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Present", attendance.present, "text-green-600"],
                    ["Absent", attendance.absent, "text-red-600"],
                    ["Late", attendance.late, "text-yellow-600"],
                    ["Leave", attendance.leave, "text-blue-600"],
                  ].map(([label, val, cls]) => (
                    <div key={String(label)} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-semibold ${cls}`}>{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 col-span-2">
                    <span className="text-gray-500">Total Days</span>
                    <span className="font-semibold text-gray-800">{attendance.total_days}</span>
                  </div>
                </div>
              </>
            ) : <p className="text-sm text-gray-400">No data yet.</p>}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-500" /> Results</CardTitle></CardHeader>
          <CardContent className="p-0">
            {resultsLoading ? (
              <div className="p-4 space-y-2 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-100 rounded" />)}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Subject</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Marks</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">%</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Grade</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Pass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700">{r.subject_id}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{r.marks_obtained}/{r.total_marks}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{r.percentage.toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-right"><Badge variant="info">{r.grade}</Badge></td>
                      <td className="px-4 py-2.5 text-right"><Badge variant={r.is_passed ? "success" : "danger"}>{r.is_passed ? "Pass" : "Fail"}</Badge></td>
                    </tr>
                  ))}
                  {results.length > 0 && (
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2.5 font-semibold text-gray-900">Total</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{totalObtained}/{totalMarks}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-green-600">
                        {totalMarks > 0 ? Math.round(totalObtained / totalMarks * 100) : 0}%
                      </td>
                      <td colSpan={2} />
                    </tr>
                  )}
                  {results.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-400 text-sm">No data yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Fee History */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-yellow-500" /> Fee Status</CardTitle></CardHeader>
          <CardContent className="p-0">
            {feesLoading ? (
              <div className="p-4 space-y-2 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-100 rounded" />)}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Month</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Type</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Net</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Paid</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fees.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700">{f.month}</td>
                      <td className="px-4 py-2.5 text-gray-600">{f.fee_type}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">Rs. {f.net_amount}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">Rs. {f.paid_amount}</td>
                      <td className="px-4 py-2.5 text-right">
                        <Badge variant={f.status === "paid" ? "success" : f.status === "overdue" ? "danger" : "warning"}>{f.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-400 text-sm">No data yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
