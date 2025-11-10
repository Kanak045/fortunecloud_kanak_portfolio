/* =========================
   script.js (Kanak portfolio)
   ========================= */

/* ----- Config ----- */
// If your sticky header has a different selector, change this:
const headerSelector = ".navbar"; // fallback to <header> if not found
const headerEl = document.querySelector(headerSelector) || document.querySelector("header");

/* Cache DOM */
const sections = Array.from(document.querySelectorAll("section[id]"));
const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
const themeToggle = document.getElementById("theme-toggle");
const form = document.querySelector("form");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Helpers */
const headerOffset = () => (headerEl ? headerEl.getBoundingClientRect().height : 0);

/* ---------- Active nav link on scroll (rAF-throttled) ---------- */
let ticking = false;

function setActiveLinkOnScroll() {
  const triggerY = window.innerHeight * 0.33; // upper third
  let currentId = "";

  for (const sec of sections) {
    const rect = sec.getBoundingClientRect();
    const top = rect.top - headerOffset();
    const bottom = rect.bottom - headerOffset();
    if (top <= triggerY && bottom > triggerY) {
      currentId = sec.id;
      break;
    }
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "");
  });

  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(setActiveLinkOnScroll);
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", setActiveLinkOnScroll);
document.addEventListener("DOMContentLoaded", setActiveLinkOnScroll);

/* ---------- Smooth scroll with header offset ---------- */
function smoothScrollTo(target) {
  if (!target) return;

  const top =
    window.scrollY + target.getBoundingClientRect().top - (headerOffset() + 8); // 8px breathing room

  if (prefersReduced) {
    window.scrollTo({ top, left: 0 });
  } else {
    window.scrollTo({ top, left: 0, behavior: "smooth" });
  }

  // Accessibility: focus the target after scrolling
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

// Click on nav links
navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    const hash = a.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
      history.pushState(null, "", hash);
    }
  });
});

// Handle direct hash on load and on hash changes
window.addEventListener("load", () => {
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) setTimeout(() => smoothScrollTo(target), 0);
  }
});
window.addEventListener("hashchange", () => {
  const target = document.querySelector(location.hash);
  if (target) smoothScrollTo(target);
});

/* ---------- Dark / Light mode toggle with persistence ---------- */
(function applyStoredThemeEarly() {
  const stored = localStorage.getItem("theme");
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && preferDark)) {
    document.body.classList.add("dark-mode");
  }
})();

function updateThemeToggleIcon() {
  if (!themeToggle) return;
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

updateThemeToggleIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeToggleIcon();
  });
}

/* ---------- Fade-in reveal on scroll ---------- */
const faders = document.querySelectorAll(".fade-in");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("show")),
    { threshold: 0.2 }
  );
  faders.forEach((el) => io.observe(el));
} else {
  faders.forEach((el) => el.classList.add("show"));
}

/* ---------- Contact form (demo or real endpoint) ---------- */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const endpoint = form.getAttribute("action"); // e.g., Formspree URL
    if (endpoint) {
      try {
        const data = new FormData(form);
        const res = await fetch(endpoint, { method: "POST", body: data });
        if (res.ok) {
          alert("Thank you! Your message has been submitted.");
          form.reset();
        } else {
          alert("Oops! Something went wrong. Please try again.");
        }
      } catch {
        alert("Network error. Please try again later.");
      }
    } else {
      // Demo fallback
      alert("Thank you! Your message has been submitted (demo).");
      form.reset();
    }
  });
}




/* =========================
   script.js
   ========================= */

/* Highlight active nav link on scroll */
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* Smooth scroll for in-page links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* Demo contact form handler (no backend yet) */
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been submitted (demo).");
    form.reset();
  });
}

/* Dark / Light mode toggle */
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });
}

/* Fade-in effect on scroll */
const faders = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.2 });

  faders.forEach(el => observer.observe(el));
} else {
  // Fallback for very old browsers
  faders.forEach(el => el.classList.add('show'));
}
