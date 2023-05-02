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

// fonction qui permet de créer une nouvelle pizza dans la BD pizzeria table pizzas
export async function newPizza(code, label, ingredients, category, price, version) {
    const [rows] = await promisePool.execute(
      "insert into pizzas(code, label, ingredients, category, price, version) values(?,?,?,?,?,?)",
      [code, label, ingredients, category, price, version]
    );
    return rows;
  }
  
   // permet d'éditer les pizzas en fonction de l'id qui reste fixe
   export async function editPizza(code, label, ingredients, category, price, version) {
    const [rows] = await promisePool.execute(
      "insert into pizzas(code, label, ingredients, category, price, version) values(?,?,?,?,?,?)",
      [code, label, ingredients, category, price, version]
    );
    return rows;
  }