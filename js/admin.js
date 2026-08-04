/* Admin Dashboard Logic: Student CRUD, Payment Management, Timetable Builder & Approvals */

document.addEventListener("DOMContentLoaded", () => {
  // Guard check
  if (!document.getElementById("admin-app-root")) return;

  const currentUser = window.authManager.requireAuth("admin");
  if (!currentUser) return;

  // Initialize UI controls
  UI.initSidebar();
  UI.initTabs();

  // Populate Admin User Header Info
  const adminNameEl = document.getElementById("admin-display-name");
  if (adminNameEl) adminNameEl.textContent = currentUser.name;

  // Render initial views
  renderAdminOverview();
  renderStudentTable();
  renderTeacherTable();
  renderPaymentTable();
  renderTimetableGrid();
  renderAnnouncements();
  renderPendingRegistrations();

  // Setup Event Listeners
  setupStudentListeners();
  setupPaymentListeners();
  setupTimetableListeners();
  setupRegistrationListeners();

  // Listen for state changes
  window.addEventListener("ijtutors:statechange", () => {
    renderAdminOverview();
    renderStudentTable();
    renderPaymentTable();
    renderTimetableGrid();
    renderPendingRegistrations();
  });
});

/* --- Render Overview Metrics --- */
function renderAdminOverview() {
  const students = window.appStore.getStudents();
  const teachers = window.appStore.getTeachers();
  const payments = window.appStore.getPayments();
  const pendingRegs = window.appStore.getRegistrationRequests();

  const totalStudentsEl = document.getElementById("stat-total-students");
  if (totalStudentsEl) totalStudentsEl.textContent = students.length;

  const totalTeachersEl = document.getElementById("stat-total-teachers");
  if (totalTeachersEl) totalTeachersEl.textContent = teachers.length;

  const pendingPayments = payments.filter(p => p.status === "pending" || p.status === "overdue");
  const pendingFeesCountEl = document.getElementById("stat-pending-payments");
  if (pendingFeesCountEl) pendingFeesCountEl.textContent = pendingPayments.length;

  const totalCollected = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const revenueEl = document.getElementById("stat-total-revenue");
  if (revenueEl) revenueEl.textContent = UI.formatBDT(totalCollected);

  const pendingRegsBadge = document.getElementById("stat-pending-regs");
  if (pendingRegsBadge) pendingRegsBadge.textContent = pendingRegs.length;
}

/* --- Render Students Management Table --- */
function renderStudentTable(filterText = "", filterClass = "all", filterStatus = "all") {
  const tbody = document.getElementById("admin-student-tbody");
  if (!tbody) return;

  let students = window.appStore.getStudents();

  if (filterText) {
    const q = filterText.toLowerCase();
    students = students.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q));
  }

  if (filterClass !== "all") {
    students = students.filter(s => s.className === filterClass);
  }

  if (filterStatus !== "all") {
    students = students.filter(s => s.paymentStatus === filterStatus);
  }

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No students found matching filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${s.avatar}" alt="${s.name}" class="avatar">
          <div>
            <div class="fw-bold">${s.name}</div>
            <div class="fs-xs text-muted">ID: ${s.id} | Roll: ${s.rollNo}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-primary">${s.className}</span></td>
      <td>
        <div>${s.parentName}</div>
        <div class="fs-xs text-muted">${s.parentPhone}</div>
      </td>
      <td>
        <div class="fw-bold text-success">${s.attendanceRate}%</div>
      </td>
      <td>
        <span class="badge badge-${s.paymentStatus === 'paid' ? 'success' : (s.paymentStatus === 'pending' ? 'pending' : 'overdue')}">
          <span class="badge-dot"></span>${s.paymentStatus}
        </span>
      </td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline" onclick="openEditStudentModal('${s.id}')">Edit</button>
          <button class="btn btn-sm btn-secondary" onclick="triggerParentReminder('${s.id}')">Remind</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function setupStudentListeners() {
  const searchInput = document.getElementById("student-search-input");
  const classFilter = document.getElementById("student-class-filter");
  const statusFilter = document.getElementById("student-status-filter");

  const filterHandler = () => {
    renderStudentTable(
      searchInput ? searchInput.value : "",
      classFilter ? classFilter.value : "all",
      statusFilter ? statusFilter.value : "all"
    );
  };

  if (searchInput) searchInput.addEventListener("input", filterHandler);
  if (classFilter) classFilter.addEventListener("change", filterHandler);
  if (statusFilter) statusFilter.addEventListener("change", filterHandler);

  // Add Student Form submit
  const addStudentForm = document.getElementById("add-student-form");
  if (addStudentForm) {
    addStudentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("new-student-name").value;
      const className = document.getElementById("new-student-class").value;
      const parentName = document.getElementById("new-student-parent").value;
      const parentPhone = document.getElementById("new-student-phone").value;

      window.appStore.addStudent({
        name,
        className,
        parentName,
        parentPhone,
        section: "Section A"
      });

      UI.closeModal("modal-add-student");
      UI.showToast(`Student ${name} successfully enrolled!`, "success");
      addStudentForm.reset();
    });
  }
}

