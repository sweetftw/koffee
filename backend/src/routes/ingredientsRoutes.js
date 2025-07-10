import express from "express";
import * as ingredientsController from "../controller/ingredientsController.js";

const ingredientsRouter = express.Router();

ingredientsRouter.get("/", ingredientsController.getAllIngredients);

export { ingredientsRouter };
