import express, { json } from "express";
import cors from "cors";
import { router } from "./router.js";

const app = express();
const port = process.env.BACKEND_SERVER_PORT;

app.use(cors());
app.use(json({ limit: "10mb" }));

app.get("/hello", async (req, res) => {
  res.json({ status: "OK", message: "Hello World" });
});

// Default router
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
