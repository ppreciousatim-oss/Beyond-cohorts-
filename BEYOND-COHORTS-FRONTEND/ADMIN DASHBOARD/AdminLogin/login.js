const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      message.style.color = "lightgreen";
      message.textContent = "Login Successful";

      setTimeout(() => {
        window.location.href = "../dashboard/dashboard.html";
      }, 1000);
    } else {
      message.style.color = "#ce1515";
      message.textContent = data.message || "Invalid Username or ";
    }
  } catch (err) {
    message.style.color = "#ce1515";
    message.textContent = "Server error. Please try again.";
    console.error(err);
  }
});
