"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { classesApi, ClassOut, subjectsApi, SubjectOut, teachersApi, TeacherOut } from "@/lib/api";
import { GraduationCap, Phone } from "lucide-react";

const colors = ["bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-yellow-100 text-yellow-700", "bg-red-100 text-red-700", "bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700", "bg-teal-100 text-teal-700"];

export function FacultyClient() {
  const { data: teachers = [], isLoading: loadingTeachers } = useQuery<TeacherOut[]>({
    queryKey: ["teachers-public"],
    queryFn: () => teachersApi.listPublic(),
  });

  const { data: subjects = [] } = useQuery<SubjectOut[]>({
    queryKey: ["subjects-public"],
    queryFn: () => subjectsApi.listPublic(),
  });

  const { data: classes = [] } = useQuery<ClassOut[]>({
    queryKey: ["classes-public"],
    queryFn: () => classesApi.listPublic(),
  });

  const classMap = useMemo(
    () => Object.fromEntries((classes as ClassOut[]).map((cls) => [cls.id, `${cls.name}-${cls.section}`])),
    [classes]
  );

  const faculty = useMemo(
    () =>
      (teachers as TeacherOut[]).map((teacher) => {
        const assignedSubjects = (subjects as SubjectOut[]).filter((subject) => subject.teacher_id === teacher.id);
        const subjectNames = Array.from(new Set(assignedSubjects.map((subject) => subject.name)));
        const classNames = Array.from(new Set(
          assignedSubjects
            .map((subject) => classMap[subject.class_id])
            .filter((value): value is string => Boolean(value))
        ));
        return {
          ...teacher,
          subjectLabel: subjectNames.length ? subjectNames.join(", ") : "Faculty Member",
          classLabel: classNames.length ? classNames.join(", ") : "Not assigned yet",
        };
      }),
    [classMap, subjects, teachers]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Faculty</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Meet our dedicated and qualified team of teachers committed to student success.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadingTeachers ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gray-100" />
              <div className="h-5 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-1/2 mx-auto" />
              <div className="h-4 bg-gray-100 rounded mb-3 w-2/3 mx-auto" />
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))
        ) : faculty.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center text-gray-500">
            No faculty records are available yet.
          </div>
        ) : (
          faculty.map((teacher, i) => (
            <div key={teacher.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold ${colors[i % colors.length]}`}>
                {teacher.user?.name.split(" ")[1]?.[0] || teacher.user?.name[0] || "T"}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{teacher.user?.name ?? "Teacher"}</h3>
              <p className="text-sm text-green-600 font-medium mb-1">{teacher.subjectLabel}</p>
              <p className="text-xs text-gray-500 mb-3">{teacher.qualification ?? "Qualification not added"}</p>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 mb-1">Classes: <span className="text-gray-600">{teacher.classLabel}</span></p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                  <Phone className="w-3 h-3" />
                  <span>{teacher.user?.phone ?? "Phone not added"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Administrative Staff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "Principal", role: "School Administration", icon: GraduationCap },
            { name: "Vice Principal", role: "Academic Affairs", icon: GraduationCap },
            { name: "Admin Officer", role: "School Management", icon: GraduationCap },
          ].map(({ name, role, icon: Icon }) => (
            <div key={name} className="bg-green-50 rounded-xl border border-green-100 p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Icon className="w-7 h-7 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
