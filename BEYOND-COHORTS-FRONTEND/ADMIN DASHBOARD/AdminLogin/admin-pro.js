// dashboard-protection.js

const token = localStorage.getItem("token");
const loggedIn = localStorage.getItem("adminLoggedIn");

if (!token || !loggedIn) {
  // Redirect if not authenticated
  window.location.href = "../AdminLogin/login.html";
}


/* LOGOUT FUNCTION */
function logout(){

    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../AdminLogin/login.html";

}