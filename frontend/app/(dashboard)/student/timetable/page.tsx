"use client";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, timetableApi, subjectsApi, classesApi, TimetableOut, SubjectOut, ClassOut } from "@/lib/api";
import { Clock } from "lucide-react";

const DAYS = [
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
] as const;

const SUBJECT_COLORS = [
  "bg-blue-50 text-blue-700", "bg-green-50 text-green-700", "bg-purple-50 text-purple-700",
  "bg-yellow-50 text-yellow-700", "bg-orange-50 text-orange-700", "bg-pink-50 text-pink-700",
  "bg-teal-50 text-teal-700", "bg-red-50 text-red-700", "bg-indigo-50 text-indigo-700",
];

function colorForSubject(name: string, colorMap: Map<string, string>): string {
  if (!colorMap.has(name)) {
    colorMap.set(name, SUBJECT_COLORS[colorMap.size % SUBJECT_COLORS.length]);
  }
  return colorMap.get(name)!;
}

export default function StudentTimetablePage() {
  const { data: me, isLoading: loadingMe } = useQuery({
    queryKey: ["student-me"],
    queryFn: () => studentsApi.me(),
  });

  const { data: timetable = [], isLoading: loadingTT } = useQuery<TimetableOut[]>({
    queryKey: ["timetable-class", me?.class_id],
    queryFn: () => timetableApi.getByClass(me!.class_id!),
    enabled: !!me?.class_id,
  });

  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects", me?.class_id],
    queryFn: () => subjectsApi.list(me!.class_id!),
    enabled: !!me?.class_id,
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes"],
    queryFn: () => classesApi.list(),
  });

  const isLoading = loadingMe || loadingTT;

  const subjectMap = Object.fromEntries((subjects as SubjectOut[]).map((s) => [s.id, s.name]));
  const myClass = (classes as ClassOut[]).find((c) => c.id === me?.class_id);
  const className = myClass ? `${myClass.name}${myClass.section ? `-${myClass.section}` : ""}` : "";

  const periods = Array.from(new Set(timetable.map((t) => t.period))).sort((a, b) => a - b);

  const colorMap = new Map<string, string>();

  const cell = (day: string, period: number) => {
    const slot = timetable.find((t) => t.day === day && t.period === period);
    if (!slot) return <span className="text-gray-300 text-xs">—</span>;
    const name = subjectMap[slot.subject_id] ?? "Unknown";
    const time = slot.start_time && slot.end_time ? `${slot.start_time}–${slot.end_time}` : "";
    return (
      <div className={`inline-flex flex-col items-center px-2 py-1.5 rounded-lg text-xs font-medium ${colorForSubject(name, colorMap)}`}>
        <span>{name}</span>
        {time && <span className="opacity-60 font-normal mt-0.5">{time}</span>}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-500 text-sm mt-1">
          {me ? `Roll No: ${me.roll_number}${className ? ` — Class ${className}` : ""}` : "Weekly schedule"}
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ) : timetable.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          No timetable has been set for your class yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-20">
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
                    <td className="px-4 py-3 font-semibold text-gray-700 text-center">{period}</td>
                    {DAYS.map((day) => (
                      <td key={day.value} className="px-2 py-3 text-center">{cell(day.value, period)}</td>
                    ))}
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
