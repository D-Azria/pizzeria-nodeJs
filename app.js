import mysql from "mysql2";
import express from "express";
const app = express();

// PARTIE CONNEXION
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

//fonction qui permet d'accéder aux données des pizzas
async function listPizzas() {
  const [rows] = await promisePool.execute("select * from pizzas");
  // console.log(rows);
  return rows;
}

// fonction qui permet de créer une nouvelle pizza dans la BD pizzeria
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

// PARTIE WEB
//démarrage du serveur
const port = 5002;
app.listen(port, () => {
  console.log(`App is runnning on port ${port}`);
});

//configuration du moteur de vue PUG
app.set("views", "./views");
app.set("view engine", "pug");
// le dossier web devient visible
app.use("/public", express.static("public"));
// permet de traiter les données d'url
app.use(express.urlencoded({ extended: true }));

//Page d'accueil de l'administration de la pizzeria
app.get("/admin-app/", async (req, res) => {
  res.render("index-admin", {});
});

// Page de gestion des pizzas
app.get("/pizzas", async (req, res) => {
  const allPizzas = await listPizzas();
  res.render("admin-pizzas", {
    pizzas: allPizzas,
  });
});

// Page de création d'une pizza
app.get("/createpizza", async (req, res) => {
  // permet de récupéréer tous les plats
  //    const allDishes = await listDishes();
  res.render("createpizza", {
    // permet d'utiliser les plats vers la pages PUG
  });
});

// Récupération de la requête de création d'une pizza
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

// Page édition
app.get("/pizzas/edit/:id", async (req, res) => {
  // Sélection du plat à modifier grâce à son id présent dans l'HTML
  const [[getPizzaToEdit]] = await promisePool.execute(
    `select * FROM pizzas where id=?`,
    [req.params.id]
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
  const pizzaCode = req.body.code;
  const pizzaLabel = req.body.label;
  const pizzaIng = req.body.ing;
  const pizzaCat = req.body.cat;
  const pizzaPrice = req.body.price;
  const pizzaVersion = req.body.version + 1;
  console.log(req.body);
  const pizzaEdited = await editPizza(
    pizzaCode,
    pizzaLabel,
    pizzaIng,
    pizzaCat,
    pizzaPrice,
    pizzaVersion
  );
  //Modification affichée en console
  console.log(`Pizza ${pizzaLabel} modifiée`);
  res.redirect("/pizzas");
});
