# Phase 3 — Attendance + Timetable
**Duration:** 2 weeks
**Goal:** Daily attendance tracking by teachers and class timetable management

---

## Objectives

- Teachers can mark daily attendance per class/period
- Admin can view attendance reports for all students
- Auto-alert parents on excessive absences
- Build and publish weekly class timetables

---

## Attendance Module

### How Attendance Works
```
1. Teacher logs in → selects class & subject
2. Marks each student: Present / Absent / Late / Leave
3. Submits attendance for that period/day
4. Admin & parents can view reports
```

### Attendance Statuses
| Status | Code | Color |
|---|---|---|
| Present | P | Green |
| Absent | A | Red |
| Late | L | Yellow |
| On Leave | LV | Blue |

### Teacher — Mark Attendance Page
- Select: Class → Section → Subject → Date
- Student list loads automatically
- One-click status per student
- Bulk mark all present, then change exceptions
- Submit button (locks attendance for that session)

### Attendance Reports (Admin)

**Daily Report**
- Class-wise summary for today
- Absent list with parent contact

**Monthly Report**
- Student-wise attendance % for any month
- Color coded: <75% = red, 75-90% = yellow, >90% = green

**Student Report**
- Full attendance history for one student
- Calendar view showing P/A/L per day
- Monthly % trend chart

### Attendance Alert System
- If student absent **3 consecutive days** → SMS/notification to parent
- If monthly attendance falls below **75%** → Warning to parent + admin alert

### Attendance Rules (Configurable)
- Minimum attendance required: 75% (configurable by admin)
- School working days: Saturday–Thursday (configurable)

---

## Attendance Database

```prisma
model Attendance {
  id        String   @id @default(cuid())
  student   Student  @relation(fields: [studentId], references: [id])
  studentId String
  date      DateTime
  status    AttendanceStatus  // PRESENT, ABSENT, LATE, LEAVE
  subject   Subject? @relation(fields: [subjectId], references: [id])
  subjectId String?
  markedBy  Teacher  @relation(fields: [teacherId], references: [id])
  teacherId String
  createdAt DateTime @default(now())

  @@unique([studentId, date, subjectId])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  LEAVE
}
```

---

## Attendance API Endpoints

```
GET    /api/attendance?classId=&date=      # Get attendance for a class on a date
POST   /api/attendance                      # Submit attendance records (bulk)
GET    /api/attendance/student/[id]        # Student attendance history
GET    /api/attendance/report/monthly      # Monthly summary report
GET    /api/attendance/report/daily        # Daily summary
```

---

## Timetable Module

### Timetable Structure
- Each class has a **weekly timetable**
- Each period: Subject + Teacher + Time
- 7 periods per day, 6 working days (Sat–Thu)

### Admin — Timetable Builder
- Select class & section
- Drag-and-drop or dropdown interface
- Assign: Day → Period → Subject → Teacher
- Conflict detection (teacher can't be in two classes same time)
- Save & publish

### Timetable Views
| View | Who Can See |
|---|---|
| By Class | Admin, Teacher, Student, Parent |
| By Teacher | Admin, Teacher (own) |
| Full School Grid | Admin only |

### Sample Timetable (Class 9-A)

| Period | Saturday | Sunday | Monday | Tuesday | Wednesday | Thursday |
|---|---|---|---|---|---|---|
| 1 (8:00–8:40) | Math | Urdu | English | Math | Science | Urdu |
| 2 (8:40–9:20) | English | Math | Science | Urdu | Math | English |
| 3 (9:20–10:00) | Urdu | Science | Math | English | Urdu | Science |
| Break | — | — | — | — | — | — |
| 4 (10:20–11:00) | Science | Islamiat | Social | Science | English | Math |
| 5 (11:00–11:40) | Islamiat | Social | Urdu | Islamiat | Social | Islamiat |

### Subjects (Class 9 & 10 — KPK Board)
- Urdu
- English
- Mathematics
- General Science / Biology
- Physics
- Chemistry
- Islamiat
- Social Studies / Pakistan Studies
- Computer Science (optional)

---

## Timetable Database

```prisma
model Timetable {
  id        String  @id @default(cuid())
  class     Class   @relation(fields: [classId], references: [id])
  classId   String
  subject   Subject @relation(fields: [subjectId], references: [id])
  subjectId String
  teacher   Teacher @relation(fields: [teacherId], references: [id])
  teacherId String
  day       Day     // SAT, SUN, MON, TUE, WED, THU
  period    Int     // 1–7
  startTime String  // "08:00"
  endTime   String  // "08:40"

  @@unique([classId, day, period])
  @@unique([teacherId, day, period])  // conflict prevention
}

enum Day {
  SAT SUN MON TUE WED THU
}
```

---

## Timetable API Endpoints

```
GET    /api/timetable?classId=             # Get timetable for a class
GET    /api/timetable?teacherId=           # Get timetable for a teacher
POST   /api/timetable                      # Create/update timetable entry
DELETE /api/timetable/[id]                # Remove entry
GET    /api/timetable/conflicts?teacherId= # Check teacher conflicts
```

---

## Week-by-Week Breakdown

### Week 1 — Attendance
- [ ] Attendance database schema + Prisma migration
- [ ] Teacher: mark attendance page (class → student list → submit)
- [ ] Admin: daily attendance report
- [ ] Admin: monthly attendance report
- [ ] Student: view own attendance on dashboard
- [ ] Parent: view child's attendance

### Week 2 — Timetable
- [ ] Timetable database schema + migration
- [ ] Admin: timetable builder UI
- [ ] Teacher conflict detection logic
- [ ] Class timetable view (student/parent)
- [ ] Teacher's own timetable view
- [ ] Print timetable (PDF export)

---

## Deliverables

- [ ] Teachers can mark daily attendance
- [ ] Admin can view daily + monthly attendance reports
- [ ] Students and parents can view attendance
- [ ] Admin can build and publish weekly timetables
- [ ] Students and teachers can view their timetable
- [ ] Timetable printable as PDF
