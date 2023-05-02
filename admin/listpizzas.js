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
////// FONCTIONS POUR LES PIZZAS
//
//
//fonction qui permet d'accéder aux données des pizzas

export async function listPizzas() {
  const [rows] = await promisePool.execute("select * from pizzas");
  // console.log(rows);
  return rows;
}

