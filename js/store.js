/* State Management & LocalStorage Synchronization Layer */

const STORAGE_KEY = "ijtutors_app_state_v1";

class Store {
  constructor() {
    this.init();
  }

  init() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      this.data = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
      this.save();
    } else {
      try {
        this.data = JSON.parse(existing);
      } catch (e) {
        console.error("Failed to parse stored state, resetting...", e);
        this.data = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
        this.save();
      }
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    window.dispatchEvent(new CustomEvent("ijtutors:statechange", { detail: this.data }));
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    this.save();
  }

  // --- Selectors ---
  getUsers() { return this.data.users || []; }
  getStudents() { return this.data.students || []; }
  getTeachers() { return this.data.teachers || []; }
  getPayments() { return this.data.payments || []; }
  getHomework() { return this.data.homework || []; }
  getTimetable() { return this.data.timetable || []; }
  getPerformanceReports(studentId) {
    const list = this.data.performanceReports || [];
    if (studentId) return list.filter(r => r.studentId === studentId);
    return list;
  }
  getAnnouncements() { return this.data.announcements || []; }
  getRegistrationRequests() { return this.data.registrationRequests || []; }

  // --- Mutators ---
  addStudent(studentObj) {
    const newId = `STU-${String(this.data.students.length + 1).padStart(3, '0')}`;
    const newStudent = {
      id: newId,
      rollNo: String(100 + this.data.students.length + 1),
      attendanceRate: 100,
      paymentStatus: "pending",
      registeredDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random()*1000000)}?auto=format&fit=crop&w=150&q=80`,
      ...studentObj
    };
    this.data.students.unshift(newStudent);
    this.save();
    return newStudent;
  }

  updatePaymentStatus(paymentId, newStatus, paymentMethod = "bKash") {
    const pay = this.data.payments.find(p => p.id === paymentId);
    if (pay) {
      pay.status = newStatus;
      if (newStatus === "paid") {
        pay.paidDate = new Date().toISOString().split('T')[0];
        pay.paymentMethod = paymentMethod;
        pay.transactionId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);
      }
      
      // Update student summary payment status if applicable
      const student = this.data.students.find(s => s.id === pay.studentId);
      if (student) {
        student.paymentStatus = newStatus;
      }

      this.save();
    }
    return pay;
  }

  addHomework(hwObj) {
    const newId = `HW-${String(this.data.homework.length + 1).padStart(3, '0')}`;
    const newHw = {
      id: newId,
      status: "active",
      submissionsCount: 0,
      totalStudents: 22,
      ...hwObj
    };
    this.data.homework.unshift(newHw);
    this.save();
    return newHw;
  }

  addTimetableSlot(slotObj) {
    const newId = `TT-${String(this.data.timetable.length + 1).padStart(2, '0')}`;
    const newSlot = { id: newId, ...slotObj };
    this.data.timetable.push(newSlot);
    this.save();
    return newSlot;
  }

  addPerformanceReport(reportObj) {
    const newId = `REP-${String(this.data.performanceReports.length + 1).padStart(3, '0')}`;
    const newReport = { id: newId, ...reportObj };
    this.data.performanceReports.unshift(newReport);
    this.save();
    return newReport;
  }

  addAnnouncement(annObj) {
    const newId = `ANN-${String(this.data.announcements.length + 1).padStart(3, '0')}`;
    const newAnn = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      ...annObj
    };
    this.data.announcements.unshift(newAnn);
    this.save();
    return newAnn;
  }

  approveRegistration(regId) {
    const reqIndex = this.data.registrationRequests.findIndex(r => r.id === regId);
    if (reqIndex !== -1) {
      const req = this.data.registrationRequests[reqIndex];
      req.status = "approved";
      
      // Create student entry
      this.addStudent({
        name: req.studentName,
        className: req.className,
        section: "Section A",
        parentName: req.parentName,
        parentPhone: req.phone,
        subjects: req.preferredSubjects || ["Mathematics", "Physics"]
      });

      this.data.registrationRequests.splice(reqIndex, 1);
      this.save();
    }
  }
}

window.appStore = new Store();
