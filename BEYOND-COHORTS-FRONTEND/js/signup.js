const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const fullName = document.getElementById("signupName").value;
const email = document.getElementById("signupEmail").value;
const password = document.getElementById("signupPassword").value;
const cohort = document.getElementById("signupCohort").value;

const response = await fetch("http://localhost:5000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fullName, email, password, cohort })
});

const data = await response.json();

if (response.ok) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  alert("Signup successful");
  window.location.href = "home.html";
} else {
alert(data.message || data.error || "Something went wrong");
}


});