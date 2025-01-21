import Stripe from "stripe";
import { Request, Response } from "express";

import Course from "../courses/model";
import Transaction from "./model";
import CourseProgress from "../course-progress/model";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error(
//     "STRIPE_SECRET_KEY os required but was not found in env variables"
//   );
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const listTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.query;
        const transactions = userId ? await Transaction.find({userId}): await Transaction.find();


        res.json({
            message: "Transactions retrieved successfully",
            data: transactions,
          });
    } catch (error){
        res.status(500).json({ 
            message: "Error retrieving transactions", 
            error 
        });
    }
}

// const createStripePaymentIntent = async (req: Request, res: Response ): Promise<void> => {
//   try {
//     let { amount } = req.body;

//     if (!amount || amount <= 0) {
//         amount = 50;
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       automatic_payment_methods: {
//         enabled: true,
//         allow_redirects: "never",
//       },
//     });

//     res.json({
//       message: "",
//       data: {
//         clientSecret: paymentIntent.client_secret,
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error creating stripe payment intent", error });
//   }
// };

const createTransaction = async (req: Request, res: Response): Promise<void> => {
  const { userId, courseId, transactionId, amount, paymentProvider } = req.body;

  try {
    // 1. get course info
    const course = await Course.findOne(courseId);

    if (!course) {
      res.status(404).json({ 
        message: "Course not found" 
      });
      return;
    }

    // 2. create transaction record
    const newTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });
    await newTransaction.save();

    // 3. create initial course progress
    const initialProgress = new CourseProgress({
      userId,
      courseId,
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

    // 4. add enrollment to relevant course
    await Course.updateOne( { courseId }, { $ADD: { enrollments: [{ userId }], }, });

    res.json({
      message: "Purchased Course successfully",
      data: {
        transaction: newTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating transaction and enrollment",
      error,
    });
  }
};

export {
    listTransactions,
    // createStripePaymentIntent,
    // createTransaction
}