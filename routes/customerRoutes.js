import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controller/customerController.js";

const router = Router();

router.get("/", getCustomers);
router.post("/", createCustomer);
router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);
router.put("/:id", updateCustomer);

export default router;
