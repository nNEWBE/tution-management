/* Teacher Dashboard Logic: Homework Creator, Attendance Tracker, Student Marks & Evaluation */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("teacher-app-root")) return;

  const currentUser = window.authManager.requireAuth("teacher");
  if (!currentUser) return;

  UI.initSidebar();
  UI.initTabs();

  // Teacher info
  const nameEl = document.getElementById("teacher-display-name");
  if (nameEl) nameEl.textContent = currentUser.name;

  renderTeacherOverview();
  renderTeacherClassRoster();
  renderTeacherHomeworkList();
  renderTeacherSchedule();
  setupTeacherFormListeners();

  window.addEventListener("ijtutors:statechange", () => {
    renderTeacherOverview();
    renderTeacherHomeworkList();
  });
});

function renderTeacherOverview() {
  const homework = window.appStore.getHomework();
  const students = window.appStore.getStudents();

  const totalAssignedStudentsEl = document.getElementById("teacher-stat-students");
  if (totalAssignedStudentsEl) totalAssignedStudentsEl.textContent = students.length;

  const activeHwEl = document.getElementById("teacher-stat-homework");
  if (activeHwEl) activeHwEl.textContent = homework.length;
}

function renderTeacherClassRoster() {
  const tbody = document.getElementById("teacher-attendance-tbody");
  if (!tbody) return;

  const students = window.appStore.getStudents().filter(s => s.className === "Class 9");

  tbody.innerHTML = students.map(s => `
    <tr>
      <td><span class="fw-mono">${s.rollNo}</span></td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="${s.avatar}" alt="${s.name}" class="avatar avatar-sm">
          <span class="fw-bold">${s.name}</span>
        </div>
      </td>
      <td>
        <div class="d-flex gap-3">
          <label class="d-flex align-items-center gap-1 cursor-pointer">
            <input type="radio" name="att-${s.id}" value="present" checked> <span class="fs-xs text-success fw-bold">Present</span>
          </label>
          <label class="d-flex align-items-center gap-1 cursor-pointer">
            <input type="radio" name="att-${s.id}" value="absent"> <span class="fs-xs text-danger">Absent</span>
          </label>
          <label class="d-flex align-items-center gap-1 cursor-pointer">
            <input type="radio" name="att-${s.id}" value="late"> <span class="fs-xs text-warning">Late</span>
          </label>
        </div>
      </td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="openGradeEntryModal('${s.id}', '${s.name}')">Enter Score</button>
      </td>
    </tr>
  `).join("");
}

function renderTeacherHomeworkList() {
  const container = document.getElementById("teacher-homework-grid");
  if (!container) return;

  const list = window.appStore.getHomework();

  container.innerHTML = list.map(hw => `
    <div class="homework-card">
      <div>
        <div class="homework-subject-tag">${hw.subject} • ${hw.className}</div>
        <div class="homework-title mt-1">${hw.title}</div>
        <div class="homework-desc mt-2">${hw.instructions}</div>
      </div>
      <div class="homework-footer">
        <div>Submissions: <strong class="text-primary">${hw.submissionsCount}/${hw.totalStudents}</strong></div>
        <div class="badge badge-warning">Due: ${UI.formatDate(hw.dueDate)}</div>
      </div>
    </div>
  `).join("");
}

function renderTeacherSchedule() {
  const container = document.getElementById("teacher-schedule-list");
  if (!container) return;

  const timetable = window.appStore.getTimetable().filter(t => t.teacher.includes("Tanvir") || t.teacher.includes("Ahmed"));

  container.innerHTML = timetable.map(t => `
    <div class="p-3 border-bottom d-flex align-items-center justify-content-between">
      <div>
        <div class="fw-bold">${t.subject} (${t.className})</div>
        <div class="fs-xs text-muted">${t.day} | ${t.timeSlot} | ${t.room}</div>
      </div>
      <span class="badge badge-primary">Scheduled</span>
    </div>
  `).join("");
}

function setupTeacherFormListeners() {
  // Add Homework form submit
  const hwForm = document.getElementById("create-homework-form");
  if (hwForm) {
    hwForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("hw-title").value;
      const subject = document.getElementById("hw-subject").value;
      const className = document.getElementById("hw-class").value;
      const dueDate = document.getElementById("hw-due-date").value;
      const instructions = document.getElementById("hw-instructions").value;

      window.appStore.addHomework({
        title,
        subject,
        className,
        dueDate,
        instructions,
        teacherId: "TCH-001",
        teacherName: "Tanvir Ahmed"
      });

      UI.closeModal("modal-add-homework");
      UI.showToast(`Homework assignment "${title}" published to ${className}!`, "success");
      hwForm.reset();
    });
  }

  // Attendance Save button
  const saveAttBtn = document.getElementById("save-attendance-btn");
  if (saveAttBtn) {
    saveAttBtn.addEventListener("click", () => {
      UI.showToast("Attendance roster saved & parent notifications dispatched!", "success");
    });
  }

  // Grade Entry form submit
  const gradeForm = document.getElementById("student-grade-form");
  if (gradeForm) {
    gradeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const studentId = document.getElementById("grade-student-id").value;
      const studentName = document.getElementById("grade-student-name-display").textContent;
      const subject = document.getElementById("grade-subject").value;
      const score = parseInt(document.getElementById("grade-score").value, 10);
      const totalMarks = parseInt(document.getElementById("grade-total").value, 10);
      const strengthsText = document.getElementById("grade-strengths").value;
      const remarks = document.getElementById("grade-remarks").value;

      let grade = "F";
      const pct = (score / totalMarks) * 100;
      if (pct >= 80) grade = "A+";
      else if (pct >= 70) grade = "A";
      else if (pct >= 60) grade = "A-";
      else if (pct >= 50) grade = "B";
      else grade = "C";

      window.appStore.addPerformanceReport({
        studentId,
        studentName,
        month: "August 2026 Model Test",
        subject,
        score,
        totalMarks,
        grade,
        strengths: strengthsText ? strengthsText.split(",").map(s => s.trim()) : ["Problem Solving"],
        areasForImprovement: ["Speed & Precision"],
        teacherRemarks: remarks
      });

      UI.closeModal("modal-enter-grade");
      UI.showToast(`Grade ${grade} recorded for ${studentName} in ${subject}!`, "success");
      gradeForm.reset();
    });
  }
}

window.openGradeEntryModal = function(studentId, studentName) {
  const idInput = document.getElementById("grade-student-id");
  const nameDisplay = document.getElementById("grade-student-name-display");
  if (idInput) idInput.value = studentId;
  if (nameDisplay) nameDisplay.textContent = studentName;
  UI.openModal("modal-enter-grade");
};
