////////// IMPORT DES MODULES
import mysql from "mysql2";
import express from "express";
const app = express();

//////////IMPORT DES FONCTIONS
////// FONCTIONS POUR LES PIZZAS
import { listPizzas } from "./admin/pizzas.js";
import { newPizza } from "./admin/pizzas.js";
import { editPizza } from "./admin/pizzas.js";
import { deletePizza } from "./admin/pizzas.js";
/* 
//fonction qui permet d'accéder aux données des pizzas
async function listPizzas() {
  const [rows] = await promisePool.execute("select * from pizzas");
  // console.log(rows);
  return rows;
}

// fonction qui permet de créer une nouvelle pizza dans la BD pizzeria table pizzas
async function newPizza(code, label, ingredients, category, price, version) {
  const [rows] = await promisePool.execute(
    "insert into pizzas(code, label, ingredients, category, price, version) values(?,?,?,?,?,?)",
    [code, label, ingredients, category, price, version]
  );
  return rows;
}

// permet d'éditer les pizzas en fonction de l'id qui reste fixe
async function editPizza(code, label, ingredients, category, price, version) {
  const [rows] = await promisePool.execute(
    "insert into pizzas(code, label, ingredients, category, price, version) values(?,?,?,?,?,?)",
    [code, label, ingredients, category, price, version]
  );
  return rows;
}
 */

////// FONCTIONS POUR LES LIVREURS
import { listDM } from "./admin/dm.js";
import { newDM } from "./admin/dm.js";
import { editDM } from "./admin/dm.js";
import { deleteDm } from "./admin/dm.js";
/* 
//fonction qui permet d'accéder aux données des livreurs
async function listDM() {
    const [rows] = await promisePool.execute("select * from delivery_men");
    // console.log(rows);
    return rows;
  }
// fonction qui permet de créer un nouveau serveur dans la BD pizzeria, table delivery_men
async function newDM(firstname, lastname) {
    const [rows] = await promisePool.execute(
      "insert into delivery_men(firstname, lastname) values(?,?)",
      [firstname, lastname]
    );
    return rows;
  }
// permet d'éditer les livreurs en fonction de l'id qui reste fixe
async function editDM(firstname, lastname) {
  const [rows] = await promisePool.execute(
    "insert into delivery_men(firstname, lastname) values(?,?)",
    [firstname, lastname]
  );
  return rows;
}
 */

////// FONCTIONS POUR LES CLIENTS
import { listCustomers } from "./admin/customers.js";
import { listCustomerAdresses } from "./admin/customers.js";
import { listSingleCustomerAdresses } from "./admin/customers.js";
import { newCustomer } from "./admin/customers.js";
import { editCustomer } from "./admin/customers.js";
import { addAdress } from "./admin/customers.js";
import { resetCustomerPassword } from "./admin/customers.js";
import { deleteCustomer } from "./admin/customers.js";
import { deleteCustomerAdresses } from "./admin/customers.js";

////// FONCTIONS POUR LES COMMANDES
import { listOrders } from "./admin/orders.js";
import { newOrder } from "./admin/orders.js";
import { deleteOrder } from "./admin/orders.js";
import { deletePizzaOrder } from "./admin/orders.js";

//////////     PARTIE CONNECTION
//////
//////
//////
//////
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

//////////     PARTIE WEB
//////
//////
//////
//////
//démarrage du serveur
const port = 5002;
app.listen(port, () => {
  console.log(`App is runnning on port ${port}`);
});

//configuration du moteur de vue PUG
app.set("views", "./views");
app.set("view engine", "pug");
// le dossier public devient visible
app.use("/public", express.static("public"));
// permet de traiter les données d'url
app.use(express.urlencoded({ extended: true }));

////// Page d'accueil de l'administration de la pizzeria
//
app.get("/admin-app/", async (req, res) => {
  res.render("index-admin", {});
});

////// PAGES ET ACTIONS POUR LES PIZZAS
//
//
//
//
// Page de gestion des pizzas
//
app.get("/pizzas", async (req, res) => {
  // permet de récupéréer toutes les pizzas
  const allPizzas = await listPizzas();
  res.render("admin-pizzas", {
    // permet d'utiliser les plats vers la pages PUG
    pizzas: allPizzas,
  });
});

