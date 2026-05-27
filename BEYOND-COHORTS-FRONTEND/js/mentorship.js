// mentor.js

// ─────────────────────────────────────────────
// NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────────
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ─────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const icon = hamburger.querySelector("i");

  if (navLinks.classList.contains("open")) {
    icon.classList.remove("ti-menu-2");
    icon.classList.add("ti-x");
  } else {
    icon.classList.remove("ti-x");
    icon.classList.add("ti-menu-2");
  }
});

// ─────────────────────────────────────────────
// STATS COUNTER ANIMATION
// ─────────────────────────────────────────────
const counters = document.querySelectorAll(".stat-number");

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let current = 0;

    const increment = target / 60;

    const updateCounter = () => {
      current += increment;

      if (current < target) {
        counter.innerText = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  });
};

let statsAnimated = false;

window.addEventListener("scroll", () => {
  const statsSection = document.querySelector(".stats-section");

  if (!statsSection) return;

  const sectionTop = statsSection.getBoundingClientRect().top;

  if (sectionTop < window.innerHeight - 100 && !statsAnimated) {
    animateCounters();
    statsAnimated = true;
  }
});

// ─────────────────────────────────────────────
// FILTERING
// ─────────────────────────────────────────────
const searchInput = document.getElementById("searchInput");
const industryFilter = document.getElementById("industryFilter");
const expertiseFilter = document.getElementById("expertiseFilter");
const availabilityFilter = document.getElementById("availabilityFilter");

const applyFiltersBtn = document.getElementById("applyFilters");
const clearFiltersBtn = document.getElementById("clearFilters");
const resetSearchBtn = document.getElementById("resetSearch");

const mentorCards = document.querySelectorAll(".mentor-card");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const mentorsGrid = document.getElementById("mentorsGrid");

function filterMentors() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const industryValue = industryFilter.value;
  const expertiseValue = expertiseFilter.value;
  const availabilityValue = availabilityFilter.value;

  let visibleCount = 0;

  mentorCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const tags = card.dataset.tags.toLowerCase();
    const industry = card.dataset.industry;
    const expertise = card.dataset.expertise;
    const availability = card.dataset.availability;

    const matchesSearch =
      name.includes(searchValue) ||
      tags.includes(searchValue);

    const matchesIndustry =
      !industryValue || industry === industryValue;

    const matchesExpertise =
      !expertiseValue || expertise === expertiseValue;

    const matchesAvailability =
      !availabilityValue || availability === availabilityValue;

    const shouldShow =
      matchesSearch &&
      matchesIndustry &&
      matchesExpertise &&
      matchesAvailability;

    if (shouldShow) {
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  resultsCount.textContent =
    `Showing ${visibleCount} mentor${visibleCount !== 1 ? "s" : ""}`;

  if (visibleCount === 0) {
    emptyState.style.display = "block";
    mentorsGrid.style.display = "none";
  } else {
    emptyState.style.display = "none";
    mentorsGrid.style.display = "grid";
  }
}

applyFiltersBtn.addEventListener("click", filterMentors);

searchInput.addEventListener("input", filterMentors);

industryFilter.addEventListener("change", filterMentors);
expertiseFilter.addEventListener("change", filterMentors);
availabilityFilter.addEventListener("change", filterMentors);

// CLEAR FILTERS
function clearFilters() {
  searchInput.value = "";
  industryFilter.value = "";
  expertiseFilter.value = "";
  availabilityFilter.value = "";

  filterMentors();
}

clearFiltersBtn.addEventListener("click", clearFilters);

if (resetSearchBtn) {
  resetSearchBtn.addEventListener("click", clearFilters);
}

// ─────────────────────────────────────────────
// BOOKMARK BUTTONS
// ─────────────────────────────────────────────
const bookmarkButtons = document.querySelectorAll(".btn-bookmark");

bookmarkButtons.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("saved");

    const icon = button.querySelector("i");

    if (button.classList.contains("saved")) {
      icon.classList.remove("ti-bookmark");
      icon.classList.add("ti-bookmark-filled");

      showToast("Mentor saved successfully!");
    } else {
      icon.classList.remove("ti-bookmark-filled");
      icon.classList.add("ti-bookmark");

      showToast("Mentor removed from saved.");
    }
  });
});

// ─────────────────────────────────────────────
// CONNECT MODAL
// ─────────────────────────────────────────────
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalMentorName = document.getElementById("modalMentorName");

const connectButtons = document.querySelectorAll(".btn-connect");

connectButtons.forEach(button => {
  button.addEventListener("click", () => {
    const mentorName = button.dataset.name;

    modalMentorName.textContent = mentorName;

    modalOverlay.classList.add("open");

    document.body.style.overflow = "hidden";
  });
});

// CLOSE MODAL
function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// ESC KEY CLOSE
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// ─────────────────────────────────────────────
// SEND REQUEST
// ─────────────────────────────────────────────
const sendRequestBtn = document.getElementById("sendRequest");

sendRequestBtn.addEventListener("click", () => {
  const textarea = document.querySelector(".modal textarea");

  if (textarea.value.trim() === "") {
    textarea.style.borderColor = "#E24B4A";

    showToast("Please enter your mentorship goal.");

    return;
  }

  textarea.style.borderColor = "";

  closeModal();

  showToast("Mentorship request sent successfully!");

  textarea.value = "";
});

// ─────────────────────────────────────────────
// APPLY MENTOR BUTTON
// ─────────────────────────────────────────────
const applyMentorBtn = document.getElementById("applyMentorBtn");

applyMentorBtn.addEventListener("click", () => {
  showToast("Mentor application portal opening soon!");
});

// ─────────────────────────────────────────────
// TOAST FUNCTION
// ─────────────────────────────────────────────
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");

function showToast(message) {
  toastMsg.textContent = message;

  toast.classList.add("show");

  clearTimeout(toast.timeout);

  toast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ─────────────────────────────────────────────
// SMOOTH SCROLL FOR INTERNAL LINKS
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {
      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });

      navLinks.classList.remove("open");
    }
  });
});

// ─────────────────────────────────────────────
// CARD HOVER EFFECT
// ─────────────────────────────────────────────
mentorCards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  });
});