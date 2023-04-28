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

//fonction : permet d'accéder aux données à volonté
async function listPizzas() {
    const [rows] = await promisePool.execute("select * from pizzas");
    // console.log(rows);
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

//Page de la liste
app.get("/admin-app/", async (req, res) => {
    res.render("index-admin", {
      
    });
  });

app.get("/pizzas", async (req, res) => {
    const allPizzas = await listPizzas();
    res.render("admin-pizzas", {
        pizzas: allPizzas,
    });
  });

