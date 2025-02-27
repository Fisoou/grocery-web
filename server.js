// Не моё.
const express = require("express");
const { Pool } = require("pg");
const session = require("express-session");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "grocery",
  password: "1",
  port: 5432,
});

app.use(
  session({
    secret: "bebe",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT username, role FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (rows.length > 0) {
      req.session.user = rows[0];

      if (rows[0].role === "user") {
        return res.json({ redirect: "/shop.html" });
      } else {
        return res.json({ redirect: "/main.html", role: rows[0].role });
      }
    } else {
      res.status(401).send("Неверный логин или пароль");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Не удалось выйти");
    }
    res.redirect("/");
  });
});

app.get("/back", (req, res) => {
  res.redirect("/main.html");
});

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

app.get("/api/sales", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  try {
    const { rows } = await pool.query("SELECT * FROM sales_view");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/api/suppliers", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  try {
    const { rows } = await pool.query("SELECT * FROM suppliers");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/api/audit", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  try {
    const { rows } = await pool.query("SELECT * FROM inventory_audit_view");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/api/users", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/api/employees", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  try {
    const { rows } = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на: http://localhost:${port}`);
});
