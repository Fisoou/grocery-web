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

async function fetchProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();

  const tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = products
    .map(
      (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.stock_quantity}</td>
            <td>${product.supplier_name}</td>
            <td>${formatDate(product.last_restocked_date)}</td>
          </tr>
      `
    )
    .join("");
}

function logout() {
  fetch("/logout", { method: "GET" }).then(() => {
    window.location.href = "/login.html";
  });
}
