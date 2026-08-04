# IJTutors — Paperless Tuition & Coaching Management System

![IJTutors Banner](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80)

**IJTutors** is an enterprise-grade, paperless tuition and coaching management platform designed for educational centers and private tuition institutes in Bangladesh (Savar & Dhaka Campuses). Built with pure Vanilla Web Technologies (HTML5, CSS3, ES6 JavaScript) and modern glassmorphic UI aesthetics, the platform provides seamless role-based portals for **Center Administrators**, **Subject Tutors**, and **Parents/Students**.

---

## 🌟 Key System Features

### 🏢 1. Center Admin Control Panel (`admin-dashboard.html`)
- **Real-Time Financial & Administrative Metrics**: Instant tracking of Total Active Students, Assigned Teachers, Pending/Overdue Tuition Fees, and Total Collected Revenue in BDT (`৳`).
- **Student CRUD Management**: Filter students by class stream or fee status, add new students, edit roll numbers, and view guardian contacts.
- **Teacher & Tutor Directory**: Manage subject tutors, assigned classes, weekly class hours, and contact details.
- **Payment & Fee Ledgers**: Filter payments by status (`Paid`, `Pending`, `Overdue`), send automated payment reminders, and issue printable money receipts.
- **Conflict-Free Timetable Builder**: Schedule weekly class slots with assigned tutors, time slots, and room occupancy tracking (e.g., Room 101, Room 102).
- **Notice & Announcement Publisher**: Publish target notices to Parents, Students, or Tutors with high/medium priority flags.
- **Paperless Registration Approvals**: Review and approve/reject online student admission requests submitted by parents.

---

### 🎓 2. Teacher & Tutor Portal (`teacher-dashboard.html`)
- **Interactive Daily Attendance Logger**: One-click attendance marking (`Present`, `Absent`, `Late`) with live percentage metrics.
- **Model Test Marks & Evaluation**: Record exam scores, marks percentages, letter grades (`A+`, `A`, `B`), and custom tutor remarks for each student.
- **Homework Assignment Publisher**: Create homework tasks with submission deadlines and detailed resource instructions.

---

### 👨‍👩‍👧 3. Parent & Student Hub (`parent-dashboard.html`)
- **4-Point Executive Overview**:
  1. **Next Scheduled Class**: Live countdown to upcoming subject routine slot and classroom location.
  2. **Fee Standing**: Billed monthly tuition amount and status badge (`PENDING` / `PAID`).
  3. **Pending Homework**: Assigned homework tasks due this week.
  4. **Overall Attendance**: Real-time attendance percentage score.
- **Online bKash / Nagad / Card Payment Gateway**: Instant tuition fee checkout with automatic receipt generation.
- **1-Page Printable Money Receipt**: Optimized receipt view with `@media print` formatting for clean paper printing.
- **Paperless Student Enrolment Form**: 4-step online admission form for enrolling new students directly within the dashboard.

---

### 🌐 4. Public Website & Routine Simulator (`index.html`)
- **Interactive Dark Glass Routine Simulator**: Live timeline feed featuring active class status (`68% Live Session`, `100% Completed`), day selector tabs (Sat to Wed), room occupancy badges, and class routine cards.
- **Modern CTA Banner**: Dark royal-blue glass gradient container with instant demo role chips.
- **Course & Batch Catalog**: Detailed breakdown of SSC & HSC Science stream subjects (General Math, Physics, Chemistry, Higher Math).

---

## 🎨 Custom Design System & UI Components

IJTutors includes a custom-built, dependency-free CSS component library (`css/components.css`, `css/tokens.css`):

1. **Smart Viewport-Aware Select Dropdown**:
   - Replaces native OS select popups with elevated floating cards (`box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18)`).
   - Features real-time viewport collision detection (`trigger.getBoundingClientRect()`) that automatically opens the dropdown **upwards** when near the bottom of the screen.
2. **Custom Form Controls**:
   - Pure CSS animated checkboxes and radio buttons with royal-blue gradient fills (`linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)`).
   - Smooth sliding toggle switches for attendance management.
