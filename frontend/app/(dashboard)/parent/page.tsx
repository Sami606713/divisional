"use client";
import { useQuery } from "@tanstack/react-query";
import { noticesApi, NoticeOut } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { CalendarDays, BookOpen, DollarSign, Bell } from "lucide-react";

export default function ParentDashboard() {
  const { data: notices = [], isLoading } = useQuery<NoticeOut[]>({
    queryKey: ["notices"],
    queryFn: () => noticesApi.list(0, 5),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">School information portal</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700 font-medium">Student account not linked.</p>
        <p className="text-sm text-blue-600 mt-1">Contact the school admin to link your child&apos;s account to this parent profile.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Attendance" value="—" icon={CalendarDays} color="green" sub="Link child account" />
        <StatCard title="Last Exam" value="—" icon={BookOpen} color="blue" sub="Link child account" />
        <StatCard title="Fee Status" value="—" icon={DollarSign} color="red" sub="Link child account" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500" /> Recent Notices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && notices.slice(0, 5).map((n) => (
            <div key={n.id} className="text-sm border-b border-gray-100 pb-2 last:border-0">
              <p className="font-medium text-gray-800 line-clamp-1">{n.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(n.published_at).toLocaleDateString()}</p>
            </div>
          ))}
          {!isLoading && notices.length === 0 && <p className="text-sm text-gray-400">No data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
