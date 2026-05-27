const loginForm = document.getElementById("loginForm");
const feedback = document.getElementById("feedback");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  feedback.style.color = "#534AB7";
  feedback.textContent = "Logging in...";

  try {
    const response = await fetch("http://localhost:5000/api/auth/login",
       {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();


    

    if (response.ok) {
      localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

      feedback.style.color = "green";
      feedback.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } else {
      feedback.style.color = "red";
      feedback.textContent = data.message || "Invalid credentials";
    }
  } catch (error) {
    console.log(error);
    feedback.style.color = "red";
    feedback.textContent = "Server error. Please try again.";
  }
});
