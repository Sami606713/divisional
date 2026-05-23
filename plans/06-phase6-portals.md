# Phase 6 — Student + Parent + Teacher Portals
**Duration:** 2 weeks
**Goal:** Individual role-based dashboards and portals for students, parents, and teachers

---

## Objectives

- Each user type gets a personalized dashboard
- Students can view all their academic info in one place
- Parents can monitor their child's progress
- Teachers have tools for their daily work
- Notice board accessible to all roles

---

## Student Portal

### Dashboard (`/student`)
```
┌─────────────────────────────────────────────────┐
│  Welcome, Muhammad Ali | Class 9-A | Roll: 01   │
├──────────────┬──────────────┬────────────────────┤
│ Attendance   │ Last Result  │  Fee Status        │
│   92%        │  76% (A)     │  ✓ Paid (June)     │
└──────────────┴──────────────┴────────────────────┘
│  Today's Timetable                               │
│  Upcoming Exams                                  │
│  Recent Notices                                  │
└─────────────────────────────────────────────────┘
```

### Student Pages

| Page | Route | Content |
|---|---|---|
| Dashboard | `/student` | Overview stats + today's schedule |
| Attendance | `/student/attendance` | Monthly calendar + % breakdown |
| Results | `/student/results` | All exams, report cards, download PDF |
| Timetable | `/student/timetable` | Weekly schedule |
| Fees | `/student/fees` | Monthly challan status, download challan |
| Notices | `/student/notices` | School announcements |
| Profile | `/student/profile` | Personal info (view only, request change) |

### Student: Attendance Page
- Monthly calendar view (P/A/L color coded)
- % per month
- Total present/absent days for session
- Warning if below 75%

### Student: Results Page
- List of all exams taken
- Marks per subject per exam
- Grade and position
- Download report card PDF button

### Student: Fee Page
- Current month status (paid/unpaid)
- Last 6 months history
- Download challan/receipt button

---

## Parent Portal

### Dashboard (`/parent`)
- If multiple children: child selector at top
- Same overview as student but for their child

### Parent Pages

| Page | Route | Content |
|---|---|---|
| Dashboard | `/parent` | Child overview |
| My Children | `/parent/children` | Switch between children |
| Attendance | `/parent/attendance` | Child's attendance |
| Results | `/parent/results` | Child's results + report cards |
| Fees | `/parent/fees` | Fee status, challan download |
| Notices | `/parent/notices` | School announcements |
| Profile | `/parent/profile` | Parent contact info |

### Parent: Notifications
- In-app notifications for:
  - Child marked absent
  - New result published
  - Fee due reminder (3 days before due date)
  - Fee overdue alert
  - New notice posted
  - Exam schedule published

---

## Teacher Portal

### Dashboard (`/teacher`)
```
┌─────────────────────────────────────────────────┐
│  Welcome, Mr. Ali Ahmed | Subject: Mathematics  │
├──────────────┬──────────────┬────────────────────┤
│ My Classes   │ Today's      │  Pending Marks     │
│    3         │ 5 Periods    │    2 subjects      │
└──────────────┴──────────────┴────────────────────┘
│  Today's Timetable                               │
│  Upcoming Exam Schedule                          │
│  Recent Notices                                  │
└─────────────────────────────────────────────────┘
```

### Teacher Pages

| Page | Route | Content |
|---|---|---|
| Dashboard | `/teacher` | Overview + today's schedule |
| Attendance | `/teacher/attendance` | Mark attendance per class |
| Marks Entry | `/teacher/marks` | Enter exam marks |
| Timetable | `/teacher/timetable` | Own weekly timetable |
| Assignments | `/teacher/assignments` | Create & manage assignments |
| Notices | `/teacher/notices` | View + post notices |
| Profile | `/teacher/profile` | Personal info |

### Teacher: Mark Attendance
- Select class → date (defaults to today)
- Student list with P/A/L/LV toggle per student
- Bulk actions (mark all present)
- Submit (confirms for that date)
- View previously submitted attendance

### Teacher: Marks Entry
- List of active exams assigned to this teacher
- Select exam → subject → class
- Enter marks for each student
- Save draft → Submit final

### Teacher: Assignments
- Create assignment: title, description, due date, class, subject
- Attach file (optional)
- Students see assignment in their portal

---

## Notice Board System

### Notice Types
| Type | Posted By | Visible To |
|---|---|---|
| General | Admin | Everyone |
| Academic | Admin / Teacher | Students, Parents, Teachers |
| Fee | Admin | Parents, Students |
| Staff | Admin | Teachers only |
| Exam | Admin | Students, Parents, Teachers |

### Notice List Page
- Filter by type
- Sort by date
- Mark as read
- Pin important notices at top

### Admin: Post Notice
- Title, body (rich text)
- Target audience (all / students / parents / teachers)
- Attach file (PDF, image)
- Schedule publish date (publish now or future)
- Send as notification

---

## Notification System

### In-App Notifications
- Bell icon in navbar
- Unread count badge
- Mark all as read

### Notification Triggers
```
Attendance:
  → Student absent: notify parent
  → Below 75% monthly: notify parent + admin

Results:
  → Marks published: notify student + parent
  → Report card ready: notify student + parent

Fees:
  → 3 days before due: reminder to parent
  → Overdue: alert to parent + admin

Notices:
  → New notice posted: notify target audience

Exams:
  → Exam schedule published: notify students + parents
```

---

## Database (Portals)

```prisma
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

model Notice {
  id          String   @id @default(cuid())
  title       String
  body        String
  type        NoticeType
  targetRole  Role[]
  attachment  String?
  isPinned    Boolean  @default(false)
  publishedAt DateTime
  createdBy   User     @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime @default(now())
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
```

---

## API Endpoints (Phase 6)

```
GET    /api/notices                         # List notices (filtered by role)
POST   /api/notices                         # Post notice (admin/teacher)
PUT    /api/notices/[id]                    # Update notice
DELETE /api/notices/[id]                    # Delete notice

GET    /api/notifications                   # User's notifications
PUT    /api/notifications/read              # Mark all as read
PUT    /api/notifications/[id]/read         # Mark one as read

GET    /api/assignments?classId=&subjectId= # Get assignments
POST   /api/assignments                     # Create assignment
DELETE /api/assignments/[id]               # Delete assignment

GET    /api/dashboard/student              # Student dashboard stats
GET    /api/dashboard/parent               # Parent dashboard stats
GET    /api/dashboard/teacher              # Teacher dashboard stats
```

---

## Week-by-Week Breakdown

### Week 1
- [ ] Student portal: dashboard + attendance + results pages
- [ ] Student portal: fees + timetable + notices pages
- [ ] Parent portal: dashboard + all pages
- [ ] Multi-child switching for parents

### Week 2
- [ ] Teacher portal: dashboard + attendance marking
- [ ] Teacher portal: marks entry + timetable
- [ ] Assignment creation + student view
- [ ] Notice board (post, view, filter)
- [ ] In-app notification system
- [ ] Notification triggers (absent, fee due, results)

---

## Deliverables

- [ ] Student portal with all 7 pages
- [ ] Parent portal with child switching
- [ ] Teacher portal with attendance and marks tools
- [ ] Notice board functional for all roles
- [ ] In-app notification system
- [ ] All portals mobile responsive
