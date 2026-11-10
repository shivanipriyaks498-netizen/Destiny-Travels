
import express from "express";

import {
  createDestination,
  insertMultipleDestinations,
  getAllDestinations,
  getDestinationById,
  getDestinationByName,
  updateDestinationById,
  updateDestinationByName,
  discoverDestinations,
  getDestinationCategories,
  countDestinations,
  deleteDestinationById,
  deleteDestinationByName,
  deleteMultipleDestinations
} from "../controllers/destinyController.js";

const router = express.Router();

// CHALLENGE 01: ADD
router.post("/", createDestination);
router.post("/bulk", insertMultipleDestinations);

// CHALLENGE 02: RETRIEVE
router.get("/", getAllDestinations);
router.get("/discover", discoverDestinations);
router.get("/categories", getDestinationCategories);
router.get("/count", countDestinations);
router.get("/id/:id", getDestinationById);
router.get("/name/:name", getDestinationByName);

// CHALLENGE 03: UPDATE
router.put("/id/:id", updateDestinationById);
router.put("/name/:name", updateDestinationByName);

// CHALLENGE 05: DELETE
router.delete("/id/:id", deleteDestinationById);
router.delete("/name/:name", deleteDestinationByName);
router.delete("/cleanup", deleteMultipleDestinations);

export default router;
