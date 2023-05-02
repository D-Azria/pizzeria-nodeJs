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

////// FONCTIONS POUR LES LIVREURS
//
//
//
//
//fonction qui permet d'accéder aux données des livreurs
export async function listDM() {
    const [rows] = await promisePool.execute("select * from delivery_men");
    // console.log(rows);
    return rows;
  }
// fonction qui permet de créer un nouveau serveur dans la BD pizzeria, table delivery_men
export async function newDM(firstname, lastname) {
    const [rows] = await promisePool.execute(
      "insert into delivery_men(firstname, lastname) values(?,?)",
      [firstname, lastname]
    );
    return rows;
  }
// permet d'éditer les livreurs en fonction de l'id qui reste fixe
export async function editDM(firstname, lastname) {
  const [rows] = await promisePool.execute(
    "insert into delivery_men(firstname, lastname) values(?,?)",
    [firstname, lastname]
  );
  return rows;
}