/* Authentication & Role Authorization Manager */

const CURRENT_USER_KEY = "ijtutors_current_user";

class AuthManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  getCurrentUser() {
    const raw = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  login(email, password, remember = true) {
    const users = window.appStore.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    // Find matching user
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: "Invalid email address or user account not found." };
    }

    // Passwords check
    const validPasswords = {
      "admin@ijtutors.demo": "admin123",
      "teacher@ijtutors.demo": "teacher123",
      "parent@ijtutors.demo": "parent123",
      "student@ijtutors.demo": "student123"
    };

    let expectedPass = validPasswords[found.email.toLowerCase()];
    if (!expectedPass && found.password) {
      expectedPass = found.password;
    } else if (!expectedPass) {
      expectedPass = "123456";
    }

    if (password !== expectedPass) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    // Save session
    const sessionData = JSON.stringify(found);
    if (remember) {
      localStorage.setItem(CURRENT_USER_KEY, sessionData);
    } else {
      sessionStorage.setItem(CURRENT_USER_KEY, sessionData);
    }

    this.currentUser = found;
    return { success: true, user: found, redirect: this.getRoleDashboard(found.role) };
  }

  registerUser(name, email, password, role = "parent") {
    const users = window.appStore.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: "An account with this email address already exists." };
    }

    const newUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: cleanEmail,
      role: role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      password: password
    };

    window.appStore.data.users.push(newUser);
    window.appStore.save();

    // Auto login
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    this.currentUser = newUser;

    return {
      success: true,
      user: newUser,
      redirect: this.getRoleDashboard(role),
      message: `Account created successfully for ${name}!`
    };
  }

  logout() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    this.currentUser = null;
    window.location.href = "login.html";
  }

  getRoleDashboard(role) {
    switch (role) {
      case "admin": return "admin-dashboard.html";
      case "teacher": return "teacher-dashboard.html";
      case "parent":
      case "student": return "parent-dashboard.html";
      default: return "login.html";
    }
  }

  requireAuth(requiredRole = null) {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      return null;
    }

    if (requiredRole && user.role !== requiredRole && !(requiredRole === "parent" && user.role === "student")) {
      // Unauthorized role redirection
      window.location.href = this.getRoleDashboard(user.role);
      return null;
    }

    return user;
  }
}

window.authManager = new AuthManager();
