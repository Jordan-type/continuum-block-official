import mongoose from "mongoose";
import * as dotenv from "dotenv";

import Course from "../modules/courses/model"; // MongoDB Course Model
import Transaction from "../modules/transactions/model"; // MongoDB Transaction Model
import CourseProgress from "../modules/course-progress/model"; // MongoDB Course Progress Model

dotenv.config();

const seedCourses = async () => {
  const courses = [
    {
      courseId: "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d",
      teacherId: "user_7kFh92JkCpQw3N8M5L4xRzVtYs",
      teacherName: "John Doe",
      title: "Introduction to Programming",
      description: "Learn the basics of programming with this comprehensive course.",
      category: "Computer Science",
      image: "https://images.pexels.com/photos/5905888/pexels-photo-5905888.jpeg",
      price: 4999,
      level: "Beginner",
      status: "Published",
      enrollments: [
        { userId: "user_2qRqEYUlVit2zzLYJb6pjaneln5" },
        { userId: "user_2ntu96pUCljUV2T9W0AThzjacQB" },
        { userId: "user_9xWp45MnKjL8vRt2Hs6BqDcEy" },
      ],
      sections: [
        {
          sectionId: "2f9d1e8b-5a3c-4b7f-9e6d-8c2a1f0b3d5e",
          sectionTitle: "Getting Started",
          sectionDescription: "Learn the basics of programming and set up your development environment.",
          chapters: [
            {
              chapterId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
              type: "Video",
              title: "Welcome to Programming",
              content: "https://example.com/videos/welcome.mp4",
            },
          ],
        },
      ],
    },
  ];

  await Course.deleteMany({});
  console.log("Cleared existing course data");
  await Course.insertMany(courses);
  console.log("MongoDB: Course data seeded successfully");
};

const seedTransactions = async () => {
  const transactions = [
    {
      userId: "user_2qRqEYUlVit2zzLYJb6pjaneln5",
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
  const courseProgressData = [
    {
      userId: "user_2qRqEYUlVit2zzLYJb6pjaneln5",
      courseId: "3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d",
      enrollmentDate: "2023-03-01T09:00:00Z",
      overallProgress: 0.75,
      sections: [
        {
          sectionId: "2f9d1e8b-5a3c-4b7f-9e6d-8c2a1f0b3d5e",
          chapters: [
            { chapterId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6", completed: true },
          ],
        },
      ],
      lastAccessedTimestamp: "2023-03-10T14:30:00Z",
    },
  ];

  await CourseProgress.deleteMany({});
  console.log("Cleared existing course progress data");
  await CourseProgress.insertMany(courseProgressData);
  console.log("MongoDB: Course progress data seeded successfully");
};

export default async function seed() {
  const uri = process.env.PRO_MONGO_URI || "mongodb://localhost:27017/yourDatabaseName";

  try {
    await mongoose.connect(uri, {
      socketTimeoutMS: 30000,
      maxPoolSize: 50,
      autoIndex: false,
    });
    console.log("Connected to MongoDB");

    await Promise.all([seedCourses(), seedTransactions(), seedCourseProgress()]);
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
