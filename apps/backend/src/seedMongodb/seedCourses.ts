import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import CourseModel from "../modules/courses/model"; // Replace with the correct path to your Course model

const seedCourses = async () => {
  const uri = process.env.PRO_MONGO_URI || "mongodb://localhost:27017/yourDatabaseName";

  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
        socketTimeoutMS: 30000,
        maxPoolSize: 50,
        autoIndex: false, // Don't build indexes
    });
    console.log("Connected to MongoDB");

    // Sample course data
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
          { userId: "user_2qRqEYUlVit2zzLYJb6pjaneln5"},
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
      // Add more courses as needed
    ];

    // Clear existing data
    await CourseModel.deleteMany({});
    console.log("Cleared existing course data");

    // Insert new data
    await CourseModel.insertMany(courses);
    console.log("Seed data inserted successfully");

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Exit with failure code
  }
};

// Run the seed function
seedCourses();
