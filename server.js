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

app.post("/api/products", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  const {
    name,
    category,
    price,
    stock_quantity,
    supplier_name,
    last_restocked_date,
  } = req.body;

  try {
    // Check if the product already exists
    const checkProductQuery = `
      SELECT * FROM products WHERE name = $1;
    `;
    const { rows } = await pool.query(checkProductQuery, [name]);

    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Продукт с таким названием уже существует" });
    }

    // Insert the new product into the products table
    const insertProductQuery = `
      INSERT INTO products (name, category, price, stock_quantity, supplier_id, last_restocked_date)
      VALUES ($1, $2, $3, $4, (SELECT supplier_id FROM suppliers WHERE name = $5), $6);
    `;
    await pool.query(insertProductQuery, [
      name,
      category,
      price,
      stock_quantity,
      supplier_name,
      last_restocked_date,
    ]);

    res.status(201).json({ message: "Продукт добавлен" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Ошибка сервера при добавлении продукта" });
  }
});

// DELETE product based on product name
app.delete("/api/products/delete", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Вы не авторизованы");
  }

  const { name } = req.body;

  try {
    // Check if the product exists before attempting to delete it
    const checkProductQuery = `
      SELECT * FROM products WHERE name = $1;
    `;
    const { rows } = await pool.query(checkProductQuery, [name]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Продукт не найден" });
    }

    // Delete the product from the database
    const deleteProductQuery = `
      DELETE FROM products WHERE name = $1;
    `;
    await pool.query(deleteProductQuery, [name]);

    res.status(200).json({ message: "Продукт удален" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении продукта" });
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
  console.log(`Сервер запущен на: http://localhost:${port}/login.html`);
});
