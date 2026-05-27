/* ───────── MENU DROPDOWN ───────── */

const menuButton = document.querySelector(".menu-button");

const dropdownMenu = document.querySelector(".dropdown-menu");

menuButton.addEventListener("click", () => {

  dropdownMenu.classList.toggle("active");

});

/* ───────── APPLICATION MODAL ───────── */

const modal = document.getElementById("applicationModal");

const applyButtons = document.querySelectorAll(".course-card button");

const closeModal = document.querySelector(".close-modal");

let currentOpportunityId = null;

const BASE_URL = "http://localhost:5000/api";

/* OPEN MODAL */

applyButtons.forEach((button) => {

  button.addEventListener("click", () => {

    // Get the opportunity card and extract data
    const card = button.closest(".course-card");
    const title = card.querySelector("h2").textContent;
    
    // Store current opportunity title (can be extended to store ID if available)
    currentOpportunityId = title;
    
    modal.classList.add("active");

  });

});

/* CLOSE MODAL */

closeModal.addEventListener("click", () => {

  modal.classList.remove("active");

});

/* CLOSE ON OUTSIDE CLICK */

window.addEventListener("click", (e) => {

  if(e.target === modal){

    modal.classList.remove("active");

  }

});

/* ───────── APPLICATION FORM ───────── */

const applicationForm = document.querySelector(".application-form");

const formMessage = document.querySelector(".form-message");

applicationForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const fullName = document.getElementById("fullName").value;

  const email = document.getElementById("emailAddress").value;

  const phone = document.getElementById("phoneNumber").value;

  const cv = document.getElementById("cvFile").files[0];

  if(!fullName || !email || !phone || !cv){

    formMessage.textContent = "Please fill in all fields.";
    formMessage.style.color = "#ef4444";

    return;
  }

  try {
    const button = applicationForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Submitting...";

    // For now, we'll submit to a local storage (since we don't have the opportunity ID from the frontend)
    // In a full implementation, we'd need opportunity IDs on the cards
    const application = {
      fullName,
      email,
      phone,
      opportunityTitle: currentOpportunityId,
      appliedAt: new Date().toISOString()
    };

    // Store in localStorage for now
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");
    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));

    formMessage.textContent = "Application submitted successfully 🚀";
    formMessage.style.color = "#10b981";

    applicationForm.reset();

    setTimeout(() => {

      modal.classList.remove("active");

      formMessage.textContent = "";
      button.disabled = false;
      button.textContent = "Submit Application";

    }, 2000);

  } catch (error) {
    console.error("Error submitting application:", error);
    formMessage.textContent = "Error submitting application. Please try again.";
    formMessage.style.color = "#ef4444";
    const button = applicationForm.querySelector("button");
    button.disabled = false;
    button.textContent = "Submit Application";
  }

});

/* ───────── SUBSCRIBE FORM ───────── */

const subscribeForm = document.querySelector(".subscribe-form");

subscribeForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;

  if(email === ""){

    alert("Please enter your email");

    return;
  }

  alert("Subscribed successfully 💜");

  subscribeForm.reset();

});