import { pool } from "../config/database.js";

export async function getAllIngredients(req, res) {
  try {
    const result = await pool.query("SELECT * FROM ingredients ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
