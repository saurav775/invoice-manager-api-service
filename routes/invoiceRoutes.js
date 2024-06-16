import { Router } from "express";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
  updateInvoice,
} from "../controller/invoiceController.js";

const router = Router();

router.get("/", getInvoices);
router.post("/", createInvoice);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoice);
router.put("/:id", updateInvoice);

export default router;