// Page de création d'une pizza
//
app.get("/createpizza", async (req, res) => {
  res.render("createpizza", {});
});

// Récupération de la requête de création d'une pizza
//
app.post("/createpizza", async (req, res) => {
  //recupération des informations de la nouvelle pizza envoyé par la méthode POST
  //const newPizzaId = req.body.id;
  const newPizzaCode = req.body.code;
  const newPizzaLabel = req.body.label;
  const newPizzaIng = req.body.ing;
  const newPizzaCat = req.body.cat;
  const newPizzaPrice = req.body.price;
  const newPizzaVersion = req.body.version;
  // Vérification en console
  console.log(req.body);
  console.log(newPizzaLabel);
  //Appel de la fonction de création de la nouvelle pizza
  const pizzaAdded = await newPizza(
    newPizzaCode,
    newPizzaLabel,
    newPizzaIng,
    newPizzaCat,
    newPizzaPrice,
    newPizzaVersion
  );
  //création affichée en console
  console.log(`Nouvelle pizza ${newPizzaLabel} créée`);
  res.redirect("/pizzas");
});

// Page édition d'une pizza
app.get("/pizzas/edit/:pizz_id", async (req, res) => {
  // Sélection du plat à modifier grâce à son id présent dans l'HTML
  const [[getPizzaToEdit]] = await promisePool.execute(
    `select * FROM pizzas where pizz_id=?`,
    [req.params.pizz_id]
  );
  // Vérification en console
  console.log(getPizzaToEdit);
  res.render("editpizza", {
    // permet d'utiliser dans pug l'objet pizza sélectionné
    pizza: getPizzaToEdit,
  });
});

// Méthode de récupération du message d'édition
app.post("/editpizza", async (req, res) => {
  const pizzaId = req.body.pizz_id;
  const pizzaCode = req.body.code;
  const pizzaLabel = req.body.label;
  const pizzaIng = req.body.ing;
  const pizzaCat = req.body.cat;
  const pizzaPrice = req.body.price;
  const pizzaVersion = req.body.version;
  console.log(req.body);
  const pizzaEdited = await editPizza(
    pizzaCode,
    pizzaLabel,
    pizzaIng,
    pizzaCat,
    pizzaPrice,
    pizzaVersion
  );
  const oldPizzaDeleted = await deletePizza(pizzaId);
  //Modification affichée en console
  console.log(`Pizza ${pizzaLabel} modifiée`);
  res.redirect("/pizzas");
});

// Méthode pour supprimer les pizzas
app.post("/pizzas/delete/:id", async (req, res) => {
  const pizz_id = req.params.id;
  console.log(pizz_id);
  const pizzaDeleted = await deletePizza(pizz_id);
  res.redirect("/pizzas");
});

////// PAGES ET ACTIONS POUR LES LIVREURS
//
//
//
//
// Page de gestion des livreurs
app.get("/livreurs", async (req, res) => {
  const allDM = await listDM();
  res.render("admin-deliverymen", {
    dMen: allDM,
  });
});

// Page d'ajout d'un nouveur livreur
app.get("/createdeliveryman", async (req, res) => {
  res.render("createdeliveryman", {});
});

// Récupération de la requête d'ajout d'un livreur
app.post("/createdeliveryman", async (req, res) => {
  //recupération des informations du nouveau livreur envoyé par la méthode POST
  const newDMfirstname = req.body.dm_firstname;
  const newDMflastname = req.body.dm_lastname;
  // Vérification en console
  console.log(req.body);
  console.log(newDMfirstname);
  //Appel de la fonction de création du nouveau livreur
  const DMAdded = await newDM(newDMfirstname, newDMflastname);
  //création affichée en console
  console.log(`Nouveau livreur ajouté ${newDMfirstname}`);
  res.redirect("/livreurs");
});

// Page édition d'un livreur
app.get("/livreurs/edit/:dm_id", async (req, res) => {
  // Sélection du livreur à modifier grâce à son id présent dans l'HTML
  const [[getDMToEdit]] = await promisePool.execute(
    `select * FROM delivery_men where dm_id=?`,
    [req.params.dm_id]
  );
  // Vérification en console
  console.log(getDMToEdit);
  res.render("editDM", {
    // permet d'utiliser dans pug l'objet livreur sélectionné
    dm: getDMToEdit,
  });
});

