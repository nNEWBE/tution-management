/* UI Utilities: Modals, Toasts, Tab Controls, Formatting Helpers */

class UI {
  static formatBDT(amount) {
    if (amount === undefined || amount === null) return "৳ 0";
    return "৳ " + Number(amount).toLocaleString('en-IN');
  }

  static formatDate(dateString) {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  static showToast(message, type = "info", title = "") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
      success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
      error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
      info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    };

    const displayTitle = title || (type.charAt(0).toUpperCase() + type.slice(1));

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${displayTitle}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Trigger animate in
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    UI.initCustomSelects();
  }

  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  static initTabs() {
    document.querySelectorAll(".tab-list").forEach(tabList => {
      const tabs = tabList.querySelectorAll(".tab-item");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          const targetPaneId = tab.getAttribute("data-tab");
          if (!targetPaneId) return;

          // Remove active from sibling tabs
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");

          // Find container and toggle panes
          const parentContainer = tabList.closest(".tabs-wrapper") || document;
          const panes = parentContainer.querySelectorAll(".tab-pane");
          panes.forEach(pane => {
            if (pane.id === targetPaneId) {
              pane.classList.add("active");
            } else {
              pane.classList.remove("active");
            }
          });
        });
      });
    });
  }

  static initSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const appShell = document.querySelector(".app-shell");
    const toggleBtn = document.querySelector(".sidebar-toggle-btn");
    const mobileBtn = document.querySelector(".mobile-nav-toggle");

    if (toggleBtn && sidebar && appShell) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        appShell.classList.toggle("sidebar-collapsed");
      });
    }

    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
    }
  }

  static initCustomSelects() {
    document.querySelectorAll("select.form-select:not(.custom-select-enhanced)").forEach(select => {
      select.classList.add("custom-select-enhanced");
      select.style.display = "none";

      const wrapper = document.createElement("div");
      wrapper.className = "custom-select-wrapper";

      const trigger = document.createElement("div");
      trigger.className = "custom-select-trigger";
      
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      const labelSpan = document.createElement("span");
      labelSpan.textContent = selectedOption ? selectedOption.text : "";
      
      const arrow = document.createElement("span");
      arrow.className = "arrow-icon";
      arrow.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>`;

      trigger.appendChild(labelSpan);
      trigger.appendChild(arrow);

      const dropdown = document.createElement("div");
      dropdown.className = "custom-select-dropdown";

      const updateDropdownOptions = () => {
        dropdown.innerHTML = "";
        Array.from(select.options).forEach((opt, idx) => {
          const optionEl = document.createElement("div");
          optionEl.className = `custom-select-option ${opt.selected ? "selected" : ""}`;
          optionEl.innerHTML = `
            <span>${opt.text}</span>
            <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          `;
          optionEl.addEventListener("click", (e) => {
            e.stopPropagation();
            select.selectedIndex = idx;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            labelSpan.textContent = opt.text;
            wrapper.classList.remove("open");
            updateDropdownOptions();
          });
          dropdown.appendChild(optionEl);
        });
      };

      updateDropdownOptions();

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".custom-select-wrapper.open").forEach(w => {
          if (w !== wrapper) w.classList.remove("open");
        });
        wrapper.classList.toggle("open");
      });

      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
      wrapper.appendChild(trigger);
      wrapper.appendChild(dropdown);

      select.addEventListener("change", () => {
        const currentOpt = select.options[select.selectedIndex];
        if (currentOpt) labelSpan.textContent = currentOpt.text;
        updateDropdownOptions();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  UI.initCustomSelects();
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select-wrapper.open").forEach(w => w.classList.remove("open"));
  });
});

window.UI = UI;
