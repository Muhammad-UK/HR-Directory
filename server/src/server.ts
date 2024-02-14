import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_directory"
);

app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
            SELECT * 
            FROM employees
        `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});
app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
            SELECT * 
            FROM departments
          `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
            DELETE FROM employees
            WHERE id = $1;
        `;
    await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.post("/api/employees", async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.department_id)
      return next("Missing valid body arguments");
    const SQL = /*sql*/ `
            INSERT INTO employees(name, department_id) 
            VALUES($1, $2)
            RETURNING *
        `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.department_id,
    ]);
    res.status(201).send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/employees/:id", async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.department_id) {
      return next("Missing valid body arguments");
    }
    const SQL = /*sql*/ `
        UPDATE employees
        SET name = $1, department_id = $2
        WHERE id = $3
        RETURNING *
    `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.department_id,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  console.log("Connecting to database...");
  await client.connect();
  console.log("Connected to database successfully");

  let SQL = /*sql*/ `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
        id SERIAL PRIMARY KEY,
        name VARCHAR(40)
    );
    CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        department_id INTEGER REFERENCES departments(id) NOT NULL
    );
  `;
  await client.query(SQL);
  console.log("Tables created successfully");

  // TODO theres gotta be a better way of writing this sql
  SQL = /*sql*/ `
    INSERT INTO departments(name) VALUES
        ('GENERAL'), 
        ('GROCERY'),
        ('MEAT'),
        ('PRODUCE'),
        ('DAIRY');
    INSERT INTO employees(name, department_id) VALUES('Alex', (
        SELECT id FROM departments WHERE name = 'GENERAL'
    ));
    INSERT INTO employees(name, department_id) VALUES('John', (
        SELECT id FROM departments WHERE name = 'GENERAL'
    ));
    INSERT INTO employees(name, department_id) VALUES('Sheri', (
        SELECT id FROM departments WHERE name = 'GENERAL'
    ));
    INSERT INTO employees(name, department_id) VALUES('Gary', (
        SELECT id FROM departments WHERE name = 'GROCERY'
    ));
    INSERT INTO employees(name, department_id) VALUES('Chase', (
        SELECT id FROM departments WHERE name = 'DAIRY'
    ));
    INSERT INTO employees(name, department_id) VALUES('Tyler', (
        SELECT id FROM departments WHERE name = 'MEAT'
    ));
  `;
  await client.query(SQL);
  console.log("Data successfully seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();
