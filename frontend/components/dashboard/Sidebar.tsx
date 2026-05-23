"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentsApi, teachersApi } from "@/lib/api";
import { getUserCredential } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { GraduationCap, LayoutDashboard, Users, BookOpen, CalendarDays, ClipboardList, DollarSign, Bell, Settings, LogOut, Clock, FileText, UserCheck, School, ChevronRight, Menu, X } from "lucide-react";

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/teachers", icon: UserCheck, label: "Teachers" },
  { href: "/admin/classes", icon: School, label: "Classes" },
  { href: "/admin/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/admin/admissions", icon: FileText, label: "Admissions" },
  { href: "/admin/attendance", icon: CalendarDays, label: "Attendance" },
  { href: "/admin/exams", icon: ClipboardList, label: "Exams" },
  { href: "/admin/results", icon: BookOpen, label: "Results" },
  { href: "/admin/fees", icon: DollarSign, label: "Fees" },
  { href: "/admin/timetable", icon: Clock, label: "Timetable" },
  { href: "/admin/notices", icon: Bell, label: "Notices" },
];

const teacherLinks = [
  { href: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/teacher/attendance", icon: CalendarDays, label: "Attendance" },
  { href: "/teacher/marks", icon: ClipboardList, label: "Marks Entry" },
  { href: "/teacher/timetable", icon: Clock, label: "Timetable" },
  { href: "/teacher/notices", icon: Bell, label: "Notices" },
];

const studentLinks = [
  { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/attendance", icon: CalendarDays, label: "Attendance" },
  { href: "/student/results", icon: BookOpen, label: "Results" },
  { href: "/student/timetable", icon: Clock, label: "Timetable" },
  { href: "/student/fees", icon: DollarSign, label: "Fees" },
  { href: "/student/notices", icon: Bell, label: "Notices" },
];

const parentLinks = [
  { href: "/parent", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/parent/attendance", icon: CalendarDays, label: "Attendance" },
  { href: "/parent/results", icon: BookOpen, label: "Results" },
  { href: "/parent/fees", icon: DollarSign, label: "Fees" },
  { href: "/parent/notices", icon: Bell, label: "Notices" },
];

function getLinks(role: string) {
  if (role === "admin" || role === "super_admin") return adminLinks;
  if (role === "teacher") return teacherLinks;
  if (role === "student") return studentLinks;
  return parentLinks;
}

function getRoleSub(role: string) {
  if (role === "admin" || role === "super_admin") return "School Administrator";
  if (role === "teacher") return "Teaching Staff";
  if (role === "student") return "Student";
  return "Parent / Guardian";
}

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const links = getLinks(role);

  const { data: studentMe } = useQuery({
    queryKey: ["sidebar-student-me"],
    queryFn: () => studentsApi.me(),
    enabled: role === "student",
    staleTime: 5 * 60 * 1000,
  });

  const { data: teacherMe } = useQuery({
    queryKey: ["sidebar-teacher-me"],
    queryFn: () => teachersApi.me(),
    enabled: role === "teacher",
    staleTime: 5 * 60 * 1000,
  });

  const userName = typeof window !== "undefined" ? (localStorage.getItem("user_name") ?? role) : role;
  const storedCredential = typeof window !== "undefined" ? getUserCredential() : null;
  const actualIdentifier =
    role === "student"
      ? studentMe?.roll_number ?? storedCredential
      : role === "teacher"
        ? teacherMe?.user.email ?? teacherMe?.user.phone ?? storedCredential
        : storedCredential ?? getRoleSub(role);
  const label = userName;
  const sub = actualIdentifier ?? getRoleSub(role);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleNavigate = () => {
    setOpen(false);
  };

  const brandBlock = (
    <div className="p-4 border-b border-gray-100">
      <Link href="/" className="flex items-center gap-2" onClick={handleNavigate}>
        <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 leading-tight">DPHS Pharhala</p>
          <p className="text-[10px] text-gray-400">Haripur, KPK</p>
        </div>
      </Link>
    </div>
  );

  const profileBlock = (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-700 font-semibold text-sm">{label[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{label}</p>
          <p className="text-xs text-gray-500 truncate">{sub}</p>
        </div>
      </div>
    </div>
  );

  const sidebarBody = (
    <>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {links.map(({ href, icon: Icon, label: lbl }) => {
          const active = pathname === href || (href !== `/${role}` && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group",
                active ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-green-600" : "text-gray-400 group-hover:text-gray-600")} />
              <span className="flex-1">{lbl}</span>
              {active && <ChevronRight className="w-3 h-3 text-green-500" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <Link
          href={`/${role}/settings`}
          onClick={handleNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">DPHS Pharhala</p>
            <p className="truncate text-xs text-gray-500">{sub}</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        {brandBlock}
        {profileBlock}
        {sidebarBody}
      </aside>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-gray-950/45 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col border-r border-gray-200 bg-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-end border-b border-gray-100 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {brandBlock}
            {profileBlock}
            {sidebarBody}
          </aside>
        </>
      )}
    </>
  );
}
