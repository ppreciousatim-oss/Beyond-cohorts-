const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const communityForm = document.getElementById('communityForm');
const toast = document.getElementById('toast');

openModalBtn.addEventListener('click', () => {
  modalOverlay.classList.add('show');
});

closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('show');
  }
});

communityForm.addEventListener('submit', (e) => {
  e.preventDefault();

  modalOverlay.classList.remove('show');

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);

  communityForm.reset();
});

const joinButtons = document.querySelectorAll('.join-btn');

joinButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.innerHTML = '<i class="ti ti-check"></i> Joined';
    button.disabled = true;
    button.style.opacity = '0.7';
  });
});

const joinBtn = document.getElementById("joinCommunityBtn");

joinBtn.addEventListener("click", () => {

  window.location.href = "community-chat.html";

});