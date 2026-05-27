const API_URL = "http://localhost:5000/api/events";

function getToken() {
  return localStorage.getItem("token");
}

// LOAD EVENTS
async function loadEvents() {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();

    const table = document.getElementById("eventTable");
    table.innerHTML = "";

    document.getElementById("Eventcounter").textContent = events.length;

    const hackathons = events.filter(e => e.category === "Hackathon");
    document.querySelectorAll(".count")[1].textContent = hackathons.length;

    const workshops = events.filter(e => e.category === "Workshop");
    document.querySelectorAll(".count")[2].textContent = workshops.length;

    let totalRegs = 0;

    events.forEach(event => {
      totalRegs += Number(event.registrations);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><div style="width:40px;height:40px;background:#e8e8e8;border-radius:4px;"></div></td>
        <td>${event.title}</td>
        <td>${event.category}</td>
        <td>${event.date}</td>
        <td>${event.registrations}</td>
        <td>
          <span class="status ${event.status.toLowerCase()}">${event.status}</span>
        </td>
        <td>
          <button class="icon-btn approve-btn" title="Approve" onclick="approveEvent('${event._id}')"><i class="fas fa-check"></i></button>
          <button class="icon-btn reject-btn" title="Reject" onclick="rejectEvent('${event._id}')"><i class="fas fa-times"></i></button>
          <button class="icon-btn edit-btn" title="Edit" onclick="editEvent('${event._id}', '${escapeQuotes(event.title)}', '${escapeQuotes(event.category)}', '${escapeQuotes(event.date)}', ${event.registrations})"><i class="fas fa-pen"></i></button>
          <button class="icon-btn delete-btn" title="Delete" onclick="deleteEvent('${event._id}')"><i class="fas fa-trash"></i></button>
        </td>
      `;
      table.appendChild(row);
    });

    document.querySelectorAll(".count")[3].textContent = totalRegs;
  } catch (err) {
    console.error("Failed to load events:", err);
  }
}

function escapeQuotes(str) {
  return String(str).replace(/'/g, "\\'");
}

// CREATE EVENT
document.getElementById("createEventBtn").addEventListener("click", openCreateEventModal);

// APPROVE EVENT
async function approveEvent(id) {
  const token = getToken();
  if (!token) { alert("Not authorized."); return; }

  const res = await fetch(`${API_URL}/${id}/approve`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (res.ok) {
    loadEvents();
  } else {
    const data = await res.json();
    alert(data.message || "Failed to approve event.");
  }
}

// REJECT EVENT
async function rejectEvent(id) {
  const token = getToken();
  if (!token) { alert("Not authorized."); return; }

  const res = await fetch(`${API_URL}/${id}/reject`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (res.ok) {
    loadEvents();
  } else {
    const data = await res.json();
    alert(data.message || "Failed to reject event.");
  }
}

// EDIT EVENT
async function editEvent(id, currentTitle, currentCategory, currentDate, currentRegs) {
  const title = prompt("Event Name:", currentTitle);
  if (title === null) return;
  const category = prompt("Category:", currentCategory);
  if (category === null) return;
  const date = prompt("Date:", currentDate);
  if (date === null) return;
  const registrations = prompt("Registrations:", currentRegs);
  if (registrations === null) return;

  const token = getToken();
  if (!token) { alert("Not authorized."); return; }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, category, date, registrations: Number(registrations) })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Event Updated!");
      loadEvents();
    } else {
      alert(data.message || "Failed to update event.");
    }
  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
}

// DELETE EVENT
async function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  const token = getToken();
  if (!token) { alert("Not authorized."); return; }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      alert("Event Deleted.");
      loadEvents();
    } else {
      alert(data.message || "Failed to delete event.");
    }
  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
}

// APPROVE ALL PENDING EVENTS
document.getElementById("approveAllBtn").addEventListener("click", async () => {
  if (!confirm("Approve all pending events?")) return;

  const token = getToken();
  if (!token) { alert("Not authorized."); return; }

  try {
    const res = await fetch(API_URL);
    const events = await res.json();
    const pending = events.filter(e => e.status === "Pending");

    if (pending.length === 0) { alert("No pending events."); return; }

    await Promise.all(pending.map(e =>
      fetch(`${API_URL}/${e._id}/approve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      })
    ));

    alert(`${pending.length} event(s) approved!`);
    loadEvents();
  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
});

// EXPORT EVENTS
document.getElementById("exportBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();

    if (events.length === 0) {
      alert("No events to export.");
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
    doc.text("Events Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Table
    doc.setFontSize(10);
    const colWidths = [25, 40, 30, 25, 20, 25];
    const headers = ["Event Name", "Category", "Date", "Registrations", "Status", "Description"];
    
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
    
    events.forEach((event) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }

      const row = [
        event.title || "",
        event.category || "",
        event.date || "",
        event.registrations || "0",
        event.status || "",
        event.description || ""
      ];

      xPos = 10;
      row.forEach((cell, i) => {
        const text = String(cell).substring(0, 20);
        doc.text(text, xPos + 1, yPosition, { fontSize: 9 });
        xPos += colWidths[i];
      });
      yPosition += 7;
    });

    // Footer
    const totalEvents = events.length;
    yPosition = pageHeight - 10;
    doc.setFont(undefined, "italic");
    doc.setFontSize(8);
    doc.text(`Total Events: ${totalEvents}`, 10, yPosition);

    doc.save("events.pdf");
  } catch (err) {
    alert("Failed to export events.");
    console.error(err);
  }
});

