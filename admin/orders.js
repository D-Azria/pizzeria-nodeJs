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
  const [rows] = await promisePool.execute(
    "SELECT * FROM orders NATURAL JOIN pizzas INNER JOIN customers on orders.cust_id=customers.cus_id INNER JOIN delivery_men ON orders.delivery_id=delivery_men.dm_id LEFT JOIN customer_adresses ON orders.ord_adresse=customer_adresses.addresse_id NATURAL JOIN order_pizza WHERE order_pizza.pizz_qt <> 0;"
  );

  // merge des tableaux pour afficher une seule ligne par commande
  const mergedOrders = rows.reduce((result, item) => {
    // Recherche d'une commande existante par son id : ord_id
    const existingOrder = result.find((order) => order.ord_id === item.ord_id);
    if (existingOrder) {
      // Si la commande existe déjà, push du label, de la quatité et du prix de la pizza dans l'objet qui appartient à cette commande
      existingOrder.label += `, ${item.label}`;
      existingOrder.pizz_qt += `, ${item.pizz_qt}`;
      existingOrder.price += `, ${item.price}`;
    } else {
      // Sinon, push des données rencontrées dans le nouveau tableau résultat
      result.push(item);
    }
    // mergedOrders renvoie le résultat
    return result;
  }, []);

  return mergedOrders;
}

//fonction qui permet de créer une commande
export async function newOrder(
  delivery_id,
  cust_id,
  allPizz_id,
  allPizz_qt,
  status,
  adresse
) {
  const [customer] = await promisePool.execute(
    "select * from customers where cus_id=?",
    [cust_id]
  );

  const [deliveryman] = await promisePool.execute(
    "select * from delivery_men where dm_id=?",
    [delivery_id]
  );

  const result = await promisePool.execute(
    "insert into orders(cust_id, delivery_id, status, ord_adresse) values(?,?,?,?)",
    [cust_id, delivery_id, status, adresse]
  );
  let idInsertion = result[0].insertId;
  const arrayPizzId = allPizz_id;
  const arrayPizzQt = allPizz_qt;

  const pizzFullOrder = arrayPizzId.map((element, index) => {
    const mergedPizzData = {
      pizz_id: element,
      pizz_qt: arrayPizzQt[index],
    };
    return mergedPizzData;
  });

  for (const pizzOrder of pizzFullOrder) {
    const { pizz_id, pizz_qt } = pizzOrder;
    await promisePool.execute(
      "insert into order_pizza(ord_id, pizz_id, pizz_qt) values(?,?,?)",
      [idInsertion, pizz_id, pizz_qt]
    );
  }
}

export async function deletePizzaOrder(ord_id) {
  const [rows] = await promisePool.execute(
    "DELETE FROM order_pizza WHERE ord_id=?",
    [ord_id]
  );
  return rows;
}

export async function deleteOrder(ord_id) {
  const [rows] = await promisePool.execute(
    "DELETE FROM orders WHERE ord_id=?",
    [ord_id]
  );
  return rows;
}
