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

////// FONCTIONS POUR LES COMMANDES
//
//
//
//
//fonction qui permet d'accéder aux données des commandes
export async function listOrders() {
    const [rows] = await promisePool.execute("select * from orders");
    return rows;
}

//fonction qui permet de créer une commande
export async function newOrder(
  delivery_id,
  cust_id,
  pizz_id,
  pizz_qt,
  status,
  adresse) {
    const [pizzas] = await promisePool.execute("select * from pizzas where pizz_id=?", [pizz_id]);
    const [customer] = await promisePool.execute("select * from customers where cus_id=?", [cust_id]);
    const [deliveryman] = await promisePool.execute("select * from delivery_men where dm_id=?", [delivery_id]);

    const [rows] = await promisePool.execute(
    "insert into orders(cust_id, delivery_id, status, adresse) values(?,?,?,?)", [cust_id, delivery_id, status, adresse]);
//    const [rowsb] = await promisePool.execute(
//    "insert into orders(cus_id, delivery_id, status) values(?,?,?)", [cus_id, delivery_id, status]);
//    const [rowsc] = await promisePool.execute(
//    "insert into order_pizza(pizz_id, pizz_qt) values(?,?)",[pizz_id, pizz_qt]);
console.log(pizzas);
console.log(customer);
console.log(deliveryman);
console.log(rowsa);
    return pizzas, rows /*, rowsb */ /*, rowsc */;
}
