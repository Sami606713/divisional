# Phase 2 — Auth + Admin Core
**Duration:** 3 weeks
**Goal:** Role-based authentication and core admin dashboard with student, teacher, class management

---

## Objectives

- Implement secure role-based login system
- Build admin dashboard with full CRUD operations
- Student & teacher management
- Class & section management
- Admission module

---

## Authentication System

### Roles
| Role | Login Access | Redirect After Login |
|---|---|---|
| Super Admin | Email + Password | `/admin` |
| Admin | Email + Password | `/admin` |
| Teacher | Email + Password | `/teacher` |
| Student | Roll No + Password | `/student` |
| Parent | Phone + Password | `/parent` |

### NextAuth.js Setup
```typescript
// lib/auth.ts
export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // verify email/password from DB
        // return user with role
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.id
      return session
    }
  }
}
```

### Route Protection (Middleware)
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect('/login')
  }
  // same for /teacher, /student, /parent
}
```

---

## Admin Dashboard Pages

| Page | Route | Features |
|---|---|---|
| Dashboard | `/admin` | Stats overview, quick actions |
| Students | `/admin/students` | List, search, filter, add, edit, delete |
| Student Detail | `/admin/students/[id]` | Full profile, attendance, results, fees |
| Teachers | `/admin/teachers` | List, add, edit, assign subjects |
| Classes | `/admin/classes` | Create classes & sections |
| Admissions | `/admin/admissions` | New admission form, pending approvals |
| Settings | `/admin/settings` | School info, session year |

---

## Admin Dashboard — Overview Stats

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Students  │ │  Teachers   │ │   Classes   │ │  Fee Due    │
│     320     │ │     18      │ │     12      │ │  Rs. 45,000 │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

- Recent admissions list
- Today's attendance summary
- Upcoming exams
- Recent notices

---

## Student Management Module

### Student List Page
- Search by name, roll number, class
- Filter by class, section, gender
- Pagination
- Quick actions (view, edit, delete)
- Export to Excel/PDF

### Add/Edit Student Form Fields
```
Personal Info:
- Full Name (Urdu + English)
- Father's Name
- Date of Birth
- Gender
- CNIC/B-Form Number
- Religion
- Nationality

Contact Info:
- Phone Number
- Address
- Emergency Contact

Academic Info:
- Class (9, 10)
- Section (A, B, C)
- Roll Number (auto-generated)
- Admission Date
- Previous School

Documents:
- Photo upload (Cloudinary)
- B-Form copy upload
- Previous result upload
```

### Student Profile Page
- Personal details tab
- Attendance summary tab
- Exam results tab
- Fee status tab
- Documents tab

---

## Teacher Management Module

### Add/Edit Teacher Form Fields
```
- Full Name
- Father's Name
- CNIC
- Phone
- Email
- Qualification
- Joining Date
- Subjects (multi-select)
- Class Teacher of (optional)
- Photo
- Salary (basic)
```

### Teacher List Page
- Search, filter by subject
- View assigned classes
- Quick actions

---

## Class Management Module

### Classes Structure
```
Class 9
  ├── Section A (Class Teacher: Mr. Ali)
  ├── Section B (Class Teacher: Mr. Khan)
  └── Section C (Class Teacher: Ms. Fatima)
Class 10
  ├── Section A
  └── Section B
```

### Features
- Create class + section
- Assign class teacher
- Set student capacity
- View enrolled students count

---

## Admission Module

### Online Admission Form (Public)
- Available on public website at `/admissions`
- Parent fills form online
- Submitted to admin for review

### Admin Admission Workflow
```
1. New application received → Status: Pending
2. Admin reviews → Approves / Rejects
3. If Approved:
   - Assign class & section
   - Auto-generate roll number
   - Create student account (roll no + default password)
   - Create parent account (phone + default password)
   - Print admission slip
4. Notify parent via phone/email
```

### Admission Form Fields
- Same as student form above
- Additional: Preferred class, any special needs

---

## API Endpoints (Phase 2)

```
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/students
POST   /api/students
GET    /api/students/[id]
PUT    /api/students/[id]
DELETE /api/students/[id]

GET    /api/teachers
POST   /api/teachers
GET    /api/teachers/[id]
PUT    /api/teachers/[id]
DELETE /api/teachers/[id]

GET    /api/classes
POST   /api/classes
PUT    /api/classes/[id]
DELETE /api/classes/[id]

GET    /api/admissions
POST   /api/admissions
PUT    /api/admissions/[id]/approve
PUT    /api/admissions/[id]/reject
```

---

## Week-by-Week Breakdown

### Week 1
- [ ] Setup NextAuth.js with credentials provider
- [ ] Build login page (role detection)
- [ ] Route protection middleware
- [ ] Admin dashboard layout (sidebar, navbar)
- [ ] Dashboard overview page with stats

### Week 2
- [ ] Student list page (with search, filter, pagination)
- [ ] Add/Edit student form
- [ ] Student profile page
- [ ] Cloudinary integration for photo upload
- [ ] Teacher list + add/edit pages

### Week 3
- [ ] Class & section management
- [ ] Admission form on public website
- [ ] Admin admission review workflow
- [ ] Roll number auto-generation
- [ ] Print admission slip

---

## Deliverables

- [ ] Working login system with 5 roles
- [ ] Admin dashboard accessible
- [ ] Full student CRUD with photo upload
- [ ] Full teacher CRUD
- [ ] Class & section management
- [ ] Admission workflow (apply → approve → enroll)
