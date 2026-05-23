"use client";
import { useQuery } from "@tanstack/react-query";
import { noticesApi, NoticeOut } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Bell, Pin } from "lucide-react";

export default function ParentNoticesPage() {
  const { data: notices = [], isLoading } = useQuery<NoticeOut[]>({
    queryKey: ["notices"],
    queryFn: () => noticesApi.list(0, 50),
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
        <p className="text-gray-500 text-sm mt-1">School announcements for parents</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet.</p>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                    {notice.is_pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notice.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info">{notice.notice_type}</Badge>
                    <span className="text-xs text-gray-400">{new Date(notice.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
