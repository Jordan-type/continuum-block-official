import { Request, Response } from "express";
import Transaction from "@/modules/transactions/model";

interface PaymentResult {
    status: string;
    resultInfo?: {
      MpesaReceiptNumber?: string;
      resultMsg?: string;
      resultStatus?: string;
    };
    save: () => Promise<void>;
  }
  
  interface TransactionResponse {
    message: string;
    success: boolean;
  }

const stkPushCallback = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { Body } = req.body;
    console.log("Mpesa Callback Body", Body);

    const { stkCallback } = Body;
    if (!stkCallback) {
      return res.status(400).json({ message: "Invalid callback payload" });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Check if ResultCode is not 0, indicating a failure
    if (ResultCode !== 0) {
      console.error("Transaction failed with ResultCode:", ResultCode);
      const Payments = await Transaction.findOne({ CheckoutRequestID });
      if (!Payments) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      await handleTransactionResult(ResultCode, undefined, Payments, ResultDesc, res);
      return;
    }

    // Handle successful transaction
    const MpesaReceiptNumber = CallbackMetadata?.Item?.find(
      (item: any) => item.Name === "MpesaReceiptNumber"
    )?.Value;

    if (!MpesaReceiptNumber) {
      return res.status(400).json({ message: "MpesaReceiptNumber is missing in the callback metadata" });
    }

    const Payments = await Transaction.findOne({ CheckoutRequestID });
    if (!Payments) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await handleTransactionResult(ResultCode, MpesaReceiptNumber, Payments, ResultDesc, res);
  } catch (error) {
    console.error("Error handling stkPushCallback:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};



async function handleTransactionResult(
  ResultCode: number,
  MpesaReceiptNumber: string | undefined,
  Payments: PaymentResult,
  ResultDesc: string,
  res: Response
): Promise<Response<TransactionResponse> | void> {
  try {
    if (ResultCode === 0) {
      Payments.status = "Completed";
      Payments.resultInfo.MpesaReceiptNumber = MpesaReceiptNumber;
      Payments.resultInfo.resultMsg = ResultDesc;
      await Payments.save();

      // TODO: Add further logic for successful transaction
      // - Update user wallet balance
      // - Update order status to 'Paid'
      // - Generate and upload QR code
      // - Send confirmation email or SMS

      return res.status(200).json({
        message: "Transaction successful",
        success: true,
      });
    } else {
      // Handle failed transactions
      const status =
        ResultCode === 1
          ? "failed (Insufficient funds)"
          : ResultCode === 1032
          ? "failed (Canceled by user)"
          : "failed (Unknown error)";

      Payments.status = "Failed";
      Payments.resultInfo.resultStatus = status;
      Payments.resultInfo.resultMsg = ResultDesc;
      await Payments.save();

      const statusCode = ResultCode === 1 ? 400 : 200; // Differentiate error codes

      return res.status(statusCode).json({
        message: status,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error processing transaction:", error);

    return res.status(500).json({
      message: "Internal Server Error!",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default stkPushCallback;
