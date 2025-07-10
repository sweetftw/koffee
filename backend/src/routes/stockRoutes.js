import express from "express";
import * as stockController from "../controller/stockController.js";

const stockRouter = express.Router();

stockRouter.get("/:id", stockController.getStock);

export { stockRouter };
