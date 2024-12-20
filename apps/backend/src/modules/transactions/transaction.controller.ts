import Stripe from "stripe";
import { Request, Response } from "express";

import Course from "../courses/model";
import Transaction from "./model";
import CourseProgress from "../course-progress/model";

const listTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.query;
        const transactions = userId ? await Transaction.find({userId}).exec() : await Transaction.findOne().exec();


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