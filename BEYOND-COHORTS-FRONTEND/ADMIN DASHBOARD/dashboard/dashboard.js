const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function counter(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (!obj) return;
  const range = end - start;
  if (range === 0) { obj.innerHTML = end.toLocaleString(); return; }
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.max(1, Math.abs(Math.floor(duration / range)));
  const timer = setInterval(() => {
    current += increment;
    obj.innerHTML = current.toLocaleString();
    if (current === end) clearInterval(timer);
  }, stepTime);
}

async function fetchDashboardStats() {
  const token = getToken();

  try {
    // Fetch events (public endpoint)
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const events    = eventsRes.ok ? await eventsRes.json() : [];

    counter("eventsCount", 0, events.length, 1000);
    counter("eventsCount2", 0, events.length, 1000);

    // Fetch opportunities
    const oppRes = await fetch(`${BASE_URL}/opportunities`);
    const opportunities = oppRes.ok ? await eventsRes.json() : [];
    counter("jobsCount", 0, opportunities.length, 1000);

    // Fetch users (protected — requires token)
    if (token) {
      const usersRes = await fetch(`${BASE_URL}/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const users = await usersRes.json();
        counter("memberCount", 0, users.length, 1500);
        counter("memberCount2", 0, users.length, 1500);
        const active = users.filter(u => u.isApproved).length;
        counter("activeCount", 0, active, 1200);
        counter("activeCount2", 0, active, 1200);
      }
    }
  } catch (err) {
    console.error("Dashboard stats error:", err);
  }
}

// Load opportunities in sidebar
async function loadOpportunitiesSidebar() {
  try {
    const res = await fetch(`${BASE_URL}/opportunities`);
    const opportunities = res.ok ? await res.json() : [];
    
    const list = document.getElementById("opportunitiesList");
    if (!list) return;

    if (opportunities.length === 0) {
      list.innerHTML = '<p class="empty-state">No opportunities posted yet</p>';
      return;
    }

    list.innerHTML = opportunities.map(opp => `
      <div class="opportunity-item" title="${opp.title}">
        <div class="opportunity-item-title">${opp.title}</div>
        <div class="opportunity-item-count">${opp.applicants?.length || 0} applicants</div>
      </div>
    `).join('');
  } catch (err) {
    console.error("Failed to load opportunities:", err);
  }
}

// Quick action: Add Event → navigate to Events page
const addEventBtn = document.getElementById("addEventBtn");
if (addEventBtn) {
  addEventBtn.addEventListener("click", () => {
    window.location.href = "../../Events/Events.html";
  });
}

// Quick action: Post Opportunity → open modal
const postJobBtn = document.getElementById("postJobBtn");
const opportunityModal = document.getElementById("opportunityModal");
const opportunityForm = document.getElementById("opportunityForm");
const closeBtn = document.querySelector(".opportunity-modal .close-modal");

if (postJobBtn) {
  postJobBtn.addEventListener("click", () => {
    opportunityModal.classList.add("active");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    opportunityModal.classList.remove("active");
  });
}

// Close modal on outside click
if (opportunityModal) {
  window.addEventListener("click", (e) => {
    if (e.target === opportunityModal) {
      opportunityModal.classList.remove("active");
    }
  });
}

// Handle opportunity form submission
if (opportunityForm) {
  opportunityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("oppTitle").value;
    const description = document.getElementById("oppDescription").value;
    const company = document.getElementById("oppCompany").value;
    const category = document.getElementById("oppCategory").value;
    const type = document.getElementById("oppType").value;
    const location = document.getElementById("oppLocation").value;
    const deadline = document.getElementById("oppDeadline").value;
    const imageFile = document.getElementById("oppImage").files[0];

    const formMessage = document.querySelector(".opportunity-form .form-message");

    if (!title || !description || !company || !category || !type || !location || !deadline) {
      formMessage.textContent = "Please fill in all required fields.";
      formMessage.style.color = "#ef4444";
      return;
    }

    try {
      const button = opportunityForm.querySelector("button");
      button.disabled = true;
      button.textContent = "Posting...";

      const oppData = {
        title,
        description,
        company,
        category,
        type,
        location,
        deadline,
        image: imageFile ? imageFile.name : null
      };

      const res = await fetch(`${BASE_URL}/opportunities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(oppData)
      });

      if (res.ok) {
        formMessage.textContent = "Opportunity posted successfully! 🎉";
        formMessage.style.color = "#10b981";
        opportunityForm.reset();

        // Reload sidebar
        setTimeout(() => {
          loadOpportunitiesSidebar();
          counter("jobsCount", parseInt(document.getElementById("jobsCount").textContent) || 0, 
                   parseInt(document.getElementById("jobsCount").textContent) + 1 || 1, 500);
        }, 1000);

        setTimeout(() => {
          opportunityModal.classList.remove("active");
          formMessage.textContent = "";
          button.disabled = false;
          button.textContent = "Post Opportunity";
        }, 2000);
      } else {
        formMessage.textContent = "Failed to post opportunity. Try again.";
        formMessage.style.color = "#ef4444";
        button.disabled = false;
        button.textContent = "Post Opportunity";
      }
    } catch (err) {
      console.error("Error posting opportunity:", err);
      formMessage.textContent = "An error occurred. Please try again.";
      formMessage.style.color = "#ef4444";
      const button = opportunityForm.querySelector("button");
      button.disabled = false;
      button.textContent = "Post Opportunity";
    }
  });
}

window.onload = () => {
  fetchDashboardStats();
  loadOpportunitiesSidebar();
};

// Refresh opportunities every 30 seconds
setInterval(loadOpportunitiesSidebar, 30000);
