export const students = [
  { id: "1", name: "Muhammad Ali", rollNo: "2025-9A-01", class: "9-A", attendance: 92, feeStatus: "Paid", grade: "A" },
  { id: "2", name: "Ayesha Khan", rollNo: "2025-9A-02", class: "9-A", attendance: 88, feeStatus: "Paid", grade: "A+" },
  { id: "3", name: "Bilal Ahmed", rollNo: "2025-9B-01", class: "9-B", attendance: 76, feeStatus: "Unpaid", grade: "B" },
  { id: "4", name: "Fatima Noor", rollNo: "2025-10A-01", class: "10-A", attendance: 95, feeStatus: "Paid", grade: "A+" },
  { id: "5", name: "Usman Tariq", rollNo: "2025-10A-02", class: "10-A", attendance: 70, feeStatus: "Overdue", grade: "C" },
  { id: "6", name: "Sana Malik", rollNo: "2025-9B-02", class: "9-B", attendance: 85, feeStatus: "Paid", grade: "A" },
  { id: "7", name: "Hassan Raza", rollNo: "2025-10B-01", class: "10-B", attendance: 91, feeStatus: "Paid", grade: "A" },
  { id: "8", name: "Zainab Bibi", rollNo: "2025-9A-03", class: "9-A", attendance: 79, feeStatus: "Paid", grade: "B" },
  { id: "9", name: "Kamran Shah", rollNo: "2025-10B-02", class: "10-B", attendance: 83, feeStatus: "Unpaid", grade: "B+" },
  { id: "10", name: "Nadia Iqbal", rollNo: "2025-9A-04", class: "9-A", attendance: 97, feeStatus: "Paid", grade: "A+" },
];

export const teachers = [
  { id: "1", name: "Mr. Muhammad Arif", subject: "Mathematics", qualification: "M.Sc Math", classes: "9-A, 9-B", phone: "0312-1234567" },
  { id: "2", name: "Ms. Sadia Hussain", subject: "English", qualification: "M.A English", classes: "10-A, 10-B", phone: "0333-2345678" },
  { id: "3", name: "Mr. Khalid Mehmood", subject: "Urdu", qualification: "M.A Urdu", classes: "9-A, 10-A", phone: "0345-3456789" },
  { id: "4", name: "Mr. Tariq Bashir", subject: "Physics", qualification: "M.Sc Physics", classes: "10-A, 10-B", phone: "0321-4567890" },
  { id: "5", name: "Ms. Rubina Akhtar", subject: "Chemistry", qualification: "M.Sc Chemistry", classes: "10-A, 10-B", phone: "0300-5678901" },
  { id: "6", name: "Mr. Imran Ali", subject: "Biology", qualification: "M.Sc Biology", classes: "9-B, 10-B", phone: "0311-6789012" },
  { id: "7", name: "Ms. Amna Shahid", subject: "Islamiat", qualification: "M.A Islamiat", classes: "9-A, 9-B", phone: "0322-7890123" },
  { id: "8", name: "Mr. Asif Nawaz", subject: "Computer Science", qualification: "MCS", classes: "9-A, 10-A", phone: "0344-8901234" },
];

export const notices = [
  { id: "1", title: "Annual Examination Schedule 2025", type: "Exam", date: "2025-05-20", body: "Annual examinations will commence from June 10, 2025. All students must ensure they have their admit cards.", targetRole: "All" },
  { id: "2", title: "Fee Submission Deadline", type: "Fee", date: "2025-05-18", body: "Last date for May 2025 fee submission is May 10. Late fine of Rs. 50/day will be charged after the deadline.", targetRole: "Parents" },
  { id: "3", title: "Parent-Teacher Meeting", type: "General", date: "2025-05-15", body: "A parent-teacher meeting is scheduled for May 25, 2025 at 10:00 AM in the school hall.", targetRole: "All" },
  { id: "4", title: "Sports Week Announcement", type: "General", date: "2025-05-10", body: "Annual sports week will be held from May 28 to June 2, 2025. Students are encouraged to participate.", targetRole: "Students" },
  { id: "5", title: "Staff Development Workshop", type: "Staff", date: "2025-05-08", body: "A professional development workshop for all teaching staff will be held on May 22, 2025.", targetRole: "Teachers" },
];

