import { Response } from "express";
import * as dotenv from 'dotenv';
import axios from "axios";
import crypto from "crypto"; // For generating a unique hash for each transaction

dotenv.config();

import { RequestExtended } from "../middlewares/generateToken";
import Transaction from "../modules/transactions/model";
import { convertUsdToKes } from "../utils/currency";

type MpesaCredentials = {
  timestamp: string;
  password: string;
  businessShortCode: string;
};

type MpesaStkPushPayload = {
    BusinessShortCode: string;
    Password: string;
    Timestamp: string;
    TransactionType: string;
    Amount: number;
    PartyA: string;
    PartyB: string;
    PhoneNumber: string;
    CallBackURL: string;
    AccountReference: string;
    TransactionDesc: string;
  };
  
  type MpesaStkPushResponse = {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };

const generateMpesaCredentials = (): MpesaCredentials => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);

  const businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE || "";
  const passKey = process.env.MPESA_PASS_KEY || "";

  if (!businessShortCode || !passKey) {
    throw new Error("Missing MPESA_BUSINESS_SHORT_CODE or MPESA_PASS_KEY in environment variables");
  }

  const password = Buffer.from(`${businessShortCode}${passKey}${timestamp}`).toString("base64");

  return {
    timestamp,
    password,
    businessShortCode,
  };
};

const initiateSTKPush = async (req: RequestExtended, res: Response): Promise<void> => { 
    const { phone, amount, courseId, userId } = req.body;

    // Validate inputs
    if (!phone || !amount || !courseId || !userId) {
      res.status(400).json({
        message: "Missing required fields (phone, amount, courseId, userId)",
      });
    }
    
    // Validate phone number (Kenyan format, e.g., +2547XXXXXXXX or 2547XXXXXXXX)
    const phoneRegex = /^(\+254|254)?7\d{8}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({
        message: "Invalid Kenyan phone number format. Use +2547XXXXXXXX or 2547XXXXXXXX",
      });
   }
   
   // Validate amount (minimum KES 1 for M-Pesa)
   if (amount < 1) {
    res.status(400).json({
      message: "Amount must be at least KES 1",
    });
  }


  try {
    // Convert USD amount to KES
    const kshAmount = await convertUsdToKes(amount);
    console.log(`Converting ${amount} USD to KES: ${kshAmount} KES`)
    
    // 1. Generate a unique hash for the callback URL to secure it
    const callbackHash = crypto.randomBytes(20).toString("hex");
    const baseCallbackURL = "https://continuum-block-official.onrender.com/api/v1/transactions/callback";
    const callbackURL = `${baseCallbackURL}/${callbackHash}`;
    
    // 2. Create a pending transaction record
    const newTransaction = new Transaction({
      userId,
      courseId,
      dateTime: new Date().toISOString(),
      transactionId: `mpesa_${Date.now()}`,
      amount,
      paymentProvider: "M-Pesa",
      status: "Pending",
      resultInfo: {},
    });
    
    await newTransaction.save();
    
    // 3. Generate M-Pesa credentials
    const { timestamp, password } = generateMpesaCredentials();
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    // 4.STKPush payload
    const stkPushPayload: MpesaStkPushPayload = {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE as string || '400200',
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline", // Use 'CustomerBuyGoodsOnline' for till numbers
        Amount: kshAmount,
        PartyA: phone, // Use the phone number as PartyA
        PartyB: process.env.MPESA_TILL_NUMBER || '891590',
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: "Continuum Block",
        TransactionDesc: "Payment for course",
    };

    // 5. Send STKPush request to M-Pesa API
    const response = await axios.post<MpesaStkPushResponse>(url, stkPushPayload, {
      headers: {
        Authorization: `Bearer ${req.token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // Set a 30-second timeout to handle network issues
    });

    // 6. Update transaction with M-Pesa response
    newTransaction.resultInfo = {
      CheckoutRequestID: response.data.CheckoutRequestID,
      merchantRequestID: response.data.MerchantRequestID
    }
    await newTransaction.save();

    console.log("M-Pesa STK Push Response:", response.data);
    res.status(201).json({
      message: "M-Pesa STK Push initiated successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error initiating M-Pesa STK Push:", error);
    let statusCode = 500;
    let errorMessage = "Failed to initiate M-Pesa STK Push";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        statusCode = error.response.status || 500;
        errorMessage = error.response.data?.ResponseDescription || error.message;
      } else if (error.request) {
        errorMessage = "Network error: No response from M-Pesa API";
      } else {
        errorMessage = error.message;
      }
    }

    res.status(statusCode).json({
      message: errorMessage,
      error: error.message,
    });
  }
};


export {
  initiateSTKPush
}
