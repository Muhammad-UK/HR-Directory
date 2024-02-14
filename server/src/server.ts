import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
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
