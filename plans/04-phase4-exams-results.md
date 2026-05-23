# Phase 4 — Exams + Results
**Duration:** 2 weeks
**Goal:** Full exam management, marks entry, grade calculation, PDF report cards, and online result publishing

---

## Objectives

- Admin can create and manage exams
- Teachers can enter marks per subject
- System auto-calculates grades and positions
- Generate printable PDF report cards
- Publish results on the public website

---

## Exam Types

| Exam | When | Weightage |
|---|---|---|
| Monthly Test 1 | Month 2 | 10% |
| Monthly Test 2 | Month 4 | 10% |
| Mid-Term Exam | Month 5 | 30% |
| Monthly Test 3 | Month 7 | 10% |
| Annual Exam | Month 9 | 40% |
| BISE Board Exam | Ext. (Class 9/10) | — |

---

## Exam Management (Admin)

### Create Exam
```
- Exam Name (e.g., "Mid-Term Exam 2025")
- Exam Type (Monthly / Mid-Term / Annual)
- Session Year (2024-2025)
- Classes included (9-A, 9-B, 10-A...)
- Start Date & End Date
- Subjects included
- Total marks per subject
- Passing marks per subject
```

### Exam Schedule
- Per exam: subject-wise date + time + room
- Published to student/parent portal
- Printable admit cards

---

## Marks Entry (Teacher)

### Marks Entry Page
- Teacher selects: Exam → Class → Subject
- Student list loads with marks input field
- Enter marks obtained out of total marks
- Save as draft (can edit) → Submit final (locks entry)
- Admin can unlock for correction if needed

### Validation
- Marks cannot exceed total marks
- Marks cannot be negative
- Warning if marks seem unusually low

---

## Grade Calculation (KPK Board Standard)

| Marks % | Grade | Points |
|---|---|---|
| 80–100% | A+ | 5.0 |
| 70–79% | A | 4.0 |
| 60–69% | B | 3.0 |
| 50–59% | C | 2.0 |
| 40–49% | D | 1.0 |
| Below 40% | F | 0.0 |

### Auto-Calculations
- Total marks obtained across all subjects
- Overall percentage
- Overall grade
- Class position / rank
- Pass / Fail status

---

## Result Database

```prisma
model Exam {
  id          String      @id @default(cuid())
  name        String
  type        ExamType
  sessionYear String
  startDate   DateTime
  endDate     DateTime
  classes     Class[]
  results     Result[]
  createdAt   DateTime    @default(now())
}

model Result {
  id           String   @id @default(cuid())
  student      Student  @relation(fields: [studentId], references: [id])
  studentId    String
  exam         Exam     @relation(fields: [examId], references: [id])
  examId       String
  subject      Subject  @relation(fields: [subjectId], references: [id])
  subjectId    String
  marksObtained Float
  totalMarks    Float
  percentage    Float
  grade         String
  isPassed      Boolean
  enteredBy    Teacher  @relation(fields: [teacherId], references: [id])
  teacherId    String
  isLocked     Boolean  @default(false)
  createdAt    DateTime @default(now())

  @@unique([studentId, examId, subjectId])
}

enum ExamType {
  MONTHLY
  MIDTERM
  ANNUAL
  BOARD
}
```

---

## Report Card Generation

### Report Card Contents
```
┌────────────────────────────────────────────────┐
│      DIVISIONAL PUBLIC HIGH SCHOOL PHARHALA    │
│            Kangra Colony, Haripur, KPK          │
├────────────────────────────────────────────────┤
│ Student: Muhammad Ali      Roll No: 2025-9A-01 │
│ Class: 9-A                 Session: 2024-2025  │
│ Father: Muhammad Khan      Exam: Annual 2025   │
├──────────────┬──────┬──────┬────────┬──────────┤
│ Subject      │Total │Marks │   %    │  Grade   │
├──────────────┼──────┼──────┼────────┼──────────┤
│ Urdu         │ 100  │  78  │  78%   │    A     │
│ English      │ 100  │  85  │  85%   │    A+    │
│ Mathematics  │ 100  │  71  │  71%   │    A     │
│ Science      │ 100  │  65  │  65%   │    B     │
│ Islamiat     │  50  │  42  │  84%   │    A+    │
│ Pak Studies  │  75  │  58  │  77%   │    A     │
├──────────────┼──────┼──────┼────────┼──────────┤
│ TOTAL        │ 525  │ 399  │  76%   │    A     │
├──────────────┴──────┴──────┴────────┴──────────┤
│ Class Position: 5th / 45 students               │
│ Attendance: 92%   Status: PROMOTED              │
├────────────────────────────────────────────────┤
│ Principal Signature          Class Teacher Sign │
└────────────────────────────────────────────────┘
```

### PDF Generation
- Use `@react-pdf/renderer` or `puppeteer`
- School logo + header
- One page per student
- Downloadable from student/parent portal
- Printable by admin in bulk

---

## Results Publishing (Public Website)

### What Gets Published
- Class-wise toppers (with parent permission)
- Overall school performance statistics
- Pass percentage per class
- Link to BISE Abbottabad board results

### Results Page on Public Website
```
Annual Results 2025
━━━━━━━━━━━━━━━━━
Class 9: Pass Rate 94% | Top Student: Ayesha Khan (A+)
Class 10: Pass Rate 91% | Top Student: Bilal Ahmed (A+)

Board (BISE Abbottabad):
Check your result: [bise-atd.edu.pk link]
```

---

## API Endpoints (Phase 4)

```
GET    /api/exams                           # List all exams
POST   /api/exams                           # Create exam
GET    /api/exams/[id]                      # Exam details
PUT    /api/exams/[id]                      # Update exam
DELETE /api/exams/[id]                      # Delete exam

GET    /api/results?examId=&classId=        # Get results for exam+class
POST   /api/results/bulk                    # Submit marks (bulk by teacher)
PUT    /api/results/[id]                    # Update single result
PUT    /api/results/lock?examId=&classId=   # Lock results

GET    /api/results/report-card/[studentId]?examId=  # Generate report card
GET    /api/results/class-report?examId=&classId=    # Class result sheet
```

---

## Week-by-Week Breakdown

### Week 1
- [ ] Exam + Result database schema & migration
- [ ] Admin: create exam page
- [ ] Admin: exam schedule setup
- [ ] Teacher: marks entry page (per subject per class)
- [ ] Grade auto-calculation logic
- [ ] Results locking system

### Week 2
- [ ] Report card PDF generation
- [ ] Admin: bulk print report cards
- [ ] Student/parent: view + download report card
- [ ] Class result sheet (admin)
- [ ] Results publishing on public website
- [ ] Class position / rank calculation

---

## Deliverables

- [ ] Admin can create and manage exams
- [ ] Teachers can enter and submit marks
- [ ] Grades and positions auto-calculated
- [ ] PDF report cards generated per student
- [ ] Results viewable on student/parent portal
- [ ] School results published on public website