// SEND REMINDER — sets a reminder email + date on a specific event via the backend
document.getElementById("reminderBtn").addEventListener("click", async () => {
  const token = getToken();
  if (!token) { alert("You must be logged in to set reminders."); return; }

  let events;
  try {
    const res = await fetch(API_URL);
    events = await res.json();
  } catch (err) {
    alert("Failed to load events.");
    return;
  }

  if (events.length === 0) { alert("No events found."); return; }

  const list   = events.map((e, i) => `${i + 1}. ${e.title} (${e.date})`).join("\n");
  const choice = prompt("Select event number to set a reminder:\n\n" + list);
  const idx    = parseInt(choice) - 1;

  if (isNaN(idx) || idx < 0 || idx >= events.length) { alert("Invalid selection."); return; }

  const event         = events[idx];
  const reminderEmail = prompt("Reminder email address:");
  if (!reminderEmail) return;

  const reminderDate = prompt("Reminder date & time (e.g. 2026-06-19T10:00):");
  if (!reminderDate) return;

  try {
    const res = await fetch(`${API_URL}/${event._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ reminderEmail, reminderDate })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Reminder set for "${event.title}" → ${reminderEmail} on ${reminderDate}`);
    } else {
      alert(data.message || "Failed to set reminder.");
    }
  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
});

// LOAD ON PAGE START
window.onload = loadEvents;

// ─── CREATE EVENT MODAL ─────────────────────────────────────────────────────
function openCreateEventModal() {
  let modal = document.getElementById("createEventModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "createEventModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Event</h2>
          <span class="close" onclick="closeCreateEventModal()">&times;</span>
        </div>
        <form id="addEventForm" onsubmit="submitCreateEvent(event)">
          <div class="form-group">
            <label for="eventTitle">Event Name *</label>
            <input type="text" id="eventTitle" name="title" required placeholder="Enter event name">
          </div>
          <div class="form-group">
            <label for="eventCategory">Category *</label>
            <select id="eventCategory" name="category" required>
              <option value="">Select Category</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Webinar">Webinar</option>
              <option value="Networking">Networking</option>
              <option value="Meetup">Meetup</option>
              <option value="Conference">Conference</option>
              <option value="Bootcamp">Bootcamp</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="eventDate">Date *</label>
            <input type="text" id="eventDate" name="date" required placeholder="e.g. 20 June 2026">
          </div>
          <div class="form-group">
            <label for="eventRegistrations">Expected Registrations</label>
            <input type="number" id="eventRegistrations" name="registrations" min="0" value="0" placeholder="Enter number of registrations">
          </div>
          <div class="form-group">
            <label for="eventDescription">Description</label>
            <textarea id="eventDescription" name="description" placeholder="Event description" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-family:Arial,sans-serif;min-height:100px;"></textarea>
          </div>
          <div class="form-group">
            <label for="eventLocation">Location</label>
            <input type="text" id="eventLocation" name="location" placeholder="Event location">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Create Event</button>
            <button type="button" class="btn-cancel" onclick="closeCreateEventModal()">Cancel</button>
          </div>
        </form>
        <div id="eventFormMessage" class="form-message" style="display:none;"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = "block";
}

function closeCreateEventModal() {
  const modal = document.getElementById("createEventModal");
  if (modal) {
    modal.style.display = "none";
    document.getElementById("addEventForm").reset();
  }
}

async function submitCreateEvent(event) {
  event.preventDefault();
  const token = getToken();
  if (!token) {
    showEventFormMessage("Not authorized.", "error");
    return;
  }

  const title = document.getElementById("eventTitle").value;
  const category = document.getElementById("eventCategory").value;
  const date = document.getElementById("eventDate").value;
  const registrations = parseInt(document.getElementById("eventRegistrations").value) || 0;
  const description = document.getElementById("eventDescription").value;
  const location = document.getElementById("eventLocation").value;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        category,
        date,
        registrations,
        description,
        location
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showEventFormMessage(data.message || "Failed to create event.", "error");
      return;
    }

    showEventFormMessage("Event created successfully!", "success");
    setTimeout(() => {
      closeCreateEventModal();
      loadEvents();
    }, 1500);
  } catch (err) {
    console.error("Error creating event:", err);
    showEventFormMessage("Error creating event. Please try again.", "error");
  }
}

function showEventFormMessage(message, type) {
  const msgEl = document.getElementById("eventFormMessage");
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.className = `form-message ${type}`;
    msgEl.style.display = "block";
  }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("createEventModal");
  if (modal && event.target === modal) {
    closeCreateEventModal();
  }
});
