"use client";
import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { attendanceApi, classesApi, studentsApi, noticesApi, examsApi, teachersApi, ClassOut, StudentOut, NoticeOut, ExamOut } from "@/lib/api";
import { Users, UserCheck, School, Bell, TrendingUp, CalendarDays, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AttendanceRecordLike = {
  status: string;
  studentId?: string;
  student_id?: string;
};

export default function AdminDashboard() {
  const today = useMemo(() => new Date(), []);
  const daysInMonth = today.getDate();
  const monthDates = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth(), index + 1);
        const iso = date.toISOString().split("T")[0];
        return {
          iso,
          label: date.toLocaleDateString("en-PK", { day: "numeric", month: "short" }),
        };
      }),
    [daysInMonth, today]
  );

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsApi.list(0, 500),
  });

  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teachersApi.list(),
  });

  const { data: notices = [], isLoading: noticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => noticesApi.list(),
  });

  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: () => examsApi.list(),
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const classMap = useMemo(
    () =>
      Object.fromEntries(
        (classes as ClassOut[]).map((cls) => [cls.id, `Class ${cls.name}${cls.section ? `-${cls.section}` : ""}`])
      ),
    [classes]
  );

  const attendanceQueries = useQueries({
    queries: monthDates.flatMap((dateItem) =>
      (classes as ClassOut[]).map((cls) => ({
        queryKey: ["attendance-dashboard", cls.id, dateItem.iso],
        queryFn: () => attendanceApi.getByClass(cls.id, dateItem.iso),
        enabled: (classes as ClassOut[]).length > 0,
        staleTime: 5 * 60 * 1000,
      }))
    ),
  });

  const deriveExamStatus = (exam: ExamOut) => {
    if (exam.is_published) {
      const now = new Date();
      const end = new Date(exam.end_date);
      const start = new Date(exam.start_date);
      if (now > end) return "Completed";
      if (now >= start) return "Ongoing";
      return "Published";
    }
    return "Draft";
  };

  const monthlyAttendanceData = useMemo(() => {
    if ((classes as ClassOut[]).length === 0) return [];

    return monthDates.map((dateItem, dateIndex) => {
      let present = 0;
      let absent = 0;
      let late = 0;
      let leave = 0;
      let recorded = 0;

      (classes as ClassOut[]).forEach((_, classIndex) => {
        const queryIndex = dateIndex * (classes as ClassOut[]).length + classIndex;
        const records = (attendanceQueries[queryIndex]?.data ?? []) as AttendanceRecordLike[];
        if (records.length > 0) {
          recorded += records.length;
        }
        records.forEach((record) => {
          if (record.status === "present") present++;
          else if (record.status === "absent") absent++;
          else if (record.status === "late") late++;
          else if (record.status === "leave") leave++;
        });
      });

      const total = present + absent + late + leave;
      return {
        date: dateItem.label,
        present,
        absent,
        late,
        leave,
        recorded,
        attendanceRate: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
      };
    }).filter((item) => item.recorded > 0);
  }, [attendanceQueries, classes, monthDates]);

  const attendanceChartLoading = attendanceQueries.some((query) => query.isLoading);
  const monthlyPeak = monthlyAttendanceData.reduce((max, item) => Math.max(max, item.present + item.absent + item.late + item.leave), 0);
  const averageAttendanceRate = monthlyAttendanceData.length > 0
    ? Math.round(monthlyAttendanceData.reduce((sum, item) => sum + item.attendanceRate, 0) / monthlyAttendanceData.length)
    : 0;
  const latestAttendance = monthlyAttendanceData[monthlyAttendanceData.length - 1];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — DPHS Pharhala | Session 2025–2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={studentsLoading ? "…" : String(students.length || "0")} icon={Users} color="green" sub="+12 this month" />
        <StatCard title="Total Teachers" value={teachersLoading ? "…" : String(teachers.length || "0")} icon={UserCheck} color="blue" sub="All active" />
        <StatCard
          title="Classes & Sections"
          value={classes.length ? String(classes.length) : "0"}
          icon={School}
          color="yellow"
          sub={classes.length ? `${classes.map((cls) => cls.section).filter(Boolean).length} active sections` : "Manage via Classes"}
        />
        <StatCard title="Total Notices" value={noticesLoading ? "…" : String(notices.length || "0")} icon={Bell} color="red" sub="school-wide" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Monthly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceChartLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
                </div>
                <div className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
              </div>
            ) : monthlyAttendanceData.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Attendance data will appear after attendance is recorded.</p>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-green-700">Average Rate</p>
                    <p className="mt-2 text-3xl font-bold text-green-800">{averageAttendanceRate}%</p>
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-700">Latest Recorded Day</p>
                    <p className="mt-2 text-lg font-semibold text-blue-900">{latestAttendance?.date ?? "—"}</p>
                    <p className="mt-1 text-sm text-blue-700">{latestAttendance ? `${latestAttendance.present} present · ${latestAttendance.absent} absent` : "No data"}</p>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-700">Peak Recorded Volume</p>
                    <p className="mt-2 text-3xl font-bold text-amber-900">{monthlyPeak}</p>
                    <p className="mt-1 text-sm text-amber-700">attendance marks in a single day this month</p>
                  </div>
                </div>

                <div className="h-80 rounded-3xl border border-gray-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,1)_100%)] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyAttendanceData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="absentFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 16, border: "1px solid #dcfce7", boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)" }}
                        formatter={(value: number, name: string) => [value, name === "present" ? "Present" : name === "absent" ? "Absent" : name === "late" ? "Late" : "Leave"]}
                      />
                      <Legend formatter={(value) => value === "present" ? "Present" : value === "absent" ? "Absent" : value === "late" ? "Late" : "Leave"} />
                      <Area type="monotone" dataKey="present" stroke="#16a34a" strokeWidth={3} fill="url(#presentFill)" />
                      <Area type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} fill="url(#absentFill)" />
                      <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                      <Area type="monotone" dataKey="leave" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500" /> Recent Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {noticesLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}
            {!noticesLoading && (notices as NoticeOut[]).slice(0, 4).map((n) => (
              <div key={n.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{n.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info" className="text-xs">{n.notice_type}</Badge>
                  <span className="text-xs text-gray-400">{new Date(n.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {!noticesLoading && notices.length === 0 && <p className="text-sm text-gray-400">No data yet.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Recent Students</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Roll No</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Class</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentsLoading && (
                  <tr><td colSpan={4} className="px-4 py-4">
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />)}
                    </div>
                  </td></tr>
                )}
                {!studentsLoading && (students as StudentOut[]).slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{s.user.name}</td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs font-mono">{s.roll_number}</td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {s.class_id ? (classMap[s.class_id] ?? "—") : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={s.is_active ? "success" : "danger"}>{s.is_active ? "Active" : "Inactive"}</Badge>
                    </td>
                  </tr>
                ))}
                {!studentsLoading && students.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-400 text-sm">No data yet.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Exams Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-purple-600" /> Exams Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {examsLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            )}
            {!examsLoading && (exams as ExamOut[]).map((e) => {
              const status = deriveExamStatus(e);
              return (
                <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(e.start_date).toLocaleDateString()} · {e.session_year}
                    </p>
                  </div>
                  <Badge variant={status === "Completed" ? "success" : status === "Ongoing" ? "warning" : status === "Published" ? "info" : "default"}>
                    {status}
                  </Badge>
                </div>
              );
            })}
            {!examsLoading && exams.length === 0 && <p className="text-sm text-gray-400">No data yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
