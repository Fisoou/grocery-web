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

async function fetchSuppliers() {
  const response = await fetch("/api/suppliers");
  const suppliers = await response.json();

  const tbody = document.querySelector("#suppliers-table tbody");
  tbody.innerHTML = suppliers
    .map(
      (supplier) => `
          <tr>
            <td>${supplier.name}</td>
            <td>${supplier.contact_person}</td>
            <td>${supplier.phone_number}</td>
            <td>${supplier.address}</td>
            <td>${supplier.email}</td>
          </tr>
      `
    )
    .join("");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function logout() {
  fetch("/logout", { method: "GET" }).then(() => {
    window.location.href = "/login.html";
  });
}

function back() {
  fetch("/back", { method: "GET" }).then(() => {
    window.location.href = "/main.html";
  });
}

fetchSuppliers();
