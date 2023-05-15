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

const pizzasPrice = document.getElementById("pizz_id");
const pizzasQte = document.getElementById("pizz_qt");

function clearPrice() {
    // Selection prix possiblement affichés. La longueur détermine le nombre de tour de boucle.
    let i = document.querySelectorAll(".price").length;
    console.log(`Log Price :`, i);
    while (i > 0) {
      //suppression des éléments du DOM avec la classe price
      document.querySelector(".price").remove();
      i--;
    }
  }

function calculatePriceOrder(){
    const pizzas = document.getElementsByClassName('eachPizza');
    let totalPrice = 0;
    
    // Bouble permettant de calculer le prix pour chaque type de pizzas en fonction de la quantité
    for(let i= 0; i < pizzas.length; i++){
        const pricePizza = pizzas[i].getElementsByClassName('pricePizza')[0];
        console.log(pricePizza.innerHTML);
        const numberofPizza = pizzas[i].getElementsByClassName('numberOfPizza')[0];
        console.log(numberofPizza.value);
        
        let price = parseInt(pricePizza.innerHTML);
        let quantity = parseInt(numberofPizza.value);
        totalPrice += price * quantity; 
    }
    
    // Affichage du prix total dans le DOM
    const displayPrice = document.getElementById('orderPrice');
    clearPrice();
    createMarkup("i", `${totalPrice} €`, displayPrice, [{name:"class", value:"price"}]);
}

 