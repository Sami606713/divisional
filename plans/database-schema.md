# Database Schema — Full Prisma Schema
## DPHS Pharhala School Management System

---

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

enum Role {
  SUPER_ADMIN
  ADMIN
  TEACHER
  STUDENT
  PARENT
}

enum Gender {
  MALE
  FEMALE
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  LEAVE
}

enum ExamType {
  MONTHLY
  MIDTERM
  ANNUAL
  BOARD
}

enum FeeType {
  ADMISSION
  TUITION
  EXAM
  LIBRARY
  SPORTS
  COMPUTER
  OTHER
}

enum FeeStatus {
  PENDING
  PAID
  PARTIAL
  OVERDUE
  WAIVED
}

enum Frequency {
  MONTHLY
  ANNUAL
  ONETIME
}

enum Day {
  SAT
  SUN
  MON
  TUE
  WED
  THU
}

enum NoticeType {
  GENERAL
  ACADEMIC
  FEE
  STAFF
  EXAM
}

// ─────────────────────────────────────────
// USER & AUTH
// ─────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String
  nameUrdu      String?
  email         String?   @unique
  phone         String?   @unique
  password      String
  role          Role
  photo         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  student       Student?
  teacher       Teacher?
  parent        Parent?
  notices       Notice[]
  notifications Notification[]
}

// ─────────────────────────────────────────
// ACADEMIC STRUCTURE
// ─────────────────────────────────────────

model Class {
  id            String     @id @default(cuid())
  name          String     // "9", "10"
  section       String     // "A", "B", "C"
  sessionYear   String     // "2024-2025"
  capacity      Int        @default(40)
  classTeacher  Teacher?   @relation("ClassTeacher", fields: [classTeacherId], references: [id])
  classTeacherId String?   @unique

  students      Student[]
  subjects      Subject[]
  timetable     Timetable[]
  exams         ExamClass[]
  feeStructures FeeStructure[]
  assignments   Assignment[]

  @@unique([name, section, sessionYear])
}

model Subject {
  id        String    @id @default(cuid())
  name      String    // "Mathematics"
  nameUrdu  String?   // "ریاضی"
  code      String?   // "MATH"
  class     Class     @relation(fields: [classId], references: [id])
  classId   String

  teachers      TeacherSubject[]
  timetable     Timetable[]
  attendance    Attendance[]
  results       Result[]
  assignments   Assignment[]
}

// ─────────────────────────────────────────
// PEOPLE
// ─────────────────────────────────────────

model Student {
  id              String    @id @default(cuid())
  user            User      @relation(fields: [userId], references: [id])
  userId          String    @unique
  rollNumber      String    @unique
  fatherName      String
  fatherNameUrdu  String?
  dateOfBirth     DateTime
  gender          Gender
  cnicOrBForm     String?
  religion        String?   @default("Islam")
  address         String?
  admissionDate   DateTime  @default(now())
  sessionYear     String

  class           Class     @relation(fields: [classId], references: [id])
  classId         String
  parent          Parent?   @relation(fields: [parentId], references: [id])
  parentId        String?

  attendance      Attendance[]
  results         Result[]
  fees            FeeRecord[]
  documents       Document[]
}

model Teacher {
  id              String    @id @default(cuid())
  user            User      @relation(fields: [userId], references: [id])
  userId          String    @unique
  fatherName      String?
  cnic            String?   @unique
  qualification   String?
  joiningDate     DateTime  @default(now())
  salary          Float?

  subjects        TeacherSubject[]
  classTeacherOf  Class?    @relation("ClassTeacher")
  timetable       Timetable[]
  attendance      Attendance[]
  results         Result[]
  assignments     Assignment[]
}

model TeacherSubject {
  teacher     Teacher @relation(fields: [teacherId], references: [id])
  teacherId   String
  subject     Subject @relation(fields: [subjectId], references: [id])
  subjectId   String

  @@id([teacherId, subjectId])
}

model Parent {
  id          String    @id @default(cuid())
  user        User      @relation(fields: [userId], references: [id])
  userId      String    @unique
  cnic        String?
  occupation  String?
  children    Student[]
}

// ─────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────

model Attendance {
  id          String           @id @default(cuid())
  student     Student          @relation(fields: [studentId], references: [id])
  studentId   String
  date        DateTime
  status      AttendanceStatus
  subject     Subject?         @relation(fields: [subjectId], references: [id])
  subjectId   String?
  markedBy    Teacher          @relation(fields: [teacherId], references: [id])
  teacherId   String
  remarks     String?
  createdAt   DateTime         @default(now())

  @@unique([studentId, date, subjectId])
}

// ─────────────────────────────────────────
// TIMETABLE
// ─────────────────────────────────────────

model Timetable {
  id          String  @id @default(cuid())
  class       Class   @relation(fields: [classId], references: [id])
  classId     String
  subject     Subject @relation(fields: [subjectId], references: [id])
  subjectId   String
  teacher     Teacher @relation(fields: [teacherId], references: [id])
  teacherId   String
  day         Day
  period      Int
  startTime   String
  endTime     String

  @@unique([classId, day, period])
  @@unique([teacherId, day, period])
}

// ─────────────────────────────────────────
// EXAMS & RESULTS
// ─────────────────────────────────────────

model Exam {
  id          String      @id @default(cuid())
  name        String
  type        ExamType
  sessionYear String
  startDate   DateTime
  endDate     DateTime
  isPublished Boolean     @default(false)
  createdAt   DateTime    @default(now())

  classes     ExamClass[]
  results     Result[]
}

model ExamClass {
  exam      Exam   @relation(fields: [examId], references: [id])
  examId    String
  class     Class  @relation(fields: [classId], references: [id])
  classId   String

  @@id([examId, classId])
}

model Result {
  id            String   @id @default(cuid())
  student       Student  @relation(fields: [studentId], references: [id])
  studentId     String
  exam          Exam     @relation(fields: [examId], references: [id])
  examId        String
  subject       Subject  @relation(fields: [subjectId], references: [id])
  subjectId     String
  marksObtained Float
  totalMarks    Float
  percentage    Float
  grade         String
  isPassed      Boolean
  isLocked      Boolean  @default(false)
  enteredBy     Teacher  @relation(fields: [teacherId], references: [id])
  teacherId     String
  createdAt     DateTime @default(now())

  @@unique([studentId, examId, subjectId])
}

// ─────────────────────────────────────────
// FEE MANAGEMENT
// ─────────────────────────────────────────

model FeeStructure {
  id          String    @id @default(cuid())
  class       Class     @relation(fields: [classId], references: [id])
  classId     String
  feeType     FeeType
  amount      Float
  frequency   Frequency
  sessionYear String
  dueDay      Int
  lateFine    Float     @default(0)
}

model FeeRecord {
  id            String    @id @default(cuid())
  student       Student   @relation(fields: [studentId], references: [id])
  studentId     String
  feeType       FeeType
  month         String    // "2025-06"
  amount        Float
  discount      Float     @default(0)
  netAmount     Float
  paidAmount    Float     @default(0)
  status        FeeStatus @default(PENDING)
  dueDate       DateTime
  paidDate      DateTime?
  paymentMethod String?
  receiptNo     String?   @unique
  remarks       String?
  createdAt     DateTime  @default(now())
}

// ─────────────────────────────────────────
// COMMUNICATION
// ─────────────────────────────────────────

model Notice {
  id          String     @id @default(cuid())
  title       String
  body        String
  type        NoticeType
  targetRoles Role[]
  attachment  String?
  isPinned    Boolean    @default(false)
  publishedAt DateTime
  createdBy   User       @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime   @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  title     String
  body      String
  type      String
  isRead    Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())
}

model Assignment {
  id          String   @id @default(cuid())
  title       String
  description String
  dueDate     DateTime
  subject     Subject  @relation(fields: [subjectId], references: [id])
  subjectId   String
  class       Class    @relation(fields: [classId], references: [id])
  classId     String
  teacher     Teacher  @relation(fields: [teacherId], references: [id])
  teacherId   String
  attachment  String?
  createdAt   DateTime @default(now())
}

// ─────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────

model Document {
  id        String   @id @default(cuid())
  student   Student  @relation(fields: [studentId], references: [id])
  studentId String
  type      String   // "photo", "b-form", "result", "tc"
  fileUrl   String
  uploadedAt DateTime @default(now())
}

// ─────────────────────────────────────────
// SCHOOL SETTINGS
// ─────────────────────────────────────────

model SchoolSettings {
  id              String  @id @default(cuid())
  schoolName      String  @default("Divisional Public High School Pharhala")
  schoolNameUrdu  String?
  address         String?
  phone           String?
  email           String?
  principalName   String?
  sessionYear     String
  workingDays     Day[]
  logo            String?
  updatedAt       DateTime @updatedAt
}
```

---

## Entity Relationship Summary

```
User ──────────── Student (1:1)
User ──────────── Teacher (1:1)
User ──────────── Parent  (1:1)

Parent ─────────── Student[] (1:many)
Class ──────────── Student[] (1:many)
Class ──────────── Subject[] (1:many)

Teacher ────────── TeacherSubject[] (many:many with Subject)
Teacher ────────── Class (1:1 as class teacher)

Student ────────── Attendance[] (1:many)
Student ────────── Result[]     (1:many)
Student ────────── FeeRecord[]  (1:many)

Exam ───────────── Result[]     (1:many)
Exam ───────────── ExamClass[]  (many:many with Class)

Subject ────────── Timetable[]  (1:many)
Subject ────────── Result[]     (1:many)
```
