# DPHS Pharhala — Master Plan Overview
## Divisional Public High School, Pharhala, Haripur, KPK

---

## Project Summary

| Item | Detail |
|---|---|
| School | Divisional Public High School, Pharhala, Haripur, KPK |
| Goal | Online presence + full digital school management |
| Domain | `dphs-pharhala.edu.pk` |
| Language | Bilingual — Urdu + English |
| Board | BISE Abbottabad |
| Total Phases | 7 |
| Estimated Timeline | ~15 weeks (4 months) |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SEO friendly, fast, full-stack |
| Styling | Tailwind CSS | Rapid UI, responsive |
| UI Components | shadcn/ui | Clean, accessible components |
| Backend | Next.js API Routes | No separate backend needed |
| ORM | Prisma | Type-safe database queries |
| Database | PostgreSQL (Supabase) | Reliable, free tier available |
| Auth | NextAuth.js | Role-based login |
| File Storage | Cloudinary | Student photos, documents |
| CMS Content | Sanity.io | Manage news, pages, gallery |
| Email | Resend | Notifications, fee alerts |
| Hosting | Vercel | Free, fast, auto-deploy |
| Domain | edu.pk via PKNIC | Official Pakistani educational domain |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  PUBLIC WEBSITE (CMS)                │
│     Home | About | Admissions | News | Contact       │
│              (Sanity CMS powered)                    │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              NEXT.JS APPLICATION                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Admin   │ │ Teacher  │ │ Student  │ │ Parent │ │
│  │Dashboard │ │  Portal  │ │  Portal  │ │ Portal │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│           API LAYER (Next.js API Routes)             │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│     Prisma ORM → PostgreSQL (Supabase)               │
│     Cloudinary (Files) │ Sanity (CMS Content)        │
└─────────────────────────────────────────────────────┘
```

---

## User Roles

| Role | Access |
|---|---|
| Super Admin | Full system control |
| Admin | School operations, reports |
| Teacher | Classes, attendance, marks, assignments |
| Student | Results, timetable, notices, fee status |
| Parent | Child's progress, fees, attendance |

---

## Phases Summary

| Phase | Description | Duration |
|---|---|---|
| Phase 1 | Public Website + SEO | 3 weeks |
| Phase 2 | Auth + Admin Core | 3 weeks |
| Phase 3 | Attendance + Timetable | 2 weeks |
| Phase 4 | Exams + Results | 2 weeks |
| Phase 5 | Fee Management | 2 weeks |
| Phase 6 | Student + Parent + Teacher Portals | 2 weeks |
| Phase 7 | Polish + Launch | 1 week |
| **Total** | | **~15 weeks** |

---

## Estimated Monthly Costs

| Service | Cost |
|---|---|
| edu.pk domain | Rs. 1,800/year (~Rs. 150/month) |
| Vercel hosting | Free |
| Supabase database | Free |
| Cloudinary storage | Free |
| Sanity CMS | Free |
| **Total** | **~Rs. 150/month** |

---

## Files in This Plan

- [00-overview.md](./00-overview.md) — This file (master overview)
- [01-phase1-public-website-seo.md](./01-phase1-public-website-seo.md) — Public Website + SEO
- [02-phase2-auth-admin-core.md](./02-phase2-auth-admin-core.md) — Auth + Admin Core
- [03-phase3-attendance-timetable.md](./03-phase3-attendance-timetable.md) — Attendance + Timetable
- [04-phase4-exams-results.md](./04-phase4-exams-results.md) — Exams + Results
- [05-phase5-fee-management.md](./05-phase5-fee-management.md) — Fee Management
- [06-phase6-portals.md](./06-phase6-portals.md) — Student + Parent + Teacher Portals
- [07-phase7-polish-launch.md](./07-phase7-polish-launch.md) — Polish + Launch
- [database-schema.md](./database-schema.md) — Full Database Schema
- [project-structure.md](./project-structure.md) — Folder & Project Structure
