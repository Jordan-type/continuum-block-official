import express, { Router } from "express";
import { requireAuth } from "@clerk/express" 

// controller createStripePaymentIntent, createTransaction
import { listTransactions, createTransaction } from "../../modules/transactions/transaction.controller";

import generateAccessToken from "../../middlewares/generateToken"
import { initiateSTKPush  } from "../../services/handleSTKPush"
import stkPushCallback from "../../services/callback"

const router: Router = express.Router();

router.post("/", requireAuth(), createTransaction);
router.get("/", requireAuth(), listTransactions);
router.post('/mpesa/stkpush', generateAccessToken, initiateSTKPush);
router.post('/callback', stkPushCallback);

// router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;