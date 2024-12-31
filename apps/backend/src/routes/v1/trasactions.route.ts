import express, { Router } from "express";
import { requireAuth } from "@clerk/express" 


// controller
import { listTransactions, createStripePaymentIntent, createTransaction } from "../../modules/transactions/transaction.controller";

import generateAccessToken from "../../middlewares/generateToken"
import { initiateSTKPush,  } from "../../services/handleSTKPush"

const router: Router = express.Router();

router.get("/", listTransactions);
router.post('/mpesa/stkpush', generateAccessToken, initiateSTKPush);
router.post('/callback', stkPushCallback);
// router.post("/", createTransaction);
// router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;