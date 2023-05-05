/**
 * Crée un élément du dom, lui ajoute du texte, le place comme dernier
 * enfant de parent et ajoute un attribut en utilisant le paramètre attribute
 * @param {String} markup_name
 * @param {String} text
 * @param {domElement} parent
 * @param {Array} attributes  (doit comprendre les propriétés name et value)
 * @returns domElement
 */
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


  
  
  
  const buttonAddAdress = document.querySelector("#addAdress");
  
  buttonAddAdress.onclick() = async function (event) {
    event.preventDefault(); 
    const newTr = createMarkup("tr","", document.querySelector("#adresse"));
    const newTd = createMarkup("td", "", newTr);
    const newLabel = createMarkup("label","", newTd);
    const newInput = createMarkup("input","", newTd);
}
  