"use client";
import { useQuery } from "@tanstack/react-query";
import { noticesApi, NoticeOut } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookOpen, DollarSign, Bell } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { data: notices = [], isLoading } = useQuery<NoticeOut[]>({
    queryKey: ["notices"],
    queryFn: () => noticesApi.list(0, 5),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/student/attendance">
          <StatCard title="Attendance" value="View" icon={CalendarDays} color="green" sub="View your attendance" />
        </Link>
        <Link href="/student/results">
          <StatCard title="Results" value="View" icon={BookOpen} color="blue" sub="View your results" />
        </Link>
        <Link href="/student/fees">
          <StatCard title="Fee Status" value="View" icon={DollarSign} color="yellow" sub="View fee status" />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500" /> Recent Notices</CardTitle>
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
            <div key={n.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{n.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="info" className="text-xs">{n.notice_type}</Badge>
                <span className="text-xs text-gray-400">{new Date(n.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {!isLoading && notices.length === 0 && <p className="text-sm text-gray-400">No data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
