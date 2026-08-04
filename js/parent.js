/* Parent & Student Dashboard Logic: Immediate Answers, Performance Vis, Pay Fees & Receipt Download */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("parent-app-root")) return;

  const currentUser = window.authManager.requireAuth();
  if (!currentUser) return;

  UI.initSidebar();
  UI.initTabs();

  // Parent/Student user info
  const nameEl = document.getElementById("parent-display-name");
  if (nameEl) nameEl.textContent = currentUser.name;

  renderParentOverview();
  renderPerformanceSection();
  renderPaymentSection();
  renderHomeworkSection();
  setupParentListeners();

  window.addEventListener("ijtutors:statechange", () => {
    renderParentOverview();
    renderPerformanceSection();
    renderPaymentSection();
    renderHomeworkSection();
  });
});

function renderParentOverview() {
  const targetStudentId = "STU-001"; // Nafisa Rahman
  const student = window.appStore.getStudents().find(s => s.id === targetStudentId);
  const payments = window.appStore.getPayments().filter(p => p.studentId === targetStudentId);
  const homework = window.appStore.getHomework();

  if (student) {
    const attEl = document.getElementById("parent-stat-attendance");
    if (attEl) attEl.textContent = `${student.attendanceRate}%`;
  }

  const latestPayment = payments[0];
  const payStatusBadge = document.getElementById("parent-stat-payment");
  if (payStatusBadge && latestPayment) {
    payStatusBadge.className = `badge badge-${latestPayment.status === 'paid' ? 'success' : (latestPayment.status === 'pending' ? 'pending' : 'overdue')}`;
    payStatusBadge.textContent = latestPayment.status.toUpperCase();
  }

  const pendingHwCount = homework.length;
  const hwCountEl = document.getElementById("parent-stat-homework");
  if (hwCountEl) hwCountEl.textContent = `${pendingHwCount} Pending`;
}

function renderPerformanceSection() {
  const container = document.getElementById("parent-performance-list");
  if (!container) return;

  const reports = window.appStore.getPerformanceReports("STU-001");

  if (reports.length === 0) {
    container.innerHTML = `<div class="text-muted p-3">No evaluation reports generated yet for this term.</div>`;
    return;
  }

  container.innerHTML = reports.map(r => `
    <div class="performance-item">
      <div class="performance-head">
        <div>
          <span class="subject-name">${r.subject}</span>
          <span class="fs-xs text-muted ms-2">(${r.month})</span>
        </div>
        <span class="score-tag">${r.score} / ${r.totalMarks} (${r.grade})</span>
      </div>
      <div class="progress-bar-wrap mb-2">
        <div class="progress-bar-fill" style="width: ${(r.score / r.totalMarks) * 100}%;"></div>
      </div>
      <div class="fs-xs text-secondary mt-2"><strong>Teacher Remarks:</strong> ${r.teacherRemarks}</div>
      <div class="strength-pills">
        ${r.strengths.map(s => `<span class="strength-pill">✓ ${s}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

function renderPaymentSection() {
  const container = document.getElementById("parent-payment-list");
  if (!container) return;

  const payments = window.appStore.getPayments().filter(p => p.studentId === "STU-001");

  container.innerHTML = payments.map(p => `
    <div class="p-3 border rounded-lg mb-3 background-surface d-flex align-items-center justify-content-between">
      <div>
        <div class="fw-bold">${p.month} Tuition Fee</div>
        <div class="fs-xs text-muted">Due Date: ${UI.formatDate(p.dueDate)}</div>
        <div class="fw-bold text-primary mt-1">${UI.formatBDT(p.amount)}</div>
      </div>
      <div>
        ${p.status !== 'paid' ? `
          <button class="btn btn-sm btn-primary" onclick="openPayModal('${p.id}', ${p.amount}, '${p.month}')">Pay Now (bKash/Nagad)</button>
        ` : `
          <button class="btn btn-sm btn-outline" onclick="showReceiptModal('${p.id}')">View Receipt</button>
        `}
      </div>
    </div>
  `).join("");
}

function renderHomeworkSection() {
  const container = document.getElementById("parent-homework-grid");
  if (!container) return;

  const list = window.appStore.getHomework();

  container.innerHTML = list.map(hw => `
    <div class="homework-card">
      <div>
        <div class="homework-subject-tag">${hw.subject}</div>
        <div class="homework-title mt-1">${hw.title}</div>
        <div class="homework-desc mt-2">${hw.instructions}</div>
      </div>
      <div class="homework-footer">
        <span>Tutor: ${hw.teacherName}</span>
        <span class="badge badge-warning">Due: ${UI.formatDate(hw.dueDate)}</span>
      </div>
    </div>
  `).join("");
}

function setupParentListeners() {
  const payForm = document.getElementById("checkout-payment-form");
  if (payForm) {
    payForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const payId = document.getElementById("pay-modal-id").value;
      const method = document.querySelector('input[name="pay-method"]:checked').value;

      const submitBtn = payForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing Payment...";

      setTimeout(() => {
        window.appStore.updatePaymentStatus(payId, "paid", method);
        submitBtn.disabled = false;
        submitBtn.textContent = "Confirm Payment";

        const modalBox = document.querySelector("#modal-pay-fee .modal");
        if (window.animatePaymentSuccess) {
          window.animatePaymentSuccess(modalBox, () => {
            UI.closeModal("modal-pay-fee");
            UI.showToast(`Tuition payment of ৳3,500 successfully completed via ${method}!`, "success", "Payment Successful");
          });
        } else {
          UI.closeModal("modal-pay-fee");
          UI.showToast(`Tuition payment of ৳3,500 successfully completed via ${method}!`, "success", "Payment Successful");
        }
      }, 1000);
    });
  }

  // Dashboard Enrolment Form Listener
  const enrolmentForm = document.getElementById("dashboard-enrolment-form");
  if (enrolmentForm) {
    enrolmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const parentName = document.getElementById("dash-reg-parent-name").value;
      const phone = document.getElementById("dash-reg-parent-phone").value;
      const studentName = document.getElementById("dash-reg-student-name").value;
      const className = document.getElementById("dash-reg-class").value;
      const checkedSubjects = Array.from(document.querySelectorAll('input[name="dash-reg-subjects"]:checked')).map(cb => cb.value);

      window.appStore.data.registrationRequests.push({
        id: "REG-" + Math.floor(100 + Math.random() * 900),
        parentName,
        studentName,
        phone,
        className,
        preferredSubjects: checkedSubjects,
        status: "pending",
        submittedDate: new Date().toISOString().split('T')[0]
      });
      window.appStore.save();

      UI.showToast(`Admission request submitted for ${studentName}! Center Admin will review & approve shortly.`, "success", "Application Received");
      enrolmentForm.reset();
    });
  }
}

window.openPayModal = function(payId, amount, month) {
  const idInput = document.getElementById("pay-modal-id");
  const amtDisplay = document.getElementById("pay-modal-amount");
  const monthDisplay = document.getElementById("pay-modal-month");
  if (idInput) idInput.value = payId;
  if (amtDisplay) amtDisplay.textContent = UI.formatBDT(amount);
  if (monthDisplay) monthDisplay.textContent = month;
  UI.openModal("modal-pay-fee");
};
