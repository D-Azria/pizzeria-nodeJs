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
  // Permet de joindre les 2 tableaux : clients et leurs adresses
  const [rows] = await promisePool.execute(
    "SELECT customers.cus_id, customers.firstname, customers.lastname, customers.email, customer_adresses.adresse FROM customers INNER JOIN customer_adresses ON customers.cus_id = customer_adresses.cus_id"
  );

  // merge des tableaux pour afficher une seule ligne par client
  const mergedCustomers = rows.reduce((accumulator, currentValue) => {
    // Recherche d'un client existant par son id : cus_id
    const existingCustomer = accumulator.find(
      (c) => c.cus_id === currentValue.cus_id
    );
    if (existingCustomer) {
      // Si ce client existe déjà, push de la nouvelle adresse rencontrée dans l'objet qui appartient à ce client
      existingCustomer.adresse.push(currentValue.adresse);
    } else {
      // Sinon, push des données rencontrées dans le nouveau tableau accumulator
      accumulator.push({
        cus_id: currentValue.cus_id,
        firstname: currentValue.firstname,
        lastname: currentValue.lastname,
        adresse: [currentValue.adresse],
        email: currentValue.email,
      });
    }
    // mergedCustomers renvoie l'accumulator
    return accumulator;
  }, []);

  //  console.log(mergedCustomers);
  return mergedCustomers;
}


/* 
export async function listCustomers() {
  const [rows] = await promisePool.execute("select * from customers"); 
  return rows;
}
*/

//fonction qui permet d'accéder aux adresses des clients
export async function listCustomerAdresses() {
  const [rows] = await promisePool.execute("select * from customer_adresses");
  return rows;
}

//fonction qui permet d'accéder aux adresses d'un seul client
export async function listSingleCustomerAdresses(cus_id) {
  const [rows] = await promisePool.execute("SELECT * FROM customer_adresses WHERE cus_id=?", [cus_id]);
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
  // Sel qui ajoute de la variation au cryptage
  const salt = bcrypt.genSaltSync(saltRounds);
  // Password = mot de passe hashé
  const password = bcrypt.hashSync(pwToHash, salt);
  // Insertion des informations dans la table customers
  const [rowsCustomers] = await promisePool.execute(
    "insert into customers(firstname, lastname, email, password) values(?,?,?,?)",
    [firstname, lastname, email, password]
  );
  // Récupération de l'id du client généré lors de l'insertion dans la table customers
  const [rowId] = await promisePool.execute(
    "SELECT customers.cus_id FROM customers WHERE email=?",
    [email]
  );
  let id = rowId[0].cus_id;
  console.log(id);
  // Insertion de l'adresse dans la table customer_adresses en fonction de l'id du client
  const [rowsCustomerAdresses] = await promisePool.execute(
    "insert into customer_adresses(cus_id, adresse) values(?, ?)",
    [id, adresses]
  );
  return rowsCustomers, rowsCustomerAdresses;
}

// permet d'éditer les clients en fonction de l'id qui reste fixe
export async function editCustomer(
  cus_id,
  firstname,
  lastname,
  adresses,
  email,
  pwToHash
) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(pwToHash, salt);
  const [rowCustomer] = await promisePool.execute(
    "UPDATE customers SET firstname=?, lastname=?, email=?, password=? WHERE cus_id=?",
    [firstname, lastname, email, password, cus_id]
  );

  /*
  // Récupération de l'id du client généré lors de l'insertion dans la table customers
  const [rowId] = await promisePool.execute(
    "SELECT customers.cus_id FROM customers WHERE email=?",
    [email]
  );
  let id = rowId[0].cus_id;
  console.log(id);
   */
  console.log(adresses);
  const rowCustomerAdresse = adresses;
  console.log(`New Customer Adresses`, rowCustomerAdresse);
  // Enlever les anciennes données
  await deleteCustomerAdresses(cus_id);
// Ajouter les nouvellles adresses
  for (const adresse of rowCustomerAdresse) {
    await promisePool.execute(
      "insert into customer_adresses(cus_id, adresse) values(?, ?)",
      [cus_id, adresse]
    );
  }

  /*   const [rows] = rowCustomerAdresse.forEach(async (adresse) => {
    }) */
  //  return rowCustomer, rows;
}

export async function addAdress(cus_id, adresses) {
  const [rows] = await promisePool.execute(
    "insert into customer_adresses(cus_id, adresse) values(?,?)",
    [cus_id, adresses]
  );
  return rows;
}

export async function resetCustomerPassword(pwToHash, cus_id) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(pwToHash, salt);
  const [rows] = await promisePool.execute(
    "UPDATE customers SET password=? WHERE cus_id=?",
    [password, cus_id]
  );
  console.log("password updated");
  return rows;
}

export async function deleteCustomer(cus_id) {
  const [rows] = await promisePool.execute(
    "DELETE FROM customers WHERE cus_id=?",
    [cus_id]
  );
  return rows;
}

export async function deleteCustomerAdresses(cus_id) {
  const [rows] = await promisePool.execute(
    "DELETE FROM customer_adresses WHERE cus_id=?",
    [cus_id]
  );
  return rows;
}
