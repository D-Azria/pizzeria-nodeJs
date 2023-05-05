function createMarkup(markup_name, text, parent, attributes = []) {
  const markup = document.createElement(markup_name);
  markup.textContent = text;
  parent.appendChild(markup);
  attributes.forEach((attribute) => {
    if (
      attribute &&
      attribute.hasOwnProperty("name") &&
      attribute.hasOwnProperty("value")
    ) {
      markup.setAttribute(attribute.name, attribute.value);
    }
  });
  return markup;
}

function clearAdresses() {
    // Selection des options d'adresses. La longueur détermine le nombre de tour de boucle.
    let i = document.querySelectorAll(".adressesoptions").length;
    while (i > 0) {
      //suppression des éléments du DOM avec la classe adressesoptions
      document.querySelector(".adressesoptions").remove();
      i--;
    }
  }

function clearPizza() {
    // Selection des options d'adresses. La longueur détermine le nombre de tour de boucle.
    let td
    let i = document.querySelectorAll(".morepizza").length;
    while (i > 0) {
      //suppression des éléments du DOM avec la classe morepizza
      document.querySelector(".morepizza").remove();
      i--;
    }
  }


const selectCustomer = document.getElementById("cus_id");
const optionsAdresses = document.getElementById("adresses");
selectCustomer.onchange = async function (event) {
  event.preventDefault();
  let c_id = selectCustomer.value;
  console.log(`Tiptop`);
  console.log(c_id);
  await clearAdresses();
  fetch(`/selectedCustomer/${c_id}`, { method: "GET" })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Le serveur ne répond pas !");
        //récupération des départements sous forme d'un object json
      } else {
        console.log(response.json);
        return response.json();
      }
    })
    .then((adresses) => {
      adresses.forEach((adresse) => {
        //        console.log(optionsAdresses);
        console.log(adresse);
        createMarkup("option", `${adresse.adresse}`, optionsAdresses, [
          { name: "id", value: `${adresse.cus_id}` },
          { name: "value", value: `${adresse.cus_id}` },
          { name: "class", value: "adressesoptions"},
        ]);
      });
    })
    .catch((error) => console.log(`Erreur catched :`, error));
};

const addPizzaButton = document.getElementById("addPizzaButton");
const divAddPizza = document.getElementById("divAddPizza");

addPizzaButton.onclick = async function (event) {
    event.preventDefault();
    console.log(`Tiptop`);
    console.log(addPizzaButton.value);
    const trAddPizza = createMarkup ("tr","", divAddPizza, [
        {name:"class", value:"morepizzatr"},
    ])
    const tdlabel = createMarkup ("td","Pizzas :", trAddPizza, [
        {name:"class", value:"morepizzatdl"},
    ])
    const labelPiz = createMarkup ("label", "", tdlabel, [
        {name:"class", value:"morepizzalblp"},
    ]);
    const tdselect = createMarkup ("td", "", trAddPizza, [
        {name:"class", value:"morepizzatds"},
    ])
    const selectAddPizza = createMarkup("select", "", tdselect, [
        {name:"class", value:"morepizzasl"},
    ]);
    const labelQté = createMarkup ("label", "Quantité :", tdselect, [
        {name:"class", value:"morepizzalbq"},
    ]);
    const input = createMarkup ("input", "", tdselect, [
        {name:"class", value:"morepizzainp"},
        {name:"type", value:"number"},
        {name:"value", value:"1"},
    ]);
    const buttonRemovePizza = createMarkup ("button", "Enlever la pizza", tdselect, [
        {name:"class", value:"morepizzabtn"},
        {name:"type", value:"button"},
        {name:"id", value:"removePizzaButton"},
    ]);
    fetch(`/addpizza`, { method: "GET" })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Le serveur ne répond pas !");
          //récupération des départements sous forme d'un object json
        } else {
          console.log(response.json);
          return response.json();
        }
      })
      .then((pizzas) => {
        pizzas.forEach((pizza) => {
          //        console.log(optionsAdresses);
          console.log(pizza);

          createMarkup("option", `${pizza.label} ${pizza.price} €`, selectAddPizza, [
            { name: "id", value: `${pizza.pizz_id}` },
            { name: "value", value: `${pizza.pizz_id}` },
          ]);
        });
      })
      .catch((error) => console.log(`Erreur catched :`, error));
  };

  const removePizzaButton = document.getElementById("removePizzaButton");
  removePizzaButton.onclick = async function (event) {
    event.preventDefault();
    console.log('boum');

  }