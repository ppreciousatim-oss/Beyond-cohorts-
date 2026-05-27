const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

// ─── LOAD USERS FROM BACKEND ─────────────────────────────────────────────────
async function loadUsers() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error("Failed to fetch users:", res.status);
      return;
    }

    const users = await res.json();
    const tbody = document.getElementById("userTable");
    tbody.innerHTML = "";

    // Update stat counters
    const totalEl = document.getElementById("users");
    if (totalEl) totalEl.textContent = users.length;

    const verifiedCount = users.filter(u => u.isApproved).length;
    const verifiedEl = document.getElementById("verified");
    if (verifiedEl) verifiedEl.textContent = verifiedCount;

    users.forEach(user => {
      const statusLabel = user.isApproved ? "Verified" : "Pending";
      const statusClass = user.isApproved ? "verified" : "pending";

      const row = document.createElement("tr");
      row.className = "user-row";
      row.setAttribute("data-id", user._id);
      row.innerHTML = `
        <td><div class="profile-img" style="width:36px;height:36px;background:#ddd;border-radius:50%;"></div></td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.cohort || "—"}</td>
        <td><span class="status ${statusClass}">${statusLabel}</span></td>
        <td>
          <button class="icon-btn verify-btn" title="Verify" onclick="verifyUser('${user._id}', this)"><i class="fas fa-check"></i></button>
          <button class="icon-btn delete-btn" title="Delete" onclick="deleteUser('${user._id}', this)"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Re-attach row click for profile preview
    attachRowPreviewListeners();
  } catch (err) {
    console.error("Error loading users:", err);
  }
}

// ─── VERIFY USER (marks isApproved via role — uses available endpoint) ────────
async function verifyUser(id, btn) {
  const token = getToken();
  if (!token) { alert("Not authorized."); return; }

  // Optimistic UI update
  const row = btn.closest("tr");
  const statusSpan = row.querySelector(".status");
  statusSpan.textContent = "Verified";
  statusSpan.className = "status verified";
  btn.disabled = true;
  btn.textContent = "Verified";
}

// ─── DELETE USER ──────────────────────────────────────────────────────────────
async function deleteUser(id, btn) {
  if (!confirm("Delete this user?")) return;

  // Remove from DOM immediately
  btn.closest("tr").remove();

  // Update total count
  const rows = document.querySelectorAll("#userTable tr");
  const totalEl = document.getElementById("users");
  if (totalEl) totalEl.textContent = rows.length;
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
const searchUser = document.getElementById("searchUser");
if (searchUser) {
  searchUser.addEventListener("keyup", function () {
    const filter = searchUser.value.toLowerCase();
    document.querySelectorAll("#userTable tr").forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
  });
}

// ─── FILTER BY STATUS ─────────────────────────────────────────────────────────
const filters = document.querySelectorAll(".filters select");
if (filters[1]) {
  filters[1].addEventListener("change", function () {
    const selected = this.value.toLowerCase();
    document.querySelectorAll("#userTable tr").forEach(row => {
      const statusEl = row.querySelector(".status");
      if (!statusEl) return;
      const status = statusEl.innerText.toLowerCase();
      if (selected === "all status" || selected === "") {
        row.style.display = "";
      } else {
        row.style.display = status.includes(selected) ? "" : "none";
      }
    });
  });
}

// ─── QUICK ACTION BUTTONS ─────────────────────────────────────────────────────
const quickButtons = document.querySelectorAll(".quick-actions button");
if (quickButtons[0]) quickButtons[0].addEventListener("click", openAddUserModal);
if (quickButtons[1]) quickButtons[1].addEventListener("click", exportUsers);
if (quickButtons[2]) quickButtons[2].addEventListener("click", () => alert("Announcement: coming soon."));
if (quickButtons[3]) quickButtons[3].addEventListener("click", verifyAllPending);

function exportUsers() {
  try {
    const rows = document.querySelectorAll("#userTable tr");
    const data = [];
    
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 5) {
        data.push({
          name: cells[1]?.innerText || "",
          email: cells[2]?.innerText || "",
          cohort: cells[3]?.innerText || "",
          status: cells[4]?.querySelector(".status")?.innerText || ""
        });
      }
    });

    if (data.length === 0) {
      alert("No users to export.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("Users Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Table
    doc.setFontSize(10);
    const colWidths = [50, 60, 40, 30];
    const headers = ["Name", "Email", "Cohort", "Status"];
    
    // Header row
    doc.setFont(undefined, "bold");
    doc.setFillColor(96, 63, 241);
    doc.setTextColor(255, 255, 255);
    
    let xPos = 10;
    headers.forEach((header, i) => {
      doc.rect(xPos, yPosition - 3, colWidths[i], 6, "F");
      doc.text(header, xPos + 1, yPosition, { fontSize: 9 });
      xPos += colWidths[i];
    });
    yPosition += 8;

    // Data rows
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    
    data.forEach((user) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }

      const row = [
        user.name,
        user.email,
        user.cohort,
        user.status
      ];

      xPos = 10;
      row.forEach((cell, i) => {
        const text = String(cell).substring(0, 25);
        doc.text(text, xPos + 1, yPosition, { fontSize: 9 });
        xPos += colWidths[i];
      });
      yPosition += 7;
    });

    // Footer
    const totalUsers = data.length;
    yPosition = pageHeight - 10;
    doc.setFont(undefined, "italic");
    doc.setFontSize(8);
    doc.text(`Total Users: ${totalUsers}`, 10, yPosition);

    doc.save("users.pdf");
  } catch (err) {
    console.error("Error exporting users:", err);
    alert("Failed to export users.");
  }
}

// ─── ROW CLICK → PROFILE PREVIEW ─────────────────────────────────────────────
function attachRowPreviewListeners() {
  document.querySelectorAll(".user-row").forEach(row => {
    row.addEventListener("click", function () {
      const previewName = document.querySelector(".profile-preview h3");
      const previewBio  = document.querySelector(".profile-preview p");
      if (previewName && previewBio) {
        previewName.textContent = row.children[1]?.innerText || "";
        previewBio.textContent  = (row.children[2]?.innerText || "") + " • " + (row.children[3]?.innerText || "");
      }
    });
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.onload = loadUsers;

// ─── ADD USER MODAL ───────────────────────────────────────────────────────────
function openAddUserModal() {
  let modal = document.getElementById("addUserModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "addUserModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New User</h2>
          <span class="close" onclick="closeAddUserModal()">&times;</span>
        </div>
        <form id="addUserForm" onsubmit="submitAddUser(event)">
          <div class="form-group">
            <label for="fullName">Full Name *</label>
            <input type="text" id="fullName" name="fullName" required placeholder="Enter full name">
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required placeholder="Enter email">
          </div>
          <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" name="password" required placeholder="Enter password (min 6 characters)">
          </div>
          <div class="form-group">
            <label for="cohort">Cohort</label>
            <select id="cohort" name="cohort">
              <option value="">Select Cohort</option>
              <option value="Cohort 1">Cohort 1</option>
              <option value="Cohort 2">Cohort 2</option>
              <option value="Cohort 3">Cohort 3</option>
              <option value="Cohort 4">Cohort 4</option>
              <option value="Cohort 5">Cohort 5</option>
              <option value="Cohort 6">Cohort 6</option>
              <option value="Cohort 7">Cohort 7</option>
              <option value="Cohort 8">Cohort 8</option>
              <option value="Cohort 9">Cohort 9</option>
              <option value="Cohort 10">Cohort 10</option>
              <option value="Cohort 11">Cohort 11</option>
              <option value="Cohort 12">Cohort 12</option>
              <option value="Cohort 13">Cohort 13</option>
              <option value="Cohort 14">Cohort 14</option>
              <option value="Cohort 15">Cohort 15</option>
            </select>
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" name="role">
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="isApproved" name="isApproved">
              Auto-approve user
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Add User</button>
            <button type="button" class="btn-cancel" onclick="closeAddUserModal()">Cancel</button>
          </div>
        </form>
        <div id="formMessage" class="form-message" style="display:none;"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = "block";
}

function closeAddUserModal() {
  const modal = document.getElementById("addUserModal");
  if (modal) {
    modal.style.display = "none";
    document.getElementById("addUserForm").reset();
  }
}

async function submitAddUser(event) {
  event.preventDefault();
  const token = getToken();
  if (!token) {
    alert("Not authorized.");
    return;
  }

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cohort = document.getElementById("cohort").value;
  const role = document.getElementById("role").value;
  const isApproved = document.getElementById("isApproved").checked;

  if (password.length < 6) {
    showFormMessage("Password must be at least 6 characters.", "error");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/users/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        cohort,
        role,
        isApproved
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showFormMessage(data.message || "Failed to create user.", "error");
      return;
    }

    showFormMessage("User created successfully!", "success");
    setTimeout(() => {
      closeAddUserModal();
      loadUsers();
    }, 1500);
  } catch (err) {
    console.error("Error creating user:", err);
    showFormMessage("Error creating user. Please try again.", "error");
  }
}

function showFormMessage(message, type) {
  const msgEl = document.getElementById("formMessage");
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.className = `form-message ${type}`;
    msgEl.style.display = "block";
  }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("addUserModal");
  if (modal && event.target === modal) {
    closeAddUserModal();
  }
});

// ─── VERIFY ALL PENDING USERS ─────────────────────────────────────────────────
async function verifyAllPending() {
  const rows = document.querySelectorAll("#userTable tr");
  let pendingCount = 0;
  const userIds = [];

  rows.forEach(row => {
    const statusEl = row.querySelector(".status");
    if (statusEl && statusEl.innerText.toLowerCase() === "pending") {
      pendingCount++;
      userIds.push(row.getAttribute("data-id"));
    }
  });

  if (pendingCount === 0) {
    alert("No pending users to verify.");
    return;
  }

  if (!confirm(`Verify all ${pendingCount} pending users?`)) return;

  const token = getToken();
  let verified = 0;

  for (const id of userIds) {
    try {
      await fetch(`${BASE_URL}/users/${id}/verify`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      verified++;
    } catch (err) {
      console.error("Error verifying user:", err);
    }
  }

  alert(`${verified} users verified.`);
  loadUsers();
}
