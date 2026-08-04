/* Mock Data Store for IJTutors Tuition Center Management System */

const INITIAL_MOCK_DATA = {
  users: [
    {
      id: "USR-ADMIN-01",
      name: "Engr. Rokib Hasan",
      email: "admin@ijtutors.demo",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      status: "active"
    },
    {
      id: "USR-TCH-01",
      name: "Tanvir Ahmed",
      email: "teacher@ijtutors.demo",
      role: "teacher",
      subject: "Higher Mathematics & Physics",
      phone: "+880 1712-345678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      status: "active"
    },
    {
      id: "USR-TCH-02",
      name: "Nusrat Jahan",
      email: "nusrat@ijtutors.demo",
      role: "teacher",
      subject: "Chemistry & Biology",
      phone: "+880 1819-876543",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      status: "active"
    },
    {
      id: "USR-PRN-01",
      name: "Md. Farhan Chowdhury",
      email: "parent@ijtutors.demo",
      role: "parent",
      phone: "+880 1911-223344",
      studentId: "STU-001",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      status: "active"
    },
    {
      id: "USR-STU-01",
      name: "Nafisa Rahman",
      email: "student@ijtutors.demo",
      role: "student",
      studentId: "STU-001",
      parentId: "USR-PRN-01",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      status: "active"
    }
  ],

  students: [
    {
      id: "STU-001",
      name: "Nafisa Rahman",
      rollNo: "901",
      className: "Class 9",
      section: "Science A",
      parentId: "USR-PRN-01",
      parentName: "Md. Farhan Chowdhury",
      parentPhone: "+880 1911-223344",
      subjects: ["Mathematics", "Physics", "Chemistry", "English"],
      attendanceRate: 94,
      paymentStatus: "pending",
      registeredDate: "2026-01-10",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "STU-002",
      name: "Ayman Shahriar",
      rollNo: "1002",
      className: "Class 10",
      section: "Science B",
      parentId: "USR-PRN-02",
      parentName: "Syed Monirul Islam",
      parentPhone: "+880 1755-998877",
      subjects: ["Mathematics", "Higher Math", "Physics"],
      attendanceRate: 98,
      paymentStatus: "paid",
      registeredDate: "2026-01-12",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "STU-003",
      name: "Tasnia Islam",
      rollNo: "903",
      className: "Class 9",
      section: "Science A",
      parentId: "USR-PRN-03",
      parentName: "Rafiqul Islam",
      parentPhone: "+880 1622-445566",
      subjects: ["Chemistry", "Biology", "English"],
      attendanceRate: 88,
      paymentStatus: "overdue",
      registeredDate: "2026-02-01",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "STU-004",
      name: "Zubayer Hossain",
      rollNo: "1105",
      className: "Class 11",
      section: "HSC Science",
      parentId: "USR-PRN-04",
      parentName: "Abul Hossain",
      parentPhone: "+880 1833-112233",
      subjects: ["Physics", "Chemistry", "Higher Math"],
      attendanceRate: 91,
      paymentStatus: "paid",
      registeredDate: "2026-02-05",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    }
  ],

  teachers: [
    {
      id: "TCH-001",
      name: "Tanvir Ahmed",
      email: "teacher@ijtutors.demo",
      phone: "+880 1712-345678",
      qualification: "M.Sc in Applied Mathematics (DU)",
      assignedClasses: ["Class 9 Science A", "Class 10 Science B", "Class 11 HSC Science"],
      subjects: ["Mathematics", "Higher Math", "Physics"],
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "TCH-002",
      name: "Nusrat Jahan",
      email: "nusrat@ijtutors.demo",
      phone: "+880 1819-876543",
      qualification: "B.Sc in Chemistry (BUET)",
      assignedClasses: ["Class 9 Science A", "Class 10 Science B"],
      subjects: ["Chemistry", "Biology"],
      status: "active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    }
  ],

  payments: [
    {
      id: "PAY-2026-0801",
      studentId: "STU-001",
      studentName: "Nafisa Rahman",
      className: "Class 9",
      month: "August 2026",
      amount: 3500,
      dueDate: "2026-08-10",
      status: "pending",
      paidDate: null,
      paymentMethod: null,
      transactionId: null
    },
    {
      id: "PAY-2026-0701",
      studentId: "STU-001",
      studentName: "Nafisa Rahman",
      className: "Class 9",
      month: "July 2026",
      amount: 3500,
      dueDate: "2026-07-10",
      status: "paid",
      paidDate: "2026-07-08",
      paymentMethod: "bKash",
      transactionId: "BK9X72810"
    },
    {
      id: "PAY-2026-0802",
      studentId: "STU-002",
      studentName: "Ayman Shahriar",
      className: "Class 10",
      month: "August 2026",
      amount: 4000,
      dueDate: "2026-08-10",
      status: "paid",
      paidDate: "2026-08-02",
      paymentMethod: "Nagad",
      transactionId: "NG8821940"
    },
    {
      id: "PAY-2026-0803",
      studentId: "STU-003",
      studentName: "Tasnia Islam",
      className: "Class 9",
      month: "August 2026",
      amount: 3500,
      dueDate: "2026-08-05",
      status: "overdue",
      paidDate: null,
      paymentMethod: null,
      transactionId: null
    }
  ],

  homework: [
    {
      id: "HW-001",
      title: "Algebraic Expressions & Polynomials Exercise 3.2",
      subject: "Mathematics",
      className: "Class 9",
      teacherId: "TCH-001",
      teacherName: "Tanvir Ahmed",
      dueDate: "2026-08-07",
      status: "active",
      instructions: "Solve problems 1 to 15 from NCTB textbook. Show step-by-step factorization for full marks.",
      submissionsCount: 18,
      totalStudents: 22
    },
    {
      id: "HW-002",
      title: "Newton's Laws of Motion & Momentum Practice",
      subject: "Physics",
      className: "Class 9",
      teacherId: "TCH-001",
      teacherName: "Tanvir Ahmed",
      dueDate: "2026-08-09",
      status: "active",
      instructions: "Complete the numerical worksheet on F = ma and conservation of momentum.",
      submissionsCount: 14,
      totalStudents: 22
    },
    {
      id: "HW-003",
      title: "Chemical Bonding & Valency Chart",
      subject: "Chemistry",
      className: "Class 9",
      teacherId: "TCH-002",
      teacherName: "Nusrat Jahan",
      dueDate: "2026-08-11",
      status: "active",
      instructions: "Draw dot-and-cross structures for ionic and covalent bonds in compound samples 1-5.",
      submissionsCount: 10,
      totalStudents: 22
    }
  ],

  timetable: [
    { id: "TT-01", day: "Saturday", timeSlot: "04:00 PM - 05:15 PM", className: "Class 9", subject: "Mathematics", teacher: "Tanvir Ahmed", room: "Room 101" },
    { id: "TT-02", day: "Saturday", timeSlot: "05:30 PM - 06:45 PM", className: "Class 10", subject: "Physics", teacher: "Tanvir Ahmed", room: "Room 102" },
    { id: "TT-03", day: "Sunday", timeSlot: "04:00 PM - 05:15 PM", className: "Class 9", subject: "Chemistry", teacher: "Nusrat Jahan", room: "Room 101" },
    { id: "TT-04", day: "Sunday", timeSlot: "05:30 PM - 06:45 PM", className: "Class 11", subject: "Higher Math", teacher: "Tanvir Ahmed", room: "Room 201" },
    { id: "TT-05", day: "Monday", timeSlot: "04:00 PM - 05:15 PM", className: "Class 9", subject: "Physics", teacher: "Tanvir Ahmed", room: "Room 101" },
    { id: "TT-06", day: "Tuesday", timeSlot: "04:00 PM - 05:15 PM", className: "Class 10", subject: "Chemistry", teacher: "Nusrat Jahan", room: "Room 102" }
  ],

  performanceReports: [
    {
      id: "REP-001",
      studentId: "STU-001",
      studentName: "Nafisa Rahman",
      month: "July 2026 Assessment",
      subject: "Mathematics",
      score: 88,
      totalMarks: 100,
      grade: "A+",
      strengths: ["Algebraic Proofs", "Speed Calculation"],
      areasForImprovement: ["Geometry Construction"],
      teacherRemarks: "Nafisa displays exceptional analytical grasp. Regular practice on geometric proofs will yield perfection."
    },
    {
      id: "REP-002",
      studentId: "STU-001",
      studentName: "Nafisa Rahman",
      month: "July 2026 Assessment",
      subject: "Physics",
      score: 92,
      totalMarks: 100,
      grade: "A+",
      strengths: ["Formula Application", "Graph Interpretation"],
      areasForImprovement: ["Unit Conversion Details"],
      teacherRemarks: "Top score in class on Kinematics test! Extremely disciplined student."
    },
    {
      id: "REP-003",
      studentId: "STU-001",
      studentName: "Nafisa Rahman",
      month: "July 2026 Assessment",
      subject: "Chemistry",
      score: 82,
      totalMarks: 100,
      grade: "A",
      strengths: ["Periodic Table Concepts"],
      areasForImprovement: ["Stoichiometry Equations"],
      teacherRemarks: "Strong conceptual understanding. Work on balancing complex chemical equations."
    }
  ],

  announcements: [
    {
      id: "ANN-001",
      title: "Upcoming Monthly Evaluation Test (August 2026)",
      content: "The monthly model test for Classes 9, 10, and 11 will commence on August 15, 2026. All students are requested to review NCTB chapters 1-4.",
      audience: "All Parents & Students",
      priority: "high",
      date: "2026-08-01"
    },
    {
      id: "ANN-002",
      title: "Parent-Teacher Academic Conference",
      content: "Join us this Friday at 5:00 PM for the quarterly progress review meeting. Report cards for July will be discussed individually.",
      audience: "Parents",
      priority: "medium",
      date: "2026-08-03"
    }
  ],

  registrationRequests: [
    {
      id: "REG-991",
      parentName: "Sharmin Akhter",
      studentName: "Rayhan Chowdhury",
      email: "sharmin@gmail.demo",
      phone: "+880 1788-554433",
      className: "Class 9",
      preferredSubjects: ["Mathematics", "Physics"],
      preferredSchedule: "Sat-Mon 4:00 PM",
      status: "pending",
      submittedDate: "2026-08-04"
    }
  ]
};
