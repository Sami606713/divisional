# Phase 5 — Fee Management
**Duration:** 2 weeks
**Goal:** Complete fee tracking system — fee structure, monthly challans, payment recording, and financial reports

---

## Objectives

- Admin defines fee structure per class
- Monthly fee challans auto-generated for all students
- Track paid / unpaid / overdue fees
- Generate fee receipts
- Financial summary reports for admin

---

## Fee Structure Setup

### Fee Types
| Fee Type | Frequency | Who Pays |
|---|---|---|
| Admission Fee | One-time | New students |
| Monthly Tuition Fee | Monthly | All students |
| Exam Fee | Per exam | All students |
| Library Fee | Annual | All students |
| Sports Fee | Annual | All students |
| Computer Lab Fee | Annual | Optional |

### Class-wise Fee Structure (Example)
| Class | Monthly Tuition | Annual Fund | Exam Fee |
|---|---|---|---|
| Class 9 | Rs. 800 | Rs. 500 | Rs. 300 |
| Class 10 | Rs. 900 | Rs. 500 | Rs. 300 |

### Admin: Fee Structure Page
- Set fee amounts per class per fee type
- Set due date (e.g., 10th of each month)
- Set late fine (e.g., Rs. 50/day after due date)
- Effective from date (session year)

---

## Monthly Challan Generation

### Auto-Generation
- On 1st of every month, system auto-generates challans for all active students
- Can also be triggered manually by admin

### Challan Contents
```
┌─────────────────────────────────────────┐
│    DIVISIONAL PUBLIC HIGH SCHOOL        │
│         Pharhala, Haripur               │
│              FEE CHALLAN                │
├─────────────────────────────────────────┤
│ Student: Muhammad Ali                   │
│ Roll No: 2025-9A-01                     │
│ Class:   9-A        Month: June 2025    │
├──────────────────────────┬──────────────┤
│ Fee Description          │    Amount    │
├──────────────────────────┼──────────────┤
│ Monthly Tuition Fee      │   Rs. 800    │
│ (Previous Due if any)    │   Rs. 0      │
├──────────────────────────┼──────────────┤
│ TOTAL                    │   Rs. 800    │
├─────────────────────────────────────────┤
│ Due Date: 10-June-2025                  │
│ Late Fine: Rs. 50/day after due date    │
└─────────────────────────────────────────┘
```

---

## Fee Payment Recording

### Payment Methods
- Cash (at school)
- Bank transfer
- EasyPaisa / JazzCash (future phase)

### Admin: Record Payment
- Search student by name or roll number
- Select month / fee type
- Enter: amount paid, payment date, payment method
- Generate receipt
- System marks challan as PAID

### Fee Statuses
| Status | Meaning |
|---|---|
| PENDING | Challan generated, not paid |
| PAID | Full payment received |
| PARTIAL | Partial payment received |
| OVERDUE | Past due date, not paid |
| WAIVED | Fee waived by admin (scholarship) |

### Scholarship / Concession
- Admin can mark student as scholarship holder
- Define concession %: 25%, 50%, 100%
- Auto-applied to monthly challans

---

## Fee Database

```prisma
model FeeStructure {
  id          String   @id @default(cuid())
  class       Class    @relation(fields: [classId], references: [id])
  classId     String
  feeType     FeeType
  amount      Float
  frequency   Frequency
  sessionYear String
  dueDay      Int      // day of month (e.g., 10)
  lateFine    Float    // per day after due date
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
  status        FeeStatus
  dueDate       DateTime
  paidDate      DateTime?
  paymentMethod String?
  receiptNo     String?   @unique
  remarks       String?
  createdAt     DateTime  @default(now())
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
```

---

## Fee Reports (Admin)

### Daily Collection Report
- Total fees collected today
- List of payments made today
- Breakdown by fee type

### Monthly Collection Report
- Total collected vs total due for any month
- Outstanding balance
- Class-wise summary

### Student Fee Ledger
- Full payment history for one student
- All months: due amount, paid amount, balance
- Total outstanding balance

### Defaulters List
- Students with overdue fees
- Filter by class, months overdue
- Export for follow-up

### Financial Summary
- Session-year total collection
- Month-by-month chart
- Fee type breakdown

---

## Fee Receipt

```
┌─────────────────────────────────────────┐
│       DIVISIONAL PUBLIC HIGH SCHOOL     │
│         Pharhala, Haripur, KPK          │
│              FEE RECEIPT                │
├─────────────────────────────────────────┤
│ Receipt No: RCP-2025-1234               │
│ Date: 05-June-2025                      │
├─────────────────────────────────────────┤
│ Student: Muhammad Ali                   │
│ Roll No: 2025-9A-01  Class: 9-A         │
│ Father:  Muhammad Khan                  │
├──────────────────────────┬──────────────┤
│ Description              │   Amount     │
├──────────────────────────┼──────────────┤
│ Tuition Fee (June 2025)  │   Rs. 800    │
├──────────────────────────┼──────────────┤
│ TOTAL PAID               │   Rs. 800    │
├─────────────────────────────────────────┤
│ Payment Method: Cash                    │
│ Received By: Admin                      │
│             [School Stamp]              │
└─────────────────────────────────────────┘
```

---

## API Endpoints (Phase 5)

```
GET    /api/fees/structure?classId=           # Get fee structure for class
POST   /api/fees/structure                    # Create fee structure
PUT    /api/fees/structure/[id]               # Update fee structure

POST   /api/fees/generate-challans            # Generate monthly challans
GET    /api/fees?studentId=&month=            # Get fee records
POST   /api/fees/payment                      # Record payment
GET    /api/fees/receipt/[id]                 # Get receipt (PDF)

GET    /api/fees/reports/daily                # Daily collection
GET    /api/fees/reports/monthly?month=       # Monthly report
GET    /api/fees/reports/defaulters           # Overdue list
GET    /api/fees/ledger/[studentId]           # Student fee history
```

---

## Week-by-Week Breakdown

### Week 1
- [ ] Fee structure database schema + migration
- [ ] Admin: fee structure setup page
- [ ] Monthly challan auto-generation logic
- [ ] Admin: record payment page
- [ ] Fee receipt PDF generation

### Week 2
- [ ] Student/parent: view fee status + download challan
- [ ] Daily collection report
- [ ] Monthly collection report
- [ ] Defaulters list
- [ ] Student fee ledger
- [ ] Scholarship/concession setup

---

## Deliverables

- [ ] Admin can define fee structure per class
- [ ] Monthly challans auto-generated
- [ ] Admin can record payments and print receipts
- [ ] Students/parents can view fee status
- [ ] Defaulters report available
- [ ] Financial summary reports for admin