export const news = [
  { id: "1", title: "DPHS Pharhala Students Excel in Board Exams", date: "2025-05-01", excerpt: "Our students achieved outstanding results in the BISE Abbottabad annual examinations with a 94% pass rate.", category: "Academic" },
  { id: "2", title: "Annual Sports Day Celebrated with Great Enthusiasm", date: "2025-04-20", excerpt: "The annual sports day was held with great zeal and enthusiasm. Students participated in various athletic events.", category: "Sports" },
  { id: "3", title: "Science Exhibition Showcases Student Talent", date: "2025-04-10", excerpt: "Students displayed innovative science projects at the annual science exhibition held in the school auditorium.", category: "Academic" },
  { id: "4", title: "New Computer Lab Inaugurated", date: "2025-03-25", excerpt: "A state-of-the-art computer lab with 20 new computers has been inaugurated to enhance digital learning.", category: "Infrastructure" },
  { id: "5", title: "Tree Plantation Drive at DPHS Pharhala", date: "2025-03-15", excerpt: "Students and staff participated in a tree plantation drive as part of the school's green initiative.", category: "Events" },
  { id: "6", title: "Inter-School Debate Competition Victory", date: "2025-03-05", excerpt: "Our school debating team won first place at the inter-school debate competition held in Haripur.", category: "Achievement" },
];

export const exams = [
  { id: "1", name: "Monthly Test 1", type: "Monthly", startDate: "2025-03-10", endDate: "2025-03-12", status: "Completed", classes: "All" },
  { id: "2", name: "Monthly Test 2", type: "Monthly", startDate: "2025-04-14", endDate: "2025-04-16", status: "Completed", classes: "All" },
  { id: "3", name: "Mid-Term Examination", type: "Mid-Term", startDate: "2025-05-12", endDate: "2025-05-18", status: "Ongoing", classes: "All" },
  { id: "4", name: "Monthly Test 3", type: "Monthly", startDate: "2025-07-07", endDate: "2025-07-09", status: "Upcoming", classes: "All" },
  { id: "5", name: "Annual Examination", type: "Annual", startDate: "2025-09-08", endDate: "2025-09-20", status: "Upcoming", classes: "All" },
];

export const timetable = {
  "9-A": {
    SAT: ["Mathematics", "English", "Urdu", "Break", "Physics", "Islamiat"],
    SUN: ["Urdu", "Mathematics", "English", "Break", "Chemistry", "Pak Studies"],
    MON: ["English", "Physics", "Mathematics", "Break", "Urdu", "Biology"],
    TUE: ["Mathematics", "Urdu", "Chemistry", "Break", "English", "Computer"],
    WED: ["Science", "English", "Islamiat", "Break", "Mathematics", "Urdu"],
    THU: ["Urdu", "Science", "English", "Break", "Islamiat", "Mathematics"],
  }
};

export const attendanceData = [
  { month: "Jan", present: 88, absent: 12 },
  { month: "Feb", present: 91, absent: 9 },
  { month: "Mar", present: 85, absent: 15 },
  { month: "Apr", present: 93, absent: 7 },
  { month: "May", present: 89, absent: 11 },
];

export const feeRecords = [
  { month: "January 2025", amount: 800, status: "Paid", paidDate: "2025-01-08" },
  { month: "February 2025", amount: 800, status: "Paid", paidDate: "2025-02-06" },
  { month: "March 2025", amount: 800, status: "Paid", paidDate: "2025-03-09" },
  { month: "April 2025", amount: 800, status: "Paid", paidDate: "2025-04-07" },
  { month: "May 2025", amount: 800, status: "Unpaid", paidDate: null },
];

export const results = [
  { subject: "Mathematics", totalMarks: 100, obtained: 78, grade: "A" },
  { subject: "English", totalMarks: 100, obtained: 85, grade: "A+" },
  { subject: "Urdu", totalMarks: 100, obtained: 72, grade: "A" },
  { subject: "Physics", totalMarks: 100, obtained: 65, grade: "B" },
  { subject: "Chemistry", totalMarks: 100, obtained: 70, grade: "A" },
  { subject: "Islamiat", totalMarks: 50, obtained: 42, grade: "A+" },
  { subject: "Pak Studies", totalMarks: 75, obtained: 58, grade: "A" },
];

export const periods = [
  { time: "8:00–8:40", period: 1 },
  { time: "8:40–9:20", period: 2 },
  { time: "9:20–10:00", period: 3 },
  { time: "10:00–10:20", period: 0, label: "Break" },
  { time: "10:20–11:00", period: 4 },
  { time: "11:00–11:40", period: 5 },
];
