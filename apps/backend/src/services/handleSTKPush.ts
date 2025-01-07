import axios from "axios";
import dayjs from "dayjs";
import { Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();

import { RequestExtended } from "../middlewares/generateToken";


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
    throw new Error(
      "Missing MPESA_BUSINESS_SHORT_CODE or MPESA_PASS_KEY in environment variables"
    );
  }

  const password = Buffer.from(`${businessShortCode}${passKey}${timestamp}`).toString("base64");

  return {
    timestamp,
    password,
    businessShortCode,
  };
};

const initiateSTKPush = async (req: RequestExtended, res: Response) => {
    
    const { phone, amount } = req.body;
    
    const { timestamp, password } = generateMpesaCredentials();
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    const callbackURL = "https://cdb1-41-90-64-57.ngrok-free.app/api/v1/transactions/callback";
 
    // stkPush payload
    const stkPushPayload: MpesaStkPushPayload = {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE as string || '400200',
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline", // Use 'CustomerBuyGoodsOnline' for till numbers
        Amount: amount,
        PartyA: '600980',
        PartyB: process.env.MPESA_TILL_NUMBER || '891590',
        PhoneNumber: phone,
        CallBackURL: callbackURL || 'https://cdb1-41-90-64-57.ngrok-free.app/api/v1/transactions/callback',
        AccountReference: "Continuum Block",
        TransactionDesc: "Payment",
    };
    
    try {
        const response = await axios.post(url, stkPushPayload, {
            headers: {
                Authorization: `Bearer ${req.token}`,
                'Content-Type': 'application/json',
        },
      });

    console.log(response.data);
    res.status(201).json({
      message: true,
      data: response.data,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "failed",
      error: error.message,
    });
  }
};




export {
  initiateSTKPush
}