3. **Glassmorphic Modals**:
   - Backdrop blur overlays (`backdrop-filter: blur(6px)`) with spring scale-in transitions.
   - Circular SVG close buttons with hover rotation and red accents.
   - Automatic outside-click backdrop listener to dismiss open modals.
4. **Sleek Sidebar Navigation**:
   - Glowing blue left indicator pill on active links, hover slide micro-interactions (`transform: translateX(4px)`), and glassmorphic user profile footer card.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | HTML5, Modern Vanilla JavaScript (ES6+ Modules) |
| **Styling & Design System** | Vanilla CSS3 (Custom Properties / Design Tokens, Flexbox, CSS Grid, Glassmorphism) |
| **Icons** | Pure SVG Vector Icons (No Emoji graphics used) |
| **State Management** | Reactive LocalStorage Data Store (`js/store.js`) |
| **Authentication** | Session & LocalStorage Role Auth Manager (`js/auth.js`) |
| **Typography** | Google Fonts (*Sora*, *Inter*, *JetBrains Mono*) |

---

## 📁 Repository Structure

```
Rokib/
├── index.html               # Public Home Page & Routine Simulator
├── login.html               # Multi-Role Portal Authentication Gateway
├── register.html            # Public Paperless Admission Form
├── admin-dashboard.html     # Center Admin Control Panel Dashboard
├── teacher-dashboard.html   # Tutor & Attendance Dashboard
├── parent-dashboard.html    # Parent & Student Portal Dashboard
├── css/
│   ├── base.css             # HTML Resets & Base Typography Rules
│   ├── tokens.css           # Design Tokens (Colors, Spacing, Border Radii, Shadows)
│   ├── components.css       # Custom Buttons, Modals, Selects, Checkboxes, Cards
│   ├── layout.css           # Navigation Bars, Sidebars, Topbars, Main Shell
│   ├── dashboard.css        # Dashboard Grids, Tables, Print Receipt Styles
│   ├── utilities.css        # Utility Utility Helper Classes
│   └── main.css             # Main CSS Master Import File
├── js/
│   ├── mock-data.js         # Initial Pre-Populated Mock Data (Students, Teachers, Timetable)
│   ├── store.js            # Reactive Application Data Store & LocalStorage Sync
│   ├── auth.js             # Role Authorization & User Session Manager
│   ├── ui.js               # Modal Controls, Tabs, Custom Dropdown Enhancer
│   ├── admin.js            # Admin Dashboard CRUD Handlers & Approval Logic
│   ├── teacher.js          # Attendance & Marks Evaluation Handlers
│   ├── parent.js           # Parent Fee Checkout & Enrolment Handlers
│   └── app.js              # Core Application Initialization Engine
└── README.md                # Project Documentation
```

---

## 🔐 Preset Demo User Credentials

Test the multi-role access control gateway using these pre-configured demo credentials:

| Role | Email | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Center Admin** | `admin@ijtutors.demo` | `admin123` | `admin-dashboard.html` |
| **Subject Tutor** | `teacher@ijtutors.demo` | `teacher123` | `teacher-dashboard.html` |
| **Parent / Student** | `parent@ijtutors.demo` | `parent123` | `parent-dashboard.html` |

---

## 🚀 Installation & Local Running

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nNEWBE/tution-management.git
   cd tution-management
   ```

2. **Run Locally**:
   - Since the application is built with standard Web Technologies, open `index.html` directly in any web browser, or serve using VS Code Live Server:
   ```bash
   npx serve ./
   ```

3. **Deploy to Production**:
   - Deploy the repository to GitHub Pages, Netlify, or Vercel with zero build step requirements.

---

## 📍 Campus Location & Contact

- **Address**: Palli Bidyut, Savar, Dhaka-1344, Bangladesh.
- **Repository**: [github.com/nNEWBE/tution-management](https://github.com/nNEWBE/tution-management)
- **License**: MIT Open Source License.

---
*© 2026 IJTutors Tuition Management System. Developed for Savar & Dhaka Campuses.*
