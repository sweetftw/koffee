import { pool } from "../config/database.js";
import * as stockController from "./stockController.js";

export async function postOrder(req, res) {
  const order = req.body;

  const orderIds = [];
  let total = 0;

  if (!order || order.length == 0) {
    return res
      .status(400)
      .json({ error: "Minimo 1 item para efetuar o pedido" });
  }

  if (!validateOrder(order)) {
    return res.status(400).json({ error: "Objeto invalido" });
  }

  for (let index = 0; index < order.length; index++) {
    const item = order[index];

    const { success, error } = await stockController.updateStock(item);

    if (!success) return res.status(500).json({ error: error });

    orderIds.push(item.id);
    total += item.price;
  }

  return pool
    .query(
      "INSERT INTO order_recipe (ingredient_id, total) VALUES ( $1, $2);",
      [orderIds, total]
    )
    .then(() => {
      res.status(200).json({ message: "Pedido registrado com sucesso" });
    })
    .catch(() => {
      res.status(500).json({ error: "Internal server error" });
    });
}

function validateOrder(order) {
  let result = true;

  for (let i = 0; i < order.length; i++) {
    const item = order[i];

    if (!item.id || !item.ingredient || !item.price) {
      result = false;
    }
  }

  return result;
}
