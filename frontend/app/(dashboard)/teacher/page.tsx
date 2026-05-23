"use client";
import { useQuery } from "@tanstack/react-query";
import { teachersApi, timetableApi, classesApi, studentsApi, noticesApi, subjectsApi, NoticeOut, TimetableOut, ClassOut, SubjectOut } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ClipboardList, Clock, Bell } from "lucide-react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherDashboard() {
  const today = DAY_NAMES[new Date().getDay()];

  const { data: teacher } = useQuery({
    queryKey: ["teacher-me"],
    queryFn: () => teachersApi.me(),
  });

  const { data: timetable = [] } = useQuery<TimetableOut[]>({
    queryKey: ["timetable-teacher", teacher?.id],
    queryFn: () => timetableApi.getByTeacher(teacher!.id),
    enabled: !!teacher?.id,
  });

  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects-all"],
    queryFn: () => subjectsApi.list(),
    enabled: timetable.length > 0,
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const { data: allStudents = [] } = useQuery({
    queryKey: ["students-all"],
    queryFn: () => studentsApi.list(0, 500),
    enabled: classes.length > 0,
  });

  const { data: notices = [], isLoading: loadingNotices } = useQuery<NoticeOut[]>({
    queryKey: ["notices"],
    queryFn: () => noticesApi.list(0, 5),
  });

  const subjectMap = Object.fromEntries((subjects as SubjectOut[]).map((s) => [s.id, s.name]));
  const classMap = Object.fromEntries((classes as ClassOut[]).map((c) => [c.id, `${c.name}${c.section ? `-${c.section}` : ""}`]));

  // Classes this teacher teaches (unique class_ids from timetable)
  const myClassIds = [...new Set((timetable as TimetableOut[]).map((t) => t.class_id))];
  const myClasses = myClassIds.length;

  // Total students in teacher's classes
  const myStudents = (allStudents as { class_id: string | null }[]).filter(
    (s) => s.class_id && myClassIds.includes(s.class_id)
  ).length;

  // Today's schedule from timetable
  const todaySlots = (timetable as TimetableOut[])
    .filter((t) => t.day === today)
    .sort((a, b) => a.period - b.period);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back{teacher?.user?.name ? `, ${teacher.user.name}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="My Classes" value={teacher ? String(myClasses) : "—"} icon={BookOpen} color="green" />
        <StatCard title="Total Students" value={teacher ? String(myStudents) : "—"} icon={Users} color="blue" />
        <StatCard title="Today's Periods" value={String(todaySlots.length)} icon={Clock} color="yellow" />
        <StatCard title="Exams" value="—" icon={ClipboardList} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" /> Today&apos;s Schedule
              <span className="text-sm font-normal text-gray-400 ml-1">({today})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaySlots.length === 0 ? (
              <p className="text-sm text-gray-400">No classes scheduled for today.</p>
            ) : (
              todaySlots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {subjectMap[slot.subject_id] ?? "Subject"}
                    </p>
                    <p className="text-xs text-gray-500">Class {classMap[slot.class_id] ?? slot.class_id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 font-mono block">
                      {slot.start_time}–{slot.end_time}
                    </span>
                    <span className="text-xs text-gray-300">Period {slot.period}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" /> Recent Notices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingNotices && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}
            {!loadingNotices && notices.slice(0, 4).map((n) => (
              <div key={n.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info">{n.notice_type}</Badge>
                  <span className="text-xs text-gray-400">{new Date(n.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {!loadingNotices && notices.length === 0 && (
              <p className="text-sm text-gray-400">No notices yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
