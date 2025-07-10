import express from "express";
import { ingredientsRouter } from "./routes/ingredientsRoutes.js";
import { stockRouter } from "./routes/stockRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";

const router = express.Router();

router.use("/ingredients", ingredientsRouter);
router.use("/stock", stockRouter);
router.use("/order", orderRouter);

export { router };