// Méthode de récupération du message de modification d'un livreur
app.post("/editDM", async (req, res) => {
  const DMfirstname = req.body.dm_firstname;
  const DMflastname = req.body.dm_lastname;
  console.log(req.body);
  const dmEdited = await editDM(DMfirstname, DMflastname);
  //Modification affichée en console
  console.log(`Livreur modifié ${DMfirstname}`);
  res.redirect("/livreurs");
});

// Méthode pour supprimer les livreurs
app.post("/livreurs/delete/:id", async (req, res) => {
  const dm_id = req.params.id;
  console.log(dm_id);
  const dmDeleted = await deleteDm(dm_id);
  res.redirect("/livreurs");
});

////// PAGES ET ACTIONS POUR LES CLIENTS
//
//
//
//
// Page de gestion des clients
app.get("/clients", async (req, res) => {
  const allCustomers = await listCustomers();
  //  const allAdresses = await listCustomerAdresses();
  //  console.log(await listCustomers());
  //  console.log(await listCustomerAdresses());
  res.render("admin-customers", {
    customers: allCustomers,
    //    cust_adresses: allAdresses,
  });
  //
});

// Page d'ajout d'un nouveau client
app.get("/createcustomer", async (req, res) => {
  res.render("createcustomer", {});
});

// Récupération de la requête d'ajout d'un client
app.post("/createcustomer", async (req, res) => {
  console.log(req.body);
  //recupération des informations du nouveau client envoyé par la méthode POST
  const newCustomerFirstname = req.body.firstname;
  const newCustomerLastname = req.body.lastname;
  const newCustomerAdresse = req.body.adresses;
  const newCustomerEmail = req.body.email;
  const newCustomerPassword = req.body.password;
  // Vérification en console
  // console.log(newCustomerFirstname);
  //Appel de la fonction de création du nouveau client
  const customerAdded = await newCustomer(
    newCustomerFirstname,
    newCustomerLastname,
    newCustomerAdresse,
    newCustomerEmail,
    newCustomerPassword
  );
  //création affichée en console
  // console.log(`Nouveau client ajouté ${newCustomerFirstname}`);
  res.redirect("/clients");
});

// Page édition d'un client
app.get("/customers/edit/:cus_id", async (req, res) => {
  // Sélection du client à modifier grâce à son id présent dans la requête HTML
  const [[getCustomerToEdit]] = await promisePool.execute(
    `select * FROM customers where cus_id=?`,
    [req.params.cus_id]
  );
  const [getCustomerAdressesToEdit] = await promisePool.execute(
    `select * FROM customer_adresses where cus_id=?`,
    [req.params.cus_id]
  );
  // Vérification en console
  console.log(getCustomerToEdit);
  console.log(getCustomerAdressesToEdit);

  res.render("editcustomer", {
    // permet d'utiliser dans pug l'objet client sélectionné
    customer: getCustomerToEdit,
    adresses: getCustomerAdressesToEdit,
  });
});

// Méthode de récupération du message d'édition
app.post("/editcustomer", async (req, res) => {
  console.log(req.body);
  const customerId = req.body.cus_id;
  const newcustomerFirstname = req.body.firstname;
  const newcustomerLastname = req.body.lastname;
  const newcustomerAdresses = req.body.adresses;
  const newcustomerEmail = req.body.email;
  const newcustomerPassword = req.body.password;
  // Vérification en console
  console.log(newcustomerFirstname);
  //Appel de la fonction de modification du client
  const customerAdded = await editCustomer(
    customerId,
    newcustomerFirstname,
    newcustomerLastname,
    newcustomerAdresses,
    newcustomerEmail,
    newcustomerPassword
  );
  //Modification affichée en console
  console.log(`Clients modifié ${newcustomerFirstname}`);
  res.redirect("/clients");
});

// Méthode de récupération du message d'ajout d'une adresse
app.post("/addAdress", async (req, res) => {
  console.log(req.body);
  const customerId = req.body.cus_id;
  const customerNewAdresse = req.body.newadresse;
  // Vérification en console
  //Appel de la fonction de modification du client
  const customerAdded = await addAdress(customerId, customerNewAdresse);
  //Modification affichée en console
  console.log(`Adresse ajoutée ${customerNewAdresse}`);
  res.redirect("/clients");
});

