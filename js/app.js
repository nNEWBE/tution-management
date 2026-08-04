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
});
