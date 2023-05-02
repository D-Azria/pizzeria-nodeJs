// fonction qui permet de créer une nouvelle pizza dans la BD pizzeria table pizzas
export async function newPizza(code, label, ingredients, category, price, version) {
    const [rows] = await promisePool.execute(
      "insert into pizzas(code, label, ingredients, category, price, version) values(?,?,?,?,?,?)",
      [code, label, ingredients, category, price, version]
    );
    return rows;
  }
