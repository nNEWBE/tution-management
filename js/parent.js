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
        ${r.strengths.map(s => `<span class="strength-pill d-inline-flex align-items-center gap-1"><svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg> <span>${s}</span></span>`).join("")}
      </div>
    </div>
  `).join("");
}

function renderPaymentSection() {
  const container = document.getElementById("parent-payment-list");
  if (!container) return;

  const payments = window.appStore.getPayments();

  container.innerHTML = payments.map(p => {
    const isPaid = p.status === 'paid' || p.status === 'approved';
    const isPending = p.status === 'pending';
    const isRejected = p.status === 'rejected';

    const statusBadge = isPaid
      ? `<span class="badge badge-success fs-xs">✓ Verified & Paid</span>`
      : (isPending
        ? `<span class="badge badge-pending fs-xs">⏳ Pending Admin Verification</span>`
        : `<span class="badge badge-danger fs-xs">✗ Rejected</span>`);

    return `
      <div class="p-3 border rounded-lg mb-3 background-surface d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div class="fw-bold">${p.month || p.batch || 'Tuition Fee'}</div>
          <div class="fs-xs text-muted">Sender: <strong>${p.senderPhone || p.phone || '01712345678'}</strong> • TrxID: <code>${p.transactionId || p.trxId || 'N/A'}</code></div>
          <div class="fw-bold text-primary mt-1">${UI.formatBDT(p.amount)}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          ${statusBadge}
          ${!isPaid ? `
            <button class="btn btn-sm btn-primary" onclick="openPayModal('${p.id}', ${p.amount}, '${p.month || 'Fee'}')">Submit Payment</button>
          ` : `
            <button class="btn btn-sm btn-outline" onclick="showReceiptModal('${p.id}')">View Receipt</button>
          `}
        </div>
      </div>
    `;
  }).join("");
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
      const methodRadio = document.querySelector('input[name="pay-method"]:checked');
      const method = methodRadio ? methodRadio.value : "bKash";
      const senderPhone = document.getElementById("pay-sender-phone") ? document.getElementById("pay-sender-phone").value.trim() : "01911223344";
      const transactionId = document.getElementById("pay-trx-id") ? document.getElementById("pay-trx-id").value.trim() : "BK9X72810";

      const submitBtn = payForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting for Verification...";

      setTimeout(() => {
        const pay = window.appStore.getPayments().find(p => p.id === payId);
        if (pay) {
          pay.paymentMethod = method;
          pay.senderPhone = senderPhone;
          pay.transactionId = transactionId;
          pay.status = "pending";
          window.appStore.save();
        } else {
          window.appStore.addPayment({
            id: payId || ("PAY-2026-" + Math.floor(1000 + Math.random() * 9000)),
            studentId: "STU-001",
            studentName: "Nafisa Rahman",
            amount: 3500,
            paymentMethod: method,
            senderPhone: senderPhone,
            transactionId: transactionId,
            status: "pending"
          });
        }

        submitBtn.disabled = false;
        submitBtn.textContent = "Confirm Payment";

        UI.closeModal("modal-pay-fee");
        UI.showToast(`Payment request with TrxID (${transactionId}) submitted! Awaiting Admin approval.`, "info", "Sent for Review");
        renderPaymentSection();
      }, 600);
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