/* --- Render Teacher Table --- */
function renderTeacherTable() {
  const tbody = document.getElementById("admin-teacher-tbody");
  if (!tbody) return;

  const teachers = window.appStore.getTeachers();

  tbody.innerHTML = teachers.map(t => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${t.avatar}" alt="${t.name}" class="avatar">
          <div>
            <div class="fw-bold">${t.name}</div>
            <div class="fs-xs text-muted">${t.email}</div>
          </div>
        </div>
      </td>
      <td><span class="fs-xs fw-semibold">${t.qualification}</span></td>
      <td>
        <div class="d-flex flex-wrap gap-1">
          ${t.subjects.map(s => `<span class="badge badge-info">${s}</span>`).join("")}
        </div>
      </td>
      <td>
        <div class="fs-xs text-muted">${t.assignedClasses.join(", ")}</div>
      </td>
      <td><span class="badge badge-success">Active</span></td>
    </tr>
  `).join("");
}

/* --- Payment Operations --- */
function renderPaymentTable(filterStatus = "all") {
  const tbody = document.getElementById("admin-payment-tbody");
  if (!tbody) return;

  let payments = window.appStore.getPayments();

  if (filterStatus !== "all") {
    payments = payments.filter(p => p.status === filterStatus);
  }

  tbody.innerHTML = payments.map(p => `
    <tr>
      <td><span class="fw-mono text-muted fs-xs">${p.id}</span></td>
      <td class="fw-bold">${p.studentName}</td>
      <td>${p.month}</td>
      <td class="fw-bold">${UI.formatBDT(p.amount)}</td>
      <td>${UI.formatDate(p.dueDate)}</td>
      <td>
        <span class="badge badge-${p.status === 'paid' ? 'success' : (p.status === 'pending' ? 'pending' : 'overdue')}">
          ${p.status}
        </span>
      </td>
      <td>
        <div class="d-flex gap-2">
          ${p.status !== 'paid' ? `
            <button class="btn btn-sm btn-primary" onclick="markPaymentPaid('${p.id}')">Mark Paid</button>
            <button class="btn btn-sm btn-secondary" onclick="sendPaymentReminder('${p.studentName}', '${p.amount}')">Send Reminder</button>
          ` : `
            <button class="btn btn-sm btn-outline" onclick="showReceiptModal('${p.id}')">Receipt</button>
          `}
        </div>
      </td>
    </tr>
  `).join("");
}

function setupPaymentListeners() {
  const filterSelect = document.getElementById("admin-payment-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", () => renderPaymentTable(filterSelect.value));
  }
}

window.markPaymentPaid = function(payId) {
  const pay = window.appStore.updatePaymentStatus(payId, "paid", "Cash / Manual");
  UI.showToast(`Payment ${payId} marked as PAID for ${pay.studentName}!`, "success");
};

window.sendPaymentReminder = function(studentName, amount) {
  UI.showToast(`Automated SMS/WhatsApp payment reminder of ৳${amount} dispatched to ${studentName}'s parent!`, "info", "Reminder Sent");
};

window.triggerParentReminder = function(studentId) {
  const student = window.appStore.getStudents().find(s => s.id === studentId);
  if (student) {
    UI.showToast(`Tuition fee reminder sent to ${student.parentName} (${student.parentPhone})`, "info", "WhatsApp Reminder");
  }
};

/* --- Timetable Grid Renderer --- */
function renderTimetableGrid() {
  const gridContainer = document.getElementById("admin-timetable-grid");
  if (!gridContainer) return;

  const timetable = window.appStore.getTimetable();
  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = ["04:00 PM - 05:15 PM", "05:30 PM - 06:45 PM"];

  let html = `<div class="timetable-grid">`;
  
  // Top header row
  html += `<div class="timetable-header">Time / Day</div>`;
  days.forEach(day => {
    html += `<div class="timetable-header">${day}</div>`;
  });

  // Time slot rows
  timeSlots.forEach(slot => {
    html += `<div class="timetable-time-slot">${slot}</div>`;
    days.forEach(day => {
      const classItem = timetable.find(t => t.day === day && t.timeSlot === slot);
      if (classItem) {
        const subClass = classItem.subject.toLowerCase();
        html += `
          <div class="timetable-cell">
            <div class="class-slot-card ${subClass}">
              <div class="slot-subject">${classItem.subject} (${classItem.className})</div>
              <div class="slot-meta">Tutor: ${classItem.teacher}</div>
              <div class="slot-meta">Loc: ${classItem.room}</div>
            </div>
          </div>
        `;
      } else {
        html += `<div class="timetable-cell"><span class="fs-xs text-muted" style="opacity: 0.4;">Available</span></div>`;
      }
    });
  });

  html += `</div>`;
  gridContainer.innerHTML = html;
}

function setupTimetableListeners() {
  const addClassForm = document.getElementById("add-timetable-form");
  if (addClassForm) {
    addClassForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const day = document.getElementById("slot-day").value;
      const timeSlot = document.getElementById("slot-time").value;
      const className = document.getElementById("slot-class").value;
      const subject = document.getElementById("slot-subject").value;
      const teacher = document.getElementById("slot-teacher").value;
      const room = document.getElementById("slot-room").value;

      // Check conflict
      const timetable = window.appStore.getTimetable();
      const conflict = timetable.find(t => t.day === day && t.timeSlot === timeSlot && t.room === room);
      if (conflict) {
        UI.showToast(`Scheduling Conflict: ${room} is already booked for ${conflict.subject} at ${timeSlot}!`, "error", "Conflict Warning");
        return;
      }

      window.appStore.addTimetableSlot({ day, timeSlot, className, subject, teacher, room });
      UI.closeModal("modal-add-timetable");
      UI.showToast(`New class scheduled for ${className} on ${day}!`, "success");
      addClassForm.reset();
    });
  }
}

/* --- Announcements Feed & Registrations --- */
function renderAnnouncements() {
  const container = document.getElementById("admin-announcements-list");
  if (!container) return;

  const list = window.appStore.getAnnouncements();

  container.innerHTML = list.map(a => `
    <div class="announcement-card">
      <div class="announcement-meta">
        <span class="badge badge-${a.priority === 'high' ? 'overdue' : 'info'}">${a.priority} Priority</span>
        <span>Target: ${a.audience} | ${UI.formatDate(a.date)}</span>
      </div>
      <h4 class="fs-md fw-bold mb-1">${a.title}</h4>
      <p class="fs-sm mb-0">${a.content}</p>
    </div>
  `).join("");
}

function renderPendingRegistrations() {
  const container = document.getElementById("pending-registrations-list");
  if (!container) return;

  const reqs = window.appStore.getRegistrationRequests();

  if (reqs.length === 0) {
    container.innerHTML = `<div class="p-3 text-muted text-center fs-sm">No pending student registration applications.</div>`;
    return;
  }

  container.innerHTML = reqs.map(r => `
    <div class="p-3 border-bottom d-flex align-items-center justify-content-between">
      <div>
        <div class="fw-bold">${r.studentName} (${r.className})</div>
        <div class="fs-xs text-muted">Parent: ${r.parentName} | Phone: ${r.phone}</div>
        <div class="fs-xs text-secondary mt-1">Subjects: ${r.preferredSubjects.join(", ")}</div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-success" onclick="approveReg('${r.id}')">Approve</button>
      </div>
    </div>
  `).join("");
}

function setupRegistrationListeners() {
  const annForm = document.getElementById("add-announcement-form");
  if (annForm) {
    annForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("ann-title").value;
      const content = document.getElementById("ann-content").value;
      const audience = document.getElementById("ann-audience").value;
      const priority = document.getElementById("ann-priority").value;

      window.appStore.addAnnouncement({ title, content, audience, priority });
      UI.closeModal("modal-add-announcement");
      UI.showToast("Announcement published successfully to all portals!", "success");
      annForm.reset();
    });
  }
}

window.approveReg = function(regId) {
  window.appStore.approveRegistration(regId);
  UI.showToast("Registration request approved! Student account activated.", "success");
};

window.showReceiptModal = function(payId) {
  const pay = window.appStore.getPayments().find(p => p.id === payId);
  if (!pay) return;

  const receiptBody = document.getElementById("receipt-modal-content");
  if (receiptBody) {
    receiptBody.innerHTML = `
      <div class="receipt-card">
        <div class="receipt-header">
          <div class="receipt-logo">IJTutors Tuition Center</div>
          <div class="fs-xs text-muted">Dhaka Center, Bangladesh</div>
          <div class="fs-xs fw-bold mt-2">MONEY RECEIPT - OFFICIAL</div>
        </div>
        <div class="receipt-row"><span>Receipt ID:</span><span class="fw-mono">${pay.id}</span></div>
        <div class="receipt-row"><span>Student Name:</span><span class="fw-bold">${pay.studentName}</span></div>
        <div class="receipt-row"><span>Academic Class:</span><span>${pay.className}</span></div>
        <div class="receipt-row"><span>Billing Month:</span><span>${pay.month}</span></div>
        <div class="receipt-row"><span>Payment Method:</span><span>${pay.paymentMethod || 'bKash'}</span></div>
        <div class="receipt-row"><span>Transaction ID:</span><span class="fw-mono">${pay.transactionId || 'BK9X72810'}</span></div>
        <div class="receipt-row receipt-total"><span>Amount Paid:</span><span>${UI.formatBDT(pay.amount)}</span></div>
        <div class="text-center mt-4 pt-3 border-top">
          <span class="badge badge-success">PAID & VERIFIED</span>
        </div>
      </div>
    `;
    UI.openModal("modal-view-receipt");
  }
};
