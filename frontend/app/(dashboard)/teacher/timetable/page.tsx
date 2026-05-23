"use client";
import { useQuery } from "@tanstack/react-query";
import { teachersApi, timetableApi, subjectsApi, classesApi, TimetableOut, SubjectOut, ClassOut } from "@/lib/api";
import { Clock } from "lucide-react";

const DAYS = [
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
] as const;

const DAY_COLORS: Record<string, string> = {
  sat: "bg-purple-50 text-purple-700",
  sun: "bg-blue-50 text-blue-700",
  mon: "bg-green-50 text-green-700",
  tue: "bg-yellow-50 text-yellow-700",
  wed: "bg-orange-50 text-orange-700",
  thu: "bg-pink-50 text-pink-700",
};

export default function TeacherTimetablePage() {
  const { data: teacher, isLoading: loadingTeacher, isError } = useQuery({
    queryKey: ["teacher-me"],
    queryFn: () => teachersApi.me(),
  });

  const { data: timetable = [], isLoading: loadingTimetable } = useQuery<TimetableOut[]>({
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
    enabled: timetable.length > 0,
  });

  const subjectMap = Object.fromEntries((subjects as SubjectOut[]).map((s) => [s.id, s.name]));
  const classMap = Object.fromEntries((classes as ClassOut[]).map((c) => [c.id, `${c.name}${c.section ? `-${c.section}` : ""}`]));

  // Group by period → day
  const maxPeriod = timetable.length > 0 ? Math.max(...timetable.map((t) => t.period)) : 0;
  const periods = Array.from({ length: maxPeriod }, (_, i) => i + 1);

  const getSlot = (day: string, period: number) =>
    timetable.find((t) => t.day === day && t.period === period);

  const isLoading = loadingTeacher || loadingTimetable;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-500 text-sm mt-1">
          {teacher?.user?.name ? `${teacher.user.name} — Weekly Schedule` : "Weekly Schedule"}
        </p>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          No teacher profile found for your account. Please contact the administrator.
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && !isError && timetable.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          No timetable entries assigned yet. Contact your administrator.
        </div>
      )}

      {!isLoading && !isError && timetable.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Period</div>
                  </th>
                  {DAYS.map((d) => (
                    <th key={d.value} className="text-center px-4 py-3 font-semibold text-gray-600">{d.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periods.map((period) => (
                  <tr key={period} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                      P{period}
                    </td>
                    {DAYS.map((day) => {
                      const slot = getSlot(day.value, period);
                      if (!slot) return (
                        <td key={day.value} className="px-2 py-3 text-center">
                          <span className="text-gray-300 text-xs">—</span>
                        </td>
                      );
                      const subjName = subjectMap[slot.subject_id] ?? "Subject";
                      const className = classMap[slot.class_id] ?? "Class";
                      const color = DAY_COLORS[day.value] ?? "bg-gray-50 text-gray-600";
                      return (
                        <td key={day.value} className="px-2 py-3 text-center">
                          <div className={`inline-block px-2 py-1.5 rounded-lg text-xs font-medium ${color}`}>
                            <div>{subjName}</div>
                            <div className="text-[10px] opacity-70">Cl. {className}</div>
                            {slot.start_time && (
                              <div className="text-[10px] opacity-60 font-mono">{slot.start_time}–{slot.end_time}</div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
