/* GSAP & ScrollTrigger Animation Orchestrator */

document.addEventListener("DOMContentLoaded", () => {
  // Check if GSAP is available
  if (typeof gsap === "undefined") {
    console.warn("GSAP library not loaded. Falling back to native CSS transitions.");
    return;
  }

  // Register ScrollTrigger plugin if present
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- Landing Page Hero Timeline ---
  const heroContainer = document.querySelector(".hero-section");
  if (heroContainer) {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from(".navbar", {
        y: -40,
        opacity: 0,
        duration: 0.8
      })
      .from(".hero-badge", {
        y: 20,
        opacity: 0,
        duration: 0.5
      }, "-=0.4")
      .from(".hero-title-line", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9
      }, "-=0.3")
      .from(".hero-subtitle", {
        y: 25,
        opacity: 0,
        duration: 0.6
      }, "-=0.5")
      .from(".hero-cta-group", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5
      }, "-=0.4")
      .from(".hero-dashboard-preview", {
        scale: 0.92,
        y: 60,
        opacity: 0,
        duration: 1.0
      }, "-=0.6")
      .from(".floating-card-item", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "back.out(1.7)"
      }, "-=0.5");
  }

  // --- ScrollTrigger Feature Cards & Stats ---
  if (typeof ScrollTrigger !== "undefined") {
    // Feature Cards Stagger
    const featureCards = document.querySelectorAll(".feature-card-item");
    if (featureCards.length > 0) {
      gsap.from(featureCards, {
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%"
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out"
      });
    }

    // Role Section Reveal
    const roleCards = document.querySelectorAll(".role-preview-card");
    if (roleCards.length > 0) {
      gsap.from(roleCards, {
        scrollTrigger: {
          trigger: ".roles-section",
          start: "top 75%"
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
      });
    }

    // Statistics Count Up
    const statCounters = document.querySelectorAll(".stat-counter-number");
    statCounters.forEach(counter => {
      const targetVal = parseInt(counter.getAttribute("data-target"), 10);
      if (isNaN(targetVal)) return;

      gsap.to(counter, {
        scrollTrigger: {
          trigger: counter,
          start: "top 85%"
        },
        innerText: targetVal,
        duration: 2.0,
        snap: { innerText: 1 },
        ease: "power1.out"
      });
    });
  }

  // --- Dashboard Entrance Stagger ---
  const dashboardCards = document.querySelectorAll(".content-body .card, .content-body .stat-card");
  if (dashboardCards.length > 0) {
    gsap.from(dashboardCards, {
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power2.out"
    });
  }
});

// Interactive Payment Success Animation Trigger
window.animatePaymentSuccess = function(targetElement, callback) {
  if (typeof gsap === "undefined") {
    if (callback) callback();
    return;
  }

  const tl = gsap.timeline({ onComplete: callback });
  tl.to(targetElement, {
    scale: 0.95,
    duration: 0.15
  })
  .to(targetElement, {
    scale: 1.05,
    duration: 0.25,
    ease: "back.out(2)"
  })
  .to(targetElement, {
    scale: 1,
    duration: 0.2
  });
};
