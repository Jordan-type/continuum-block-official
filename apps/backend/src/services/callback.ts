import { Request, Response, NextFunction} from "express";
import Transaction from "../modules/transactions/model";
import Course from "../modules/courses/model";
import CourseProgress from "../modules/course-progress/model";

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

    // Extract callback URL path (e.g., /api/v1/transactions/callback/<hash>)
    const callbackPath = req.path.split("/").pop(); // Get the hash or last segment
    if (!callbackPath) {
      return next(new Error("Invalid callback URL format"));
    }

    // Validate the callback hash (ensure it matches a stored hash in your database or config)
    // This is a simplified check; in production, query your database or use a secure store
    const storedHashes: string[] = []; // Replace with actual stored hashes from your DB or env
    if (!storedHashes.includes(callbackPath)) {
      return next(new Error("Unauthorized callback request"));
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
      const transaction = await Transaction.findOne({ CheckoutRequestID });
      if (!transaction) {
        return next(new Error("Transaction not found" ));
      }
      await handleTransactionResult(ResultCode, undefined, transaction, ResultDesc, res);
      return;
    }

    const MpesaReceiptNumber = CallbackMetadata?.Item?.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
    if (!MpesaReceiptNumber) {
      return next(new Error("MpesaReceiptNumber is missing in the callback metadata" ));
    }

    const transaction = await Transaction.findOne({ CheckoutRequestID });
    if (!transaction) {
      return next(new Error("Transaction not found" ));
    }

    // Update transaction and handle course enrollment
    await handleTransactionResult(ResultCode, MpesaReceiptNumber, transaction, ResultDesc, res);

    // Handle course enrollment and progress if transaction succeeds
    if (ResultCode === 0) {
      const course = await Course.findById(transaction.courseId);
      if (course) {
        // Add user to course enrollments
        await Course.findByIdAndUpdate(transaction.courseId, { $push: { enrollments: transaction.userId } });

        // Create initial course progress
        const initialProgress = new CourseProgress({
          userId: transaction.userId,
          courseId: transaction.courseId,
          enrollmentDate: new Date().toISOString(),
          overallProgress: 0,
          sections: course.sections.map((section: any) => ({
            sectionId: section.sectionId,
            chapters: section.chapters.map((chapter: any) => ({
              chapterId: chapter.chapterId,
              completed: false,
            })),
          })),
          lastAccessedTimestamp: new Date().toISOString(),
        });
        await initialProgress.save();
      }
    }

  } catch (error) {
    console.error("Error handling stkPushCallback:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

async function handleTransactionResult(ResultCode: number, mpesaReceiptNumber: string | undefined, transaction: any, ResultDesc: string, res: Response): Promise<Response<TransactionResponse> | void> {
  try {
    if (ResultCode === 0) {
      transaction.status = "Completed";
      transaction.resultInfo.mpesaReceiptNumber = mpesaReceiptNumber;
      transaction.resultInfo.resultMsg = ResultDesc;
      await transaction.save();

      return res.status(200).json({
        message: "Transaction successful",
        success: true,
      });
    } else {
      const status = ResultCode === 1 ? "failed (Insufficient funds)" : ResultCode === 1032 ? "failed (Canceled by user)" : "failed (Unknown error)";

      transaction.status = "Failed";
      transaction.resultInfo.resultStatus = status;
      transaction.resultInfo.resultMsg = ResultDesc;
      await transaction.save();

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
