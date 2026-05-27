// NAVBAR SHADOW
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

// MOBILE MENU
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// FILTER EVENTS
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const clearBtn = document.getElementById("clearBtn");

const cards = document.querySelectorAll(".event-card");

function filterEvents() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const category = card.dataset.category;

    const matchesSearch = title.includes(searchValue);
    const matchesCategory = !categoryValue || category === categoryValue;

    if (matchesSearch && matchesCategory) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", filterEvents);
categoryFilter.addEventListener("change", filterEvents);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";

  filterEvents();
});

// MODAL
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const closeModalBtn = document.getElementById("closeModalBtn");
const joinButtons = document.querySelectorAll(".join-btn");

joinButtons.forEach(button => {
  button.addEventListener("click", () => {
    modalOverlay.classList.add("open");
    showToast("Event registration successful!");
  });
});

function closeModal() {
  modalOverlay.classList.remove("open");
}

modalClose.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// TOAST
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

function showToast(message) {
  toastMessage.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// SMOOTH SCROLL
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
  link.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

async function loadApprovedEvents(){

  try {

    const res = await fetch(
    "http://localhost:5000/api/events"
    );

    const events =
    await res.json();

    // FILTER ONLY APPROVED
    const approvedEvents =
    events.filter(event =>
      event.status === "Approved"
    );

    const container =
    document.getElementById(
    "approvedEvents"
    );

    container.innerHTML = "";

    approvedEvents.forEach(event => {

      const card =
      document.createElement("div");

      card.classList.add("event-card");

      card.innerHTML = `

        <img
        src="images/ai.png">

        <h3>${event.title}</h3>

        <p>${event.category}</p>

        <p>
        ${new Date(event.date)
        .toLocaleDateString()}
        </p>

      `;

      container.appendChild(card);

    });

  } catch(err){

    console.log(err);

  }

}

window.onload =
loadApprovedEvents;