// Méthode de réinitialisation du mot de passe
app.post("/customers/reset", async (req, res) => {
  const customerPwId = req.body.cus_id;
  const customerPwPw = req.body.password;
  console.log(req.body);
  const resetPassword = await resetCustomerPassword(customerPwPw, customerPwId);
  res.redirect("/clients");
});

// Méthode pour supprimer les clients et leurs adresses
app.post("/clients/delete/:id", async (req, res) => {
  const cus_id = req.params.id;
  console.log(cus_id);
  const customerAdressesDeleted = await deleteCustomerAdresses(cus_id);
  const customerDeleted = await deleteCustomer(cus_id);
  res.redirect("/clients");
});

////// PAGES ET ACTIONS POUR LES COMMANDES
//
//
//
//
// Page de gestion des commandes
app.get("/commandes", async (req, res) => {
  const getOrders = await listOrders();
  const allOrders = [];
  for (const orders of getOrders) {
    const ord_id = orders.ord_id;
    const dm_firstname = orders.dm_firstname;
    const dm_lastname = orders.dm_lastname;
    const firstname = orders.firstname;
    const lastname = orders.lastname;
    const status = orders.status;
    const adresse = orders.adresse;
    const label = orders.label.split(", ");
    const price = orders.price.split(", ");
    // Permet de mettre pizz_qt en String. Lorsqu'il y a un seul nombre, un seul type de pizzas dans la commande, le code ne marche plus.
    let pizz_qt = orders.pizz_qt;
    if (typeof pizz_qt === "number") {
      pizz_qt = [pizz_qt.toString()];
    } else if (typeof pizz_qt === "string") {
      pizz_qt = pizz_qt.split(", ");
    } else {
      pizz_qt = [];
    }

    const prices = [];
    for (let i = 0; i < price.length; i++) {
      prices.push(price[i] * pizz_qt[i]);
    }
    const totalPrice = prices.reduce((a, b) => a + b, 0);

    const order = {
      ord_id,
      dm_firstname,
      dm_lastname,
      firstname,
      lastname,
      status,
      adresse,
      label,
      price,
      pizz_qt,
      totalPrice,
    };
    allOrders.push(order);
  }

  res.render("admin-orders", {
    orders: allOrders,
  });
});

// Page de création d'une commande
//
app.get("/createorder", async (req, res) => {
  const allPizzas = await listPizzas();
  const allDM = await listDM();
  const allCustomers = await listCustomers();
  const allAdresses = await listCustomerAdresses();
  res.render("createorder", {
    // permet d'utiliser les informations vers la pages PUG
    pizzas: allPizzas,
    dMen: allDM,
    customers: allCustomers,
    adresses: allAdresses,
  });
});

// Récupération de la requête de création d'une commande
//
app.post("/createorder", async (req, res) => {
  //recupération des informations de la nouvelle pizza envoyé par la méthode POST
  console.log(`Requete Création COmmande`, req.body);
  //const newPizzaId = req.body.id;
  const newOrderDm = req.body.dm_id;
  const newOrderCus = req.body.cus_id;
  const newOrderPizz = req.body.pizz_id;
  const newOrderQtPizz = req.body.pizz_qt;
  const newOrderSts = req.body.status;
  const newOrderAdresse = req.body.adresses;
  // Vérification en console
  console.log(`Adresse de la commande`, newOrderAdresse);
  //Appel de la fonction de création de la nouvelle pizza
  const pizzaAdded = await newOrder(
    newOrderDm,
    newOrderCus,
    newOrderPizz,
    newOrderQtPizz,
    newOrderSts,
    newOrderAdresse
  );
  res.redirect("/commandes");
});

app.get("/selectedCustomer/:id", async (req, res) => {
  console.log(req.params.id);
  const cus_id = req.params.id;
  const getAdressesOfSelectedCustomer = await listSingleCustomerAdresses(
    cus_id
  );
  res.json(getAdressesOfSelectedCustomer);
  return getAdressesOfSelectedCustomer;
});

app.post("/orders/delete/:id", async (req, res) => {
  const order_id = req.params.id;
  await deletePizzaOrder(order_id);
  await deleteOrder(order_id);
  res.redirect("/commandes");
});
