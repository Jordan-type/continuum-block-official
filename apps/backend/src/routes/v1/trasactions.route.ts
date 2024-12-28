import express, { Router } from "express";

// controller
import { listTransactions, createStripePaymentIntent, createTransaction } from "../../modules/transactions/transaction.controller";

const router: Router = express.Router();

router.get("/", listTransactions);
// router.post("/", createTransaction);
// router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;