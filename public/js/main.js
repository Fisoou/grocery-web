const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const moonIcon = document.getElementById("moon-icon");
const sunIcon = document.getElementById("sun-icon");

body.style.transition = "none";

const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

setTimeout(() => {
  body.style.transition = "";
}, 10);

function setTheme(theme) {
  if (theme === "light") {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    moonIcon.style.opacity = "1";
    sunIcon.style.opacity = "0";
  } else {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    moonIcon.style.opacity = "0";
    sunIcon.style.opacity = "1";
  }
}

function toggleTheme() {
  const newTheme = body.classList.contains("light-theme") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  setTheme(newTheme);
}

themeToggle.addEventListener("click", toggleTheme);

function logout() {
  fetch("/logout", { method: "GET" }).then(() => {
    window.location.href = "/login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  if (!role) {
    window.location.href = "/";
    return;
  }

  const employeeButtons = document.querySelectorAll(".employee-only");
  const adminButtons = document.querySelectorAll(".admin-only");

  if (role === "employee") {
    adminButtons.forEach((btn) => (btn.style.display = "none"));
  } else if (role === "admin") {
  } else {
    window.location.href = "/shop.html";
  }
});
