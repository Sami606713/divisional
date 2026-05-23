"use client";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, AttendanceSummary } from "@/lib/api";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

export default function StudentAttendancePage() {
  const { data: me, isLoading: loadingMe } = useQuery({
    queryKey: ["student-me"],
    queryFn: () => studentsApi.me(),
  });

  const { data: attendance, isLoading: loadingAttendance } = useQuery<AttendanceSummary>({
    queryKey: ["my-attendance", me?.id],
    queryFn: () => studentsApi.getAttendanceSummary(me!.id),
    enabled: !!me?.id,
  });

  const isLoading = loadingMe || loadingAttendance;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">
          {me ? `Roll No: ${me.roll_number}` : "Attendance summary"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      ) : !attendance ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          No attendance records found yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Present",  value: attendance.present, icon: CheckCircle, color: "text-green-600 bg-green-50" },
              { label: "Absent",   value: attendance.absent,  icon: XCircle,     color: "text-red-600 bg-red-50" },
              { label: "Late",     value: attendance.late,    icon: AlertCircle, color: "text-yellow-600 bg-yellow-50" },
              { label: "Leave",    value: attendance.leave,   icon: Clock,       color: "text-blue-600 bg-blue-50" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Overall Attendance</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    attendance.percentage >= 90 ? "bg-green-500" :
                    attendance.percentage >= 75 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(attendance.percentage, 100)}%` }}
                />
              </div>
              <span className={`text-lg font-bold w-16 text-right ${
                attendance.percentage >= 90 ? "text-green-600" :
                attendance.percentage >= 75 ? "text-yellow-600" : "text-red-600"
              }`}>
                {attendance.percentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Total school days: <span className="font-medium">{attendance.total_days}</span>
            </p>
            {attendance.percentage < 75 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-xs text-red-700">
                Warning: Attendance below 75%. Please speak with your class teacher.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
