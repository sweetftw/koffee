import express from "express";
import * as orderController from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", orderController.postOrder);

export { orderRouter };
