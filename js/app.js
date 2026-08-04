/* Master Application Script & Shared Event Wiring */

document.addEventListener("DOMContentLoaded", () => {
  console.log("IJTutors Management System Loaded Successfully.");

  // Wire Logout Buttons
  document.querySelectorAll(".action-logout").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.authManager.logout();
    });
  });

  // Wire Demo Quick Login Buttons on Login Page
  const demoButtons = document.querySelectorAll(".btn-demo-login");
  if (demoButtons.length > 0) {
    demoButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role");
        const credentials = {
          admin: { email: "admin@ijtutors.demo", pass: "admin123" },
          teacher: { email: "teacher@ijtutors.demo", pass: "teacher123" },
          parent: { email: "parent@ijtutors.demo", pass: "parent123" },
          student: { email: "student@ijtutors.demo", pass: "student123" }
        };

        const cred = credentials[role];
        if (cred) {
          const emailInput = document.getElementById("login-email");
          const passInput = document.getElementById("login-password");
          if (emailInput) emailInput.value = cred.email;
          if (passInput) passInput.value = cred.pass;

          // Trigger login submit
          const loginForm = document.getElementById("login-form");
          if (loginForm) {
            loginForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        }
      });
    });
  }

  // Handle Login Form Submit
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;
      const remember = document.getElementById("login-remember") ? document.getElementById("login-remember").checked : true;

      const result = window.authManager.login(email, pass, remember);
      if (result.success) {
        UI.showToast(`Welcome back, ${result.user.name}! Redirecting...`, "success");
        setTimeout(() => {
          window.location.href = result.redirect;
        }, 600);
      } else {
        UI.showToast(result.message, "error", "Login Failed");
      }
    });
  }

  // Wire Course Marketing Card "Enroll Now" Triggers
  let activeCourseData = null;
  document.querySelectorAll(".btn-enroll-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-course-id");
      const title = btn.getAttribute("data-course-title");
      const fee = btn.getAttribute("data-course-fee");
      const room = btn.getAttribute("data-course-room");

      activeCourseData = { id, title, fee, room };

      const titleEl = document.getElementById("enroll-modal-selected-title");
      const priceEl = document.getElementById("enroll-modal-selected-price");
      const courseNameEl = document.getElementById("enroll-modal-course-name");

      if (titleEl) titleEl.textContent = title;
      if (priceEl) priceEl.textContent = "৳ " + Number(fee).toLocaleString('en-IN');
      if (courseNameEl) courseNameEl.textContent = `Enrolment: ${title}`;

      UI.openModal("modal-course-enrollment");
    });
  });

  // Handle Course Enrollment Form Submission
  const courseEnrollForm = document.getElementById("course-enrollment-form");
  if (courseEnrollForm) {
    courseEnrollForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const studentName = document.getElementById("enroll-student-name").value.trim();
      const parentName = document.getElementById("enroll-parent-name").value.trim();
      const phone = document.getElementById("enroll-phone").value.trim();
      const classStream = document.getElementById("enroll-class-select").value;
      const paymentRadio = document.querySelector('input[name="enroll-payment-method"]:checked');
      const paymentMethod = paymentRadio ? paymentRadio.value : "bKash";
      const senderPhoneInput = document.getElementById("enroll-sender-phone");
      const trxIdInput = document.getElementById("enroll-trx-id");

      const senderPhone = senderPhoneInput && senderPhoneInput.value.trim() ? senderPhoneInput.value.trim() : phone;
      const transactionId = trxIdInput && trxIdInput.value.trim() ? trxIdInput.value.trim() : ("TXN" + Math.floor(100000 + Math.random() * 900000));

      const courseTitle = activeCourseData ? activeCourseData.title : "HSC Science Coaching Batch";
      const courseFee = activeCourseData ? Number(activeCourseData.fee) : 3000;

      const refNo = "ENR-2026-" + Math.floor(1000 + Math.random() * 9000);
      const studentId = "STU-" + Date.now().toString().slice(-4);

      // Create & store student record in store
      const storeObj = window.appStore || window.store;
      if (storeObj) {
        const newStudent = {
          id: studentId,
          name: studentName,
          parentName: parentName,
          phone: phone,
          classStream: classStream,
          batch: courseTitle,
          dueFees: courseFee,
          paidFees: paymentMethod === "Cash" ? courseFee : 0,
          status: "Active",
          ref: refNo
        };
        if (storeObj.addStudent) storeObj.addStudent(newStudent);

        if (storeObj.addPayment) {
          storeObj.addPayment({
            id: "PAY-2026-" + Math.floor(1000 + Math.random() * 9000),
            studentId: studentId,
            studentName: studentName,
            className: classStream,
            month: "Enrolment Fee",
            batch: courseTitle,
            amount: courseFee,
            paymentMethod: paymentMethod,
            senderPhone: senderPhone,
            transactionId: transactionId,
            date: new Date().toISOString().split("T")[0],
            status: paymentMethod === "Cash" ? "paid" : "pending"
          });
        }
      }

      UI.closeModal("modal-course-enrollment");

      // Update & open success modal
      const refEl = document.getElementById("success-enroll-ref");
      const studentEl = document.getElementById("success-enroll-student");
      const courseEl = document.getElementById("success-enroll-course");
      const paymentEl = document.getElementById("success-enroll-payment");

      if (refEl) refEl.textContent = refNo;
      if (studentEl) studentEl.textContent = `${studentName} (${parentName})`;
      if (courseEl) courseEl.textContent = courseTitle;
      if (paymentEl) paymentEl.textContent = `${paymentMethod} (${paymentMethod === "Cash" ? "Paid & Verified" : "Pending Manual Verification"})`;

      UI.openModal("modal-enrollment-success");
      UI.showToast("Student enrolment submitted successfully!", "success", "Enrolment Confirmed");
      courseEnrollForm.reset();
    });
  }
});
