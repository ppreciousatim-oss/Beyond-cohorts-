/* ── beyond-cohorts | script.js ───────────────────── */

document.addEventListener("DOMContentLoaded", () => {

  /* ── 1. MOBILE NAV TOGGLE ─────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  hamburger?.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.innerHTML = isOpen
      ? '<i class="ti ti-x"></i>'
      : '<i class="ti ti-menu-2"></i>';
  });

  // Close nav when a link is clicked
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.innerHTML = '<i class="ti ti-menu-2"></i>';
    });
  });

  // Close nav on outside click
  document.addEventListener("click", (e) => {
    if (!navLinks?.contains(e.target) && !hamburger?.contains(e.target)) {
      navLinks?.classList.remove("open");
      if (hamburger) hamburger.innerHTML = '<i class="ti ti-menu-2"></i>';
    }
  });


  /* ── 2. ACTIVE NAV LINK ON SCROLL ─────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  const observerOptions = { rootMargin: "-40% 0px -40% 0px" };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((s) => sectionObserver.observe(s));


  /* ── 3. NAVBAR SHADOW ON SCROLL ───────────────────── */
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 10);
  });

  // Add scrolled style dynamically
  const scrollStyle = document.createElement("style");
  scrollStyle.textContent = `.navbar.scrolled { box-shadow: 0 2px 12px rgba(0,0,0,0.10); }`;
  document.head.appendChild(scrollStyle);


  /* ── 4. RSVP BUTTON FEEDBACK ──────────────────────── */
  document.querySelectorAll(".btn-rsvp").forEach((btn) => {
    btn.addEventListener("click", function () {
      const original = this.textContent;
      this.textContent = "✓ Done!";
      this.style.background = "#0F6E56";
      this.style.borderColor = "#0F6E56";
      this.disabled = true;
      setTimeout(() => {
        this.textContent = original;
        this.style.background = "";
        this.style.borderColor = "";
        this.disabled = false;
      }, 2500);
    });
  });


  /* ── 5. APPLY BUTTON FEEDBACK ─────────────────────── */
  document.querySelectorAll(".btn-apply").forEach((btn) => {
    btn.addEventListener("click", function () {
      const original = this.textContent;
      this.textContent = "Applied ✓";
      this.style.background = "#E1F5EE";
      this.style.color = "#0F6E56";
      this.style.borderColor = "#0F6E56";
      setTimeout(() => {
        this.textContent = original;
        this.style.background = "";
        this.style.color = "";
        this.style.borderColor = "";
      }, 2500);
    });
  });


  /* ── 6. TESTIMONIAL DOTS ──────────────────────────── */
  const dots = document.querySelectorAll(".dot");
  let activeIdx = 0;

  const rotateDots = () => {
    dots[activeIdx].classList.remove("active");
    activeIdx = (activeIdx + 1) % dots.length;
    dots[activeIdx].classList.add("active");
  };

  const dotInterval = setInterval(rotateDots, 3000);

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(dotInterval);
      dots[activeIdx].classList.remove("active");
      activeIdx = i;
      dots[activeIdx].classList.add("active");
    });
  });


  /* ── 7. NEWSLETTER FORM ───────────────────────────── */
  const newsletterForm = document.querySelector(".newsletter-form");
  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector("input[type='email']");
    const btn   = newsletterForm.querySelector("button");
    if (!input?.value) return;
    btn.textContent = "Subscribed ✓";
    btn.style.background = "#0F6E56";
    input.value = "";
    input.placeholder = "Thank you!";
    setTimeout(() => {
      btn.textContent = "Subscribe";
      btn.style.background = "";
      input.placeholder = "Enter your email";
    }, 3000);
  });

  // Also handle button click (non-form submit)
  const subBtn = document.querySelector(".newsletter-form .btn-primary");
  subBtn?.addEventListener("click", () => {
    const input = document.querySelector(".newsletter-form input");
    if (!input?.value) {
      input.focus();
      input.style.borderColor = "#E24B4A";
      setTimeout(() => { input.style.borderColor = ""; }, 1500);
      return;
    }
    subBtn.textContent = "Subscribed ✓";
    subBtn.style.background = "#0F6E56";
    input.value = "";
    input.placeholder = "Thank you!";
    setTimeout(() => {
      subBtn.textContent = "Subscribe";
      subBtn.style.background = "";
      input.placeholder = "Enter your email";
    }, 3000);
  });


  /* ── 8. SCROLL-IN ANIMATIONS ──────────────────────── */
  const animStyle = document.createElement("style");
  animStyle.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .fade-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(animStyle);

  const animTargets = document.querySelectorAll(
    ".feature-card, .event-card, .opp-card, .leader-card, .testimonial-card, .stat-item"
  );

  animTargets.forEach((el, i) => {
    el.classList.add("fade-up");
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animTargets.forEach((el) => fadeObserver.observe(el));


  /* ── 9. JOIN SISTERHOOD BUTTONS ───────────────────── */
  document.querySelectorAll(".btn-primary, .btn-cta").forEach((btn) => {
    if (btn.textContent.includes("Join") || btn.textContent.includes("Sisterhood")) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // Scroll to top / show auth modal — wire to your auth routes
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Future: open registration modal
        // openModal("register");
      });
    }
  });


  /* ── 10. SMOOTH ANCHOR SCROLL ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

});



const themeToggle = document.getElementById("themeToggle");
const toggleIcon = document.getElementById("toggleIcon");

// LOAD SAVED THEME
if(localStorage.getItem("theme") === "dark"){

  document.body.classList.add("dark-mode");

  if(toggleIcon){
    toggleIcon.innerHTML =
    '<i class="fa-solid fa-moon"></i>';
  }

} else {

  if(toggleIcon){
    toggleIcon.innerHTML =
    '<i class="fa-solid fa-sun"></i>';
  }

}

// TOGGLE THEME
if(themeToggle){

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    // SAVE THEME
    if(document.body.classList.contains("dark-mode")){

      localStorage.setItem("theme", "dark");

      if(toggleIcon){
        toggleIcon.innerHTML =
        '<i class="fa-solid fa-moon"></i>';
      }

    } else {

      localStorage.setItem("theme", "light");

      if(toggleIcon){
        toggleIcon.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
      }

    }

  });

}
//redirect to home page if not logged in
if (!localStorage.getItem("token")) 

function logout(){

  // remove saved user data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // redirect to login page
  window.location.href = "login.html";
}

