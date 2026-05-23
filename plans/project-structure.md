# Project Folder Structure
## DPHS Pharhala School Management System

---

## Full Directory Structure

```
dphs-pharhala/
│
├── app/                              # Next.js App Router
│   │
│   ├── (public)/                     # Public website (no auth required)
│   │   ├── layout.tsx                # Public layout (navbar, footer)
│   │   ├── page.tsx                  # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── admissions/
│   │   │   └── page.tsx
│   │   ├── faculty/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx              # News list
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Single news article
│   │   ├── results/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── (auth)/                       # Auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  # Protected dashboard area
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   │
│   │   ├── admin/                    # Admin routes
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── students/
│   │   │   │   ├── page.tsx          # Students list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Add student
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Student profile
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── teachers/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── classes/
│   │   │   │   └── page.tsx
│   │   │   ├── admissions/
│   │   │   │   ├── page.tsx          # Pending admissions
│   │   │   │   └── [id]/page.tsx     # Review admission
│   │   │   ├── attendance/
│   │   │   │   ├── page.tsx          # Attendance reports
│   │   │   │   └── daily/page.tsx
│   │   │   ├── timetable/
│   │   │   │   └── page.tsx          # Timetable builder
│   │   │   ├── exams/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── results/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [examId]/page.tsx
│   │   │   ├── fees/
│   │   │   │   ├── page.tsx          # Fee overview
│   │   │   │   ├── structure/page.tsx
│   │   │   │   ├── collect/page.tsx  # Record payment
│   │   │   │   └── reports/page.tsx
│   │   │   ├── notices/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── library/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── teacher/                  # Teacher routes
│   │   │   ├── page.tsx              # Teacher dashboard
│   │   │   ├── attendance/page.tsx
│   │   │   ├── marks/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [examId]/page.tsx
│   │   │   ├── timetable/page.tsx
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── notices/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   ├── student/                  # Student routes
│   │   │   ├── page.tsx              # Student dashboard
│   │   │   ├── attendance/page.tsx
│   │   │   ├── results/page.tsx
│   │   │   ├── timetable/page.tsx
│   │   │   ├── fees/page.tsx
│   │   │   ├── assignments/page.tsx
│   │   │   ├── notices/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   └── parent/                   # Parent routes
│   │       ├── page.tsx              # Parent dashboard
│   │       ├── children/page.tsx     # Switch child
│   │       ├── attendance/page.tsx
│   │       ├── results/page.tsx
│   │       ├── fees/page.tsx
│   │       ├── notices/page.tsx
│   │       └── profile/page.tsx
│   │
│   └── api/                          # API Routes
│       ├── auth/
│       │   └── [...nextauth]/route.ts
│       ├── students/
│       │   ├── route.ts              # GET list, POST create
│       │   └── [id]/route.ts         # GET, PUT, DELETE
│       ├── teachers/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── classes/
│       │   └── route.ts
│       ├── attendance/
│       │   ├── route.ts
│       │   └── report/route.ts
│       ├── timetable/
│       │   └── route.ts
│       ├── exams/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── results/
│       │   ├── route.ts
│       │   └── report-card/[studentId]/route.ts
│       ├── fees/
│       │   ├── route.ts
│       │   ├── structure/route.ts
│       │   ├── payment/route.ts
│       │   └── reports/route.ts
│       ├── notices/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── notifications/
│       │   └── route.ts
│       └── dashboard/
│           ├── admin/route.ts
│           ├── teacher/route.ts
│           ├── student/route.ts
│           └── parent/route.ts
│
├── components/
│   │
│   ├── public/                       # Public website components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── NewsCard.tsx
│   │   ├── TeacherCard.tsx
│   │   ├── GalleryGrid.tsx
│   │   └── ContactForm.tsx
│   │
│   ├── dashboard/                    # Dashboard shared components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── StatCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SearchInput.tsx
│   │   ├── Pagination.tsx
│   │   ├── NotificationBell.tsx
│   │   └── LanguageToggle.tsx
│   │
│   ├── forms/                        # Reusable form components
│   │   ├── StudentForm.tsx
│   │   ├── TeacherForm.tsx
│   │   ├── AttendanceForm.tsx
│   │   ├── MarksEntryForm.tsx
│   │   └── FeePaymentForm.tsx
│   │
│   ├── charts/                       # Analytics charts
│   │   ├── AttendanceChart.tsx
│   │   ├── ResultsChart.tsx
│   │   └── FeeCollectionChart.tsx
│   │
│   └── ui/                           # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       ├── badge.tsx
│       └── ...
│
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # NextAuth config
│   ├── validations.ts                # Zod schemas
│   ├── utils.ts                      # Helper functions
│   ├── pdf.ts                        # PDF generation helpers
│   ├── email.ts                      # Email sending (Resend)
│   └── cloudinary.ts                 # File upload helpers
│
├── hooks/                            # Custom React hooks
│   ├── useAttendance.ts
│   ├── useStudents.ts
│   └── useNotifications.ts
│
├── types/                            # TypeScript types
│   ├── index.ts
│   ├── student.ts
│   ├── teacher.ts
│   └── api.ts
│
├── sanity/                           # Sanity CMS
│   ├── schemaTypes/
│   │   ├── news.ts
│   │   ├── teacher.ts
│   │   ├── gallery.ts
│   │   └── settings.ts
│   ├── lib/
│   │   ├── client.ts
│   │   └── queries.ts
│   └── sanity.config.ts
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Auto-generated migrations
│   └── seed.ts                       # Initial data seed
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── school-building.jpg
│   ├── fonts/
│   └── icons/
│
├── middleware.ts                     # Route protection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env                              # Environment variables
├── .env.example                      # Template for env vars
└── package.json
```

---

## Key Files Explained

| File | Purpose |
|---|---|
| `middleware.ts` | Protects all `/admin`, `/teacher`, `/student`, `/parent` routes |
| `lib/prisma.ts` | Single Prisma client instance (prevents connection pool exhaustion) |
| `lib/auth.ts` | NextAuth config: providers, callbacks, role-based session |
| `lib/validations.ts` | Zod schemas for all API inputs |
| `prisma/seed.ts` | Creates initial admin user, classes, subjects on first deploy |
| `sanity/lib/queries.ts` | GROQ queries for fetching CMS content |

---

## Package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next-auth": "^4.24.0",
    "@prisma/client": "^5.14.0",
    "@sanity/client": "^6.20.0",
    "next-sanity": "^9.4.0",
    "cloudinary": "^2.4.0",
    "resend": "^3.3.0",
    "zod": "^3.23.0",
    "bcryptjs": "^2.4.3",
    "@react-pdf/renderer": "^3.4.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.6.0"
  },
  "devDependencies": {
    "prisma": "^5.14.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "@types/bcryptjs": "^2.4.6"
  }
}
```
