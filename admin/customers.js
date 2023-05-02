////////// BCrypt
import bcrypt from "bcrypt";
const saltRounds = 10;


////////// MySQL
import mysql from "mysql2";
//création d'un pool de connection : gère les connection avec la BD
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pizzeria",
  waitForConnections: true,
  connectionLimit: 10,
  // port par défaut utilisé : non nécessaire de le préciser
});

// La connexion à la base de données est établie
const promisePool = pool.promise();
//
//
////// FONCTIONS POUR LES CLIENTS
//
//
//fonction qui permet d'accéder aux données des clients
export async function listCustomers() {
  const [rows] = await promisePool.execute("select * from customers");
  return rows;
}

// fonction qui permet de créer un nouveau client dans la BD pizzeria table customers
export async function newCustomer(
  firstname,
  lastname,
  adresses,
  email,
  pwToHash
) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(pwToHash, salt);
  const [rows] = await promisePool.execute(
    "insert into customers(firstname, lastname, adresses, email, password) values(?,?,?,?,?)",
    [firstname, lastname, adresses, email, password]
  );
  return rows;
}

// permet d'éditer les clients en fonction de l'id qui reste fixe
export async function editCustomer(
  firstname,
  lastname,
  adresses,
  email,
  pwToHash
) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(pwToHash, salt);
    const [rows] = await promisePool.execute(
        "insert into customers(firstname, lastname, adresses, email, password) values(?,?,?,?,?)",
        [firstname, lastname, adresses, email, password]
        );
        return rows;
}

export async function resetCustomerPassword(pwToHash, id) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(pwToHash, salt);
  const [rows] = await promisePool.execute(
    "UPDATE customers SET password=? WHERE id=?",
    [password, id]
  );
console.log("password updated");
  return rows;
}
