# Phase 7 — Polish + Launch
**Duration:** 1 week
**Goal:** Final testing, Urdu language support, performance optimization, and full production launch

---

## Objectives

- Full Urdu language support across the system
- Mobile responsiveness verified on all pages
- Performance optimized (fast load times)
- Security hardened
- Final deployment to production domain
- Google indexing confirmed

---

## Urdu Language Support

### Fonts
```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');

[lang="ur"] {
  font-family: 'Noto Nastaliq Urdu', serif;
  direction: rtl;
  text-align: right;
}
```

### Language Toggle
- English / اردو button in navbar
- Preference saved in localStorage
- All static text translated
- Dynamic content (student names, etc.) entered in both languages at data entry

### RTL Layout
- When Urdu selected: layout flips to RTL
- Tailwind RTL support: `rtl:` prefix
- Numbers remain LTR (roll numbers, marks, fees)

### Key Urdu Translations
| English | Urdu |
|---|---|
| Students | طلباء |
| Teachers | اساتذہ |
| Attendance | حاضری |
| Results | نتائج |
| Fee | فیس |
| Timetable | نظام الاوقات |
| Notice | اطلاع |
| Admission | داخلہ |
| Dashboard | ڈیش بورڈ |

---

## Mobile Responsiveness Checklist

### Public Website
- [ ] Home page — mobile hero, stacked layout
- [ ] Navigation — hamburger menu
- [ ] Faculty grid — 1 column on mobile
- [ ] Gallery — swipeable on mobile
- [ ] Contact form — full width inputs
- [ ] Footer — stacked on mobile

### Admin Dashboard
- [ ] Sidebar collapses to bottom nav on mobile
- [ ] Data tables — horizontal scroll on mobile
- [ ] Forms — single column on mobile
- [ ] Charts — responsive sizing

### Student / Parent Portal
- [ ] Dashboard stats — 2x2 grid on mobile
- [ ] Timetable — scrollable table
- [ ] Attendance calendar — full width
- [ ] Report card — PDF download (not rendered inline)

---

## Performance Optimization

### Next.js Optimizations
```typescript
// Image optimization (all images)
import Image from 'next/image'
<Image src={photo} alt={name} width={200} height={200} />

// Lazy loading heavy components
const Chart = dynamic(() => import('./Chart'), { ssr: false })

// Static pages where possible (public website)
export const revalidate = 3600 // revalidate every hour
```

### Core Web Vitals Targets
| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Page Load (mobile 3G) | < 4s |

### Database Optimization
- Add indexes on frequently queried fields:
  - `students.rollNumber`
  - `attendance.studentId + date`
  - `results.studentId + examId`
  - `fees.studentId + month`
- Pagination on all list pages (max 25/page)
- Use `select` in Prisma queries (no over-fetching)

---

## Security Checklist

### Authentication & Authorization
- [ ] All API routes check session + role
- [ ] Students can only access own data
- [ ] Parents can only access their children's data
- [ ] CSRF protection (NextAuth handles this)
- [ ] Rate limiting on login endpoint
- [ ] Passwords hashed with bcrypt (salt rounds: 12)

### Input Validation
- [ ] All form inputs validated (Zod schemas)
- [ ] File uploads: type check (images only where applicable), size limit (5MB)
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (React escapes by default)

### Environment Variables
- [ ] No secrets in code (all in `.env`)
- [ ] `.env` in `.gitignore`
- [ ] Production env vars set in Vercel dashboard

---

## Final Testing Checklist

### Functional Testing
- [ ] Login works for all 5 roles
- [ ] Student enrollment end-to-end
- [ ] Attendance marking and reports
- [ ] Marks entry and report card generation
- [ ] Fee recording and receipt printing
- [ ] Notice posting and viewing
- [ ] Timetable builder and viewer
- [ ] Password reset flow

### Browser Testing
- [ ] Chrome (desktop + mobile)
- [ ] Firefox
- [ ] Safari (iPhone)
- [ ] Samsung Internet (Android)

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768px)
- [ ] Mobile (375px — iPhone SE)
- [ ] Mobile (390px — iPhone 14)

---

## Production Deployment

### Final Vercel Deployment
```bash
# 1. Set all production environment variables in Vercel
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://dphs-pharhala.edu.pk
DATABASE_URL=<supabase-production-url>
NEXT_PUBLIC_SANITY_PROJECT_ID=<id>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
RESEND_API_KEY=<key>

# 2. Run final database migration
npx prisma migrate deploy

# 3. Seed initial data
npx prisma db seed
# Creates: super admin account, classes, subjects

# 4. Deploy
git push origin main  # Vercel auto-deploys
```

### Initial Data Seed
```typescript
// prisma/seed.ts
// Create Super Admin
// Create Classes: 9-A, 9-B, 10-A, 10-B
// Create Subjects: Math, English, Urdu, Science...
// Create default fee structure
// Create school settings
```

### DNS Configuration
```
# At domain registrar (PKNIC)
A     @       → Vercel IP
CNAME www     → cname.vercel-dns.com
MX    @       → mail server (if email needed)
```

---

## Google & SEO Final Steps

### Google Search Console
- [ ] Verify ownership of `dphs-pharhala.edu.pk`
- [ ] Submit sitemap: `https://dphs-pharhala.edu.pk/sitemap.xml`
- [ ] Request indexing of all key pages
- [ ] Monitor Coverage report (no errors)

### Google Business Profile
- [ ] Create listing: "Divisional Public High School Pharhala"
- [ ] Add address: Kangra Colony, Pharhala, Haripur, KPK
- [ ] Add phone number
- [ ] Add website link
- [ ] Add photos (school building, classrooms)
- [ ] Set category: "Secondary School"
- [ ] Add opening hours

### Google Analytics
```typescript
// Add to app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

---

## Post-Launch Monitoring

### Week 1 After Launch
- Check Google Search Console daily for errors
- Monitor Vercel logs for any errors
- Test all critical flows again on production
- Gather feedback from school staff

### Ongoing
- Sanity CMS: admin updates news/events regularly
- Google Business: respond to reviews
- Check Core Web Vitals monthly
- Backup database weekly (Supabase auto-backups)

---

## Launch Announcement

### What to Share
- School website is now LIVE
- Google Business Profile active
- Share on WhatsApp groups: parent groups, teacher groups
- Share on Facebook (school page)

### Social Media Post (Sample)
```
خوشخبری! 🎉
Divisional Public High School Pharhala
اب آن لائن ہے!

ویب سائٹ: dphs-pharhala.edu.pk
- داخلہ کی معلومات
- اساتذہ کی فہرست  
- نتائج
- خبریں اور واقعات

طلباء اور والدین اب آن لائن پورٹل استعمال کر سکتے ہیں۔
```

---

## Deliverables

- [ ] Urdu language toggle working
- [ ] All pages mobile responsive
- [ ] Core Web Vitals all green
- [ ] Security checklist complete
- [ ] Production deployed on `dphs-pharhala.edu.pk`
- [ ] Google Business Profile active
- [ ] Google Search Console with sitemap submitted
- [ ] School staff trained on CMS and admin panel
- [ ] System fully live and operational
