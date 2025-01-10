import { Request, Response, NextFunction} from "express";
import Transaction from "../modules/transactions/model";

interface PaymentResult {
  status: string;
  resultInfo: {
    resultStatus?: string;
    resultCode?: string;
    resultMsg?: string;
    mpesaReceiptNumber?: string;
    CheckoutRequestID?: string;
    merchantRequestID?: string;
  };
  save: () => Promise<PaymentResult>;
}

interface TransactionResponse {
  message: string;
  success: boolean;
}

const stkPushCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { Body } = req.body;
    console.log("Mpesa Callback Body", Body);

    const { stkCallback } = Body;
    if (!stkCallback) {
      return next(new Error("Invalid callback payload" ));
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    if (ResultCode !== 0) {
      console.error("Transaction failed with ResultCode:", ResultCode);
      const Payments = await Transaction.findOne({ CheckoutRequestID });
      if (!Payments) {
        return next(new Error("Transaction not found" ));
      }
      await handleTransactionResult(ResultCode, undefined, Payments as PaymentResult, ResultDesc, res);
      return;
    }

    const MpesaReceiptNumber = CallbackMetadata?.Item?.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;

    if (!MpesaReceiptNumber) {
      return next(new Error("MpesaReceiptNumber is missing in the callback metadata" ));
    }

    const Payments = await Transaction.findOne({ CheckoutRequestID });
    if (!Payments) {
      return next(new Error("Transaction not found" ));
    }

    await handleTransactionResult(ResultCode, MpesaReceiptNumber, Payments as PaymentResult, ResultDesc, res);
  } catch (error) {
    console.error("Error handling stkPushCallback:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

async function handleTransactionResult(ResultCode: number, MpesaReceiptNumber: string | undefined, Payments: PaymentResult, ResultDesc: string, res: Response): Promise<Response<TransactionResponse> | void> {
  try {
    if (ResultCode === 0) {
      Payments.status = "Completed";
      Payments.resultInfo.mpesaReceiptNumber = MpesaReceiptNumber;
      Payments.resultInfo.resultMsg = ResultDesc;
      await Payments.save();

      return res.status(200).json({
        message: "Transaction successful",
        success: true,
      });
    } else {
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

      const statusCode = ResultCode === 1 ? 400 : 200;

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
