document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.getElementById("primary-navigation");
  const navLinks = navMenu ? Array.from(navMenu.querySelectorAll("a")) : [];

  const updateNavBackground = () => {
    const shouldSolid =
      window.scrollY > 48 ||
      (navMenu && navMenu.dataset.open && navMenu.dataset.open === "true");
    if (nav) {
      nav.classList.toggle("is-solid", shouldSolid);
    }
  };

  updateNavBackground();
  window.addEventListener("scroll", updateNavBackground);

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.dataset.open === "true";
      navMenu.dataset.open = String(!isOpen);
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      document.body.classList.toggle("nav-open", !isOpen);
      updateNavBackground();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.dataset.open = "false";
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        updateNavBackground();
      });
    });
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    const animatedTargets = document.querySelectorAll(
      ".section, .service-card, .portfolio-item"
    );

    animatedTargets.forEach((el) => {
      el.classList.add("will-animate");
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    animatedTargets.forEach((el) => observer.observe(el));
  }
});
