import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import Transaction from "../modules/transactions/model"; // Adjust path to the actual model file

const seedTransactions = async () => {
  const uri = process.env.PRO_MONGO_URI  || "mongodb://localhost:27017/yourDatabaseName";

  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
        socketTimeoutMS: 30000,
        maxPoolSize: 50,
        autoIndex: false, // Don't build indexes
    });
    console.log("Connected to MongoDB");

    // Sample transaction data
    const transactions = [
      {
        userId: "user_2qRqEYUlVit2zzLYJb6pjaneln5",
        transactionId: "pi_1a2b3c4d5e6f7g8h9i0j1k2l",
        dateTime: "2024-03-01T10:30:00Z",
        courseId: "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d",
        paymentProvider: "stripe",
        amount: 4999,
      },
      {
        userId: "user_9xWp45MnKjL8vRt2Hs6BqDcEy",
        transactionId: "pi_9z8y7x6w5v4u3t2s1r0p",
        dateTime: "2024-03-05T12:00:00Z",
        courseId: "5b9f8d7c-c381-4a1c-9f8d-5d7c3b2f1d3e",
        paymentProvider: "stripe",
        amount: 3999,
      },
    ];

    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log("Cleared existing transaction data");

    // Insert new transaction data
    await Transaction.insertMany(transactions);
    console.log("Transaction data seeded successfully");

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Exit with failure code
  }
};

// Run the seed function
seedTransactions();
