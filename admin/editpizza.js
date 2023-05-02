   // permet d'éditer les pizzas en fonction de l'id qui reste fixe
  export async function editPizza(code, label, ingredients, category, price, version) {
    const [rows] = await promisePool.execute(
      "insert into pizzas(code, label, ingredients, category, price, version) values(?,?,?,?,?,?)",
      [code, label, ingredients, category, price, version]
    );
    return rows;
  }