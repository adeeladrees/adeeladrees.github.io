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

  const lightbox = document.querySelector("[data-lightbox]");
  const portfolioTriggers = document.querySelectorAll(".portfolio-trigger");

  if (lightbox && portfolioTriggers.length) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");
    let previouslyFocused = null;

    const openLightbox = (trigger) => {
      if (!lightboxImage) {
        return;
      }
      const src = trigger.getAttribute("data-portfolio-src");
      const alt = trigger.getAttribute("data-portfolio-alt") || "";
      const caption =
        trigger.getAttribute("data-portfolio-caption") || alt || "";

      lightboxImage.src = src || "";
      lightboxImage.alt = alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }

      previouslyFocused = document.activeElement;
      lightbox.removeAttribute("hidden");
      lightbox.dataset.open = "true";
      document.body.classList.add("lightbox-open");

      const closeButton = lightbox.querySelector(".lightbox-close");
      if (closeButton) {
        closeButton.focus();
      }
    };

    const closeLightbox = () => {
      if (!lightboxImage) {
        return;
      }
      lightboxImage.src = "";
      lightboxImage.alt = "";
      lightbox.dataset.open = "false";
      lightbox.setAttribute("hidden", "");
      document.body.classList.remove("lightbox-open");
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };

    portfolioTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openLightbox(trigger));
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(trigger);
        }
      });
    });

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", closeLightbox);
    });

    lightbox.addEventListener("click", (event) => {
      if (
        event.target instanceof Element &&
        event.target.dataset.lightboxClose !== undefined
      ) {
        closeLightbox();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.dataset.open === "true") {
        closeLightbox();
      }
    });
  }
});
