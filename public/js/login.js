const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const moonIcon = document.getElementById("moon-icon");
const sunIcon = document.getElementById("sun-icon");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const eyeIcon = document.getElementById("eye-icon");
const hint = document.getElementById("logpas");

logpas.addEventListener("click", () => {
  alert("Admin: admin 1234\nEmployee: sotr 4321\nUser: user user");
});

togglePasswordButton.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";

    eyeIcon.src = body.classList.contains("light-theme")
      ? "icons/eye_closed_dark.png"
      : "icons/eye_closed_light.png";
  } else {
    passwordInput.type = "password";

    eyeIcon.src = body.classList.contains("light-theme")
      ? "icons/eye_open_dark.png"
      : "icons/eye_open_light.png";
  }
});

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

    if (passwordInput.type === "password") {
      eyeIcon.src = "icons/eye_open_dark.png";
    } else {
      eyeIcon.src = "icons/eye_closed_dark.png";
    }
  } else {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    moonIcon.style.opacity = "0";
    sunIcon.style.opacity = "1";

    if (passwordInput.type === "password") {
      eyeIcon.src = "icons/eye_open_light.png";
    } else {
      eyeIcon.src = "icons/eye_closed_light.png";
    }
  }
}

function toggleTheme() {
  const newTheme = body.classList.contains("light-theme") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  setTheme(newTheme);
}

themeToggle.addEventListener("click", toggleTheme);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.redirect) {
      localStorage.setItem("role", data.role || "user");
      window.location.href = data.redirect;
    }
  } else {
    alert("Неверный логин или пароль");
  }
});
