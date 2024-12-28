import mongoose, { Document, Model, Schema } from "mongoose";

const transactionSchema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "Users", required: true},
      // transactionId: { type: String, rangeKey: true, required: true, },
      dateTime: { type: String, required: true, },
      courseId: { type: Schema.Types.ObjectId, ref: "Courses", required: true, index: { name: "CourseTransactionsIndex", type: "global", }, },
      paymentProvider: { type: String, enum: ["stripe"], required: true, },
      amount: {type: Number, required: true},
    },
    {
      saveUnknown: true,
      timestamps: true,
    }
  );
  
  const Transaction = mongoose.model("Transactions", transactionSchema);
  export default Transaction;