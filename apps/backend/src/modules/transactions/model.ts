import mongoose, { Document, Model, Schema } from "mongoose";

const transactionSchema = new Schema(
    {
      userId: { type: String, hashKey: true, required: true, },
      dateTime: { type: String, required: true, },
      courseId: { type: Schema.Types.ObjectId, ref: "Courses", required: true, index: { name: "CourseTransactionsIndex", type: "global", }, },
      paymentProvider: { type: String, enum: ["Free", "Stripe", "M-Pesa", "PayPal"], required: true, },
      status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
      resultInfo: {
        resultStatus: { type: String, required: false },
        resultCode: { type: String, required: false },
        resultMsg: { type: String, required: false },
        mpesaReceiptNumber: { type: String, required: false },
        CheckoutRequestID: { type: String, required: false },   // For Mpesa result callback
        merchantRequestID : { type: String, required: false }, // For merchant request id to get payment status from mpesa
    },
      amount: { type: Number, required: true },
    },
    {
      saveUnknown: true,
      timestamps: true,
    }
  );
  
  const Transaction = mongoose.model("Transactions", transactionSchema);
  export default Transaction;