import { pool } from "../config/database.js";

export async function getStock(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT amount FROM stock WHERE ingredient_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateStock(item) {
  const stockResult = await pool.query(
    "SELECT amount from stock where ingredient_id = $1;",
    [item.id]
  );

  if (stockResult.rows[0].amount == 0) {
    return {
      success: false,
      error: `Sem estoque para o item: ${item.ingredient}`,
    };
  }

  await pool.query("UPDATE stock SET amount = $2 WHERE ingredient_id = $1;", [
    item.id,
    stockResult.rows[0].amount - 1,
  ]);

  return { success: true, error: null };
}
