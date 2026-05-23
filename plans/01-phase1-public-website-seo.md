# Phase 1 — Public Website + SEO
**Duration:** 3 weeks
**Goal:** Get the school on Google with a professional public-facing website

---

## Objectives

- Build a fully functional public website for DPHS Pharhala
- Integrate Sanity CMS so admin can update content without coding
- Implement full SEO so the school ranks on Google
- Deploy live on `dphs-pharhala.edu.pk`

---

## Pages to Build

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero banner, school stats, latest news, quick links |
| About | `/about` | History, mission, vision, principal message |
| Faculty | `/faculty` | Teacher profiles with photos |
| Admissions | `/admissions` | Requirements, fee structure, online inquiry form |
| Results | `/results` | Published matric results (BISE Abbottabad links) |
| Gallery | `/gallery` | Events, sports, classroom photos |
| News & Events | `/news` | Blog-style announcements (Sanity CMS) |
| Single News | `/news/[slug]` | Individual news article |
| Contact | `/contact` | Google Maps embed, contact form, address |

---

## Features Per Page

### Home Page
- Hero section with school name, tagline, CTA (Apply Now)
- School statistics (students, teachers, years established)
- Principal's welcome message (short)
- Latest 3 news/events pulled from Sanity CMS
- Quick links (Admissions, Results, Contact)
- Footer with address, phone, social links

### About Page
- School history and background
- Mission & Vision statements
- Principal's full message with photo
- School achievements

### Faculty Page
- Teacher cards with photo, name, subject, qualification
- Managed via Sanity CMS (easy to update)

### Admissions Page
- Class-wise eligibility criteria
- Documents required list
- Fee structure table
- Online inquiry/contact form
- Important dates

### Results Page
- Links to BISE Abbottabad results
- School's published annual results
- Merit lists (top performers)

### Gallery Page
- Photo grid by category (Events, Sports, Academics, Campus)
- Images managed via Sanity CMS

### News & Events Page
- Blog-style list with featured image, title, date
- Category filter
- Pagination

### Contact Page
- School address (Kangra Colony, Pharhala, Haripur, KPK)
- Phone number
- Email
- Google Maps embed
- Contact form (sends email via Resend)

---

## Sanity CMS Schema (Content Types)

```javascript
// News/Announcements
{
  name: 'news',
  fields: [title, slug, publishedAt, featuredImage, body, category]
}

// Faculty
{
  name: 'teacher',
  fields: [name, photo, subject, qualification, bio]
}

// Gallery
{
  name: 'gallery',
  fields: [title, category, images[]]
}

// School Settings
{
  name: 'settings',
  fields: [principalName, principalMessage, phone, email, address, stats]
}
```

---

## SEO Implementation

### On-Page SEO (every page)
```typescript
// app/about/page.tsx
export const metadata = {
  title: 'About Us | Divisional Public High School Pharhala Haripur',
  description: 'Learn about DPHS Pharhala, the leading school in Haripur KPK...',
  keywords: ['school in haripur', 'dphs pharhala', 'divisional public high school'],
}
```

### Target Keywords
- `Divisional Public High School Pharhala`
- `School in Haripur KPK`
- `Best school Haripur`
- `BISE Abbottabad school Haripur`
- `Admission in Haripur school`
- `ہری پور سکول` (Urdu)

### Technical SEO Setup
- `/sitemap.xml` — auto-generated with all pages
- `/robots.txt` — allow all crawlers
- Open Graph meta tags (for WhatsApp/social sharing)
- Schema.org `EducationalOrganization` structured data
- Canonical URLs on all pages
- Image alt tags in Urdu + English

### Schema.org Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Divisional Public High School Pharhala",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kangra Colony, Pharhala",
    "addressLocality": "Haripur",
    "addressRegion": "Khyber Pakhtunkhwa",
    "addressCountry": "PK"
  },
  "telephone": "+92-xxx-xxxxxxx",
  "url": "https://dphs-pharhala.edu.pk"
}
```

### Local SEO Actions
- Register on **Google Business Profile** (Google Maps listing)
- Add to Pakistan education directories:
  - eduvision.edu.pk
  - jsims.com.pk
  - schoolvisor.org
- Consistent NAP (Name, Address, Phone) everywhere

---

## Domain & Hosting Setup

### edu.pk Domain Registration (PKNIC)
**Required Documents:**
- Letter of authorization on school letterhead (signed by Principal)
- Copy of school registration with KPK Education Department
- CNIC copy of Principal
- Minimum 2-year registration — Rs. 1,800/year

**Registrars to use:**
- silkhost.pk
- navicosoft.com
- pkdomain.com.pk

### Vercel Deployment
```bash
# 1. Push code to GitHub
git init && git push origin main

# 2. Connect GitHub repo to Vercel (vercel.com)
# 3. Add environment variables in Vercel dashboard
# 4. Add custom domain: dphs-pharhala.edu.pk
# 5. Update DNS records at domain registrar
```

### Environment Variables Needed
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://dphs-pharhala.edu.pk
```

---

## Google Search Console Setup
1. Go to search.google.com/search-console
2. Add property: `dphs-pharhala.edu.pk`
3. Verify via HTML tag in `<head>`
4. Submit sitemap: `https://dphs-pharhala.edu.pk/sitemap.xml`
5. Monitor indexing and ranking weekly

---

## Week-by-Week Breakdown

### Week 1
- [ ] Setup Next.js 14 project with Tailwind + shadcn/ui
- [ ] Setup Sanity CMS project & schemas
- [ ] Build Home page
- [ ] Build About page
- [ ] Build Contact page with form

### Week 2
- [ ] Build Faculty page
- [ ] Build Admissions page
- [ ] Build Gallery page
- [ ] Build News/Events pages
- [ ] Build Results page

### Week 3
- [ ] SEO implementation (metadata, sitemap, schema.org)
- [ ] Mobile responsiveness testing
- [ ] Urdu font support (Noto Nastaliq Urdu)
- [ ] Deploy on Vercel
- [ ] Register edu.pk domain
- [ ] Setup Google Business Profile
- [ ] Submit to Google Search Console

---

## Deliverables

- [ ] Live public website at `dphs-pharhala.edu.pk`
- [ ] Sanity CMS studio for content management
- [ ] Google Business Profile active (school on Google Maps)
- [ ] Google Search Console setup with sitemap submitted
- [ ] All pages mobile-responsive and SEO optimized
