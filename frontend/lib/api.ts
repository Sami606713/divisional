import axios from "axios";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface StudentOut {
  id: string;
  roll_number: string;
  father_name: string;
  gender: string;
  session_year: string;
  is_active: boolean;
  created_at: string;
  user: { id: string; name: string; email: string | null; phone: string | null; photo: string | null };
  class_id: string | null;
}

export interface StudentCreate {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  father_name: string;
  date_of_birth?: string;
  gender: string;
  cnic_or_bform?: string;
  address?: string;
  class_id?: string;
  session_year: string;
}

export interface StudentUpdate {
  father_name?: string;
  date_of_birth?: string;
  address?: string;
  class_id?: string;
}

export interface AttendanceSummary {
  student_id: string;
  student_name: string;
  total_days: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

export interface ResultOut {
  id: string;
  student_id: string;
  exam_id: string;
  subject_id: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
  is_passed: boolean;
}

export interface PublicMeritEntry {
  student_id: string;
  student_name: string;
  class_name: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  rank: number;
}

export interface PublicExamResultsSummary {
  exam: ExamOut;
  pass_rate: number;
  a_plus_students: number;
  total_students: number;
  merit_list: PublicMeritEntry[];
}

export interface FeeRecordOut {
  id: string;
  student_id: string;
  fee_type: string;
  month: string;
  amount: number;
  net_amount: number;
  paid_amount: number;
  status: string;
  due_date: string | null;
  paid_date: string | null;
  receipt_no: string | null;
}

export interface TeacherOut {
  id: string;
  father_name: string | null;
  cnic: string | null;
  qualification: string | null;
  joining_date: string | null;
  salary: number | null;
  created_at: string;
  user: { id: string; name: string; email: string | null; phone: string | null; photo: string | null };
}

export interface ClassOut {
  id: string;
  name: string;
  section: string;
  session_year: string;
  capacity: number;
  class_teacher_id: string | null;
  created_at: string;
  student_count: number;
}

export interface ClassCreate {
  name: string;
  section: string;
  session_year: string;
  capacity?: number;
  class_teacher_id?: string;
}

export interface AttendanceBulkCreate {
  class_id: string;
  date: string;
  subject_id?: string;
  entries: { student_id: string; status: string; remarks?: string }[];
}

export interface AttendanceOut {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: string;
}

export interface ExamOut {
  id: string;
  name: string;
  type: string;
  session_year: string;
  start_date: string;
  end_date: string;
  is_published: boolean;
}

export interface ResultBulkCreate {
  exam_id: string;
  subject_id: string;
  class_id: string;
  total_marks: number;
  entries: { student_id: string; marks_obtained: number }[];
}

export interface FeeStructureOut {
  id: string;
  name: string;
  amount: number;
  class?: string;
  [key: string]: unknown;
}

export interface FeePaymentCreate {
  studentId: string;
  amount: number;
  feeStructureId: string;
  date?: string;
}

export interface NoticeOut {
  id: string;
  title: string;
  body: string;
  notice_type: string;
  is_pinned: boolean;
  published_at: string;
  created_at: string;
}

export interface NoticeCreate {
  title: string;
  body: string;
  notice_type: string;
  attachment?: string | null;
  is_pinned?: boolean;
  published_at: string;
}

export interface TimetableOut {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  day: string;
  period: number;
  start_time: string;
  end_time: string;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  async login(
    credential: string,
    password: string,
    role: string
  ): Promise<{ access_token: string; refresh_token: string; token_type: string; role: string; user_id: string; name: string }> {
    const res = await api.post("/auth/login", { credential, password });
    return res.data;
  },
  async register(data: { name: string; email: string; phone?: string; password: string; role: string }): Promise<{ access_token: string; refresh_token: string; role: string; user_id: string; name: string }> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  async changePassword(current_password: string, new_password: string): Promise<void> {
    await api.post("/auth/change-password", { current_password, new_password });
  },
};

// ─── Students API ─────────────────────────────────────────────────────────────

export const studentsApi = {
  async me(): Promise<StudentOut> {
    const res = await api.get("/students/me");
    return res.data;
  },
  async list(skip = 0, limit = 100): Promise<StudentOut[]> {
    const res = await api.get("/students", { params: { skip, limit } });
    return res.data;
  },
  async get(id: string): Promise<StudentOut> {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },
  async create(data: StudentCreate): Promise<StudentOut> {
    const res = await api.post("/students", data);
    return res.data;
  },
  async update(id: string, data: StudentUpdate): Promise<StudentOut> {
    const res = await api.put(`/students/${id}`, data);
    return res.data;
  },
  async activate(id: string): Promise<void> {
    await api.post(`/students/${id}/activate`);
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },
  async getAttendanceSummary(id: string): Promise<AttendanceSummary> {
    const res = await api.get(`/students/${id}/attendance`);
    return res.data;
  },
  async getResults(id: string): Promise<ResultOut[]> {
    const res = await api.get(`/students/${id}/results`);
    return res.data;
  },
  async getFees(id: string): Promise<FeeRecordOut[]> {
    const res = await api.get(`/students/${id}/fees`);
    return res.data;
  },
};

// ─── Teachers API ─────────────────────────────────────────────────────────────

export const teachersApi = {
  async list(): Promise<TeacherOut[]> {
    const res = await api.get("/teachers");
    return res.data;
  },
  async listPublic(): Promise<TeacherOut[]> {
    const res = await api.get("/teachers/public");
    return res.data;
  },
  async me(): Promise<TeacherOut> {
    const res = await api.get("/teachers/me");
    return res.data;
  },
  async get(id: string): Promise<TeacherOut> {
    const res = await api.get(`/teachers/${id}`);
    return res.data;
  },
  async create(data: unknown): Promise<TeacherOut> {
    const res = await api.post("/teachers", data);
    return res.data;
  },
  async update(id: string, data: unknown): Promise<TeacherOut> {
    const res = await api.put(`/teachers/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/teachers/${id}`);
  },
};

// ─── Classes API ──────────────────────────────────────────────────────────────

export const classesApi = {
  async list(): Promise<ClassOut[]> {
    const res = await api.get("/classes");
    return res.data;
  },
  async listPublic(): Promise<ClassOut[]> {
    const res = await api.get("/classes/public");
    return res.data;
  },
  async get(id: string): Promise<ClassOut> {
    const res = await api.get(`/classes/${id}`);
    return res.data;
  },
  async create(data: ClassCreate): Promise<ClassOut> {
    const res = await api.post("/classes", data);
    return res.data;
  },
  async update(id: string, data: Partial<ClassCreate>): Promise<ClassOut> {
    const res = await api.put(`/classes/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/classes/${id}`);
  },
};

// ─── Attendance API ───────────────────────────────────────────────────────────

export const attendanceApi = {
  async bulkMark(data: AttendanceBulkCreate): Promise<void> {
    await api.post("/attendance/bulk", data);
  },
  async getByClass(classId: string, date?: string): Promise<AttendanceOut[]> {
    const res = await api.get(`/attendance/class/${classId}`, { params: { date } });
    return res.data;
  },
  async getStudentSummary(studentId: string): Promise<AttendanceSummary> {
    const res = await api.get(`/attendance/student/${studentId}/summary`);
    return res.data;
  },
};

// ─── Exams API ────────────────────────────────────────────────────────────────

export const examsApi = {
  async list(): Promise<ExamOut[]> {
    const res = await api.get("/exams");
    return res.data;
  },
  async listPublic(): Promise<ExamOut[]> {
    const res = await api.get("/exams/public");
    return res.data;
  },
  async get(id: string): Promise<ExamOut> {
    const res = await api.get(`/exams/${id}`);
    return res.data;
  },
  async create(data: unknown): Promise<ExamOut> {
    const res = await api.post("/exams", data);
    return res.data;
  },
  async enterResults(data: ResultBulkCreate): Promise<void> {
    await api.post("/exams/results/bulk", data);
  },
  async getStudentResults(studentId: string, examId?: string): Promise<ResultOut[]> {
    const res = await api.get(`/exams/results/student/${studentId}`, {
      params: examId ? { exam_id: examId } : {},
    });
    return res.data;
  },
  async getPublicResults(examId: string): Promise<PublicExamResultsSummary> {
    const res = await api.get(`/exams/public/${examId}/results`);
    return res.data;
  },
  async publish(id: string): Promise<void> {
    await api.post(`/exams/${id}/publish`);
  },
};

// ─── Fees API ─────────────────────────────────────────────────────────────────

export const feesApi = {
  async listStructures(): Promise<FeeStructureOut[]> {
    const res = await api.get("/fees/structures");
    return res.data;
  },
  async createStructure(data: unknown): Promise<FeeStructureOut> {
    const res = await api.post("/fees/structures", data);
    return res.data;
  },
  async recordPayment(data: FeePaymentCreate): Promise<FeeRecordOut> {
    const res = await api.post("/fees/payments", data);
    return res.data;
  },
  async getStudentFees(studentId: string): Promise<FeeRecordOut[]> {
    const res = await api.get(`/fees/student/${studentId}`);
    return res.data;
  },
};

// ─── Notices API ──────────────────────────────────────────────────────────────

export const noticesApi = {
  async list(skip = 0, limit = 100): Promise<NoticeOut[]> {
    const res = await api.get("/notices", { params: { skip, limit } });
    return res.data;
  },
  async get(id: string): Promise<NoticeOut> {
    const res = await api.get(`/notices/${id}`);
    return res.data;
  },
  async create(data: NoticeCreate): Promise<NoticeOut> {
    const res = await api.post("/notices", data);
    return res.data;
  },
  async update(id: string, data: Partial<NoticeCreate>): Promise<NoticeOut> {
    const res = await api.put(`/notices/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/notices/${id}`);
  },
};

// ─── Subjects API ─────────────────────────────────────────────────────────────

export interface SubjectOut {
  id: string;
  name: string;
  code: string | null;
  class_id: string;
  teacher_id: string | null;
}

export const subjectsApi = {
  async list(class_id?: string): Promise<SubjectOut[]> {
    const res = await api.get("/subjects", { params: class_id ? { class_id } : {} });
    return res.data;
  },
  async listPublic(class_id?: string): Promise<SubjectOut[]> {
    const res = await api.get("/subjects/public", { params: class_id ? { class_id } : {} });
    return res.data;
  },
  async create(data: { name: string; code?: string; class_id: string; teacher_id?: string }): Promise<SubjectOut> {
    const res = await api.post("/subjects", data);
    return res.data;
  },
  async update(id: string, data: { name?: string; code?: string; class_id?: string; teacher_id?: string | null }): Promise<SubjectOut> {
    const res = await api.put(`/subjects/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/subjects/${id}`);
  },
};

// ─── Timetable API ────────────────────────────────────────────────────────────

export const timetableApi = {
  async getByClass(classId: string): Promise<TimetableOut[]> {
    const res = await api.get(`/timetable/class/${classId}`);
    return res.data;
  },
  async getByTeacher(teacherId: string): Promise<TimetableOut[]> {
    const res = await api.get(`/timetable/teacher/${teacherId}`);
    return res.data;
  },
  async create(data: { class_id: string; subject_id: string; teacher_id: string; day: string; period: number; start_time: string; end_time: string }): Promise<TimetableOut> {
    const res = await api.post("/timetable", data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/timetable/${id}`);
  },
};

export default api;
