import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import Course from "../modules/courses/model"; // MongoDB Course Model
import Transaction from "../modules/transactions/model"; // MongoDB Transaction Model
import CourseProgress from "../modules/course-progress/model"; // MongoDB Course Progress Model

dotenv.config();

const seedCourses = async () => {
  // Read the course.json file CourseProgress.json
  const filePath = path.join(__dirname, './data/courses.json');
  const courseData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Clear existing courses
  await Course.deleteMany({});
  console.log('Cleared existing course data');

  // Insert courses from JSON
  await Course.insertMany(courseData);
  console.log('MongoDB: Course data seeded successfully');
};

const seedTransactions = async () => {
  const transactions = [
    {
      userId: "user_2qbunL2tYeX2SfviA2fbt4Vq2Vd",
      transactionId: "pi_1a2b3c4d5e6f7g8h9i0j1k2l",
      dateTime: "2024-03-01T10:30:00Z",
      courseId: "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d",
      paymentProvider: "stripe",
      amount: 4999,
    },
  ];

  await Transaction.deleteMany({});
  console.log("Cleared existing transaction data");
  await Transaction.insertMany(transactions);
  console.log("MongoDB: Transaction data seeded successfully");
};

const seedCourseProgress = async () => {
  const filePath = path.join(__dirname, './data/CourseProgress.json');
  const courseProgressData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  await CourseProgress.deleteMany({});
  console.log("Cleared existing course progress data");
  await CourseProgress.insertMany(courseProgressData);
  console.log("MongoDB: Course progress data seeded successfully");
};

export default async function seed() {
  const uri = process.env.DEV_MONGO_URI || "mongodb://localhost:27017/continuum-block";

  try {
    await mongoose.connect(uri, {
      socketTimeoutMS: 30000,
      maxPoolSize: 50,
      autoIndex: false,
    });
    console.log("Connected to MongoDB");

    await Promise.all([seedCourseProgress(), ]); // seedCourseProgress(),
    console.log("MongoDB: All data seeded successfully");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1); // Exit with failure code
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script:", error);
  });
}
