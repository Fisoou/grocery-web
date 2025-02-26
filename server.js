// Не моё.
const express = require("express");
const { Pool } = require("pg");
const session = require("express-session");

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "grocery",
  password: "1",
  port: 5432,
});

// Session middleware
app.use(
  session({
    secret: "bebe", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (rows.length > 0) {
      req.session.user = rows[0]; // Store user in session
      res.redirect("/table.html"); // Redirect to the table page
    } else {
      res.status(401).send("Неверный логин или пароль");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// Logout endpoint
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Не удалось выйти");
    }
    res.redirect("/"); // Redirect to the login page
  });
});

// Middleware to protect the table page
app.use("/table.html", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/"); // Redirect to login if not authenticated
  }
  next();
});

// API endpoint to fetch products (protected)
app.get("/api/products", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  try {
    const { rows } = await pool.query("SELECT * FROM products_view");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
