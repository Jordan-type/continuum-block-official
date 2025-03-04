import mongoose from "mongoose";
import { Request, Response } from "express";
import { getAuth } from "@clerk/express";

import CourseProgress from "./model";
import Course from "../courses/model";
import calculateOverallProgress from "../../utils/progressUtils"
import { mergeSections } from "../../utils/mergeSections"

const getUserEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Verify the authenticated user
    const auth = getAuth(req);
    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Fetch enrolled courses from CourseProgress
    const enrolledProgress = await CourseProgress.find({ userId }).exec();

    if (!enrolledProgress || enrolledProgress.length === 0) {
      res.status(404).json({
        message: "No enrolled courses found",
      });
      return;
    }

    // Extract courseIds from enrolledCourses  // Fetch course details using the courseIds
    const courseIds = enrolledProgress.map((progress: any) => progress.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).exec();

    res.status(200).json({
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({
      message: "An error occurred while fetching enrolled courses",
      error,
    });
  }
};

const getUserCourseProgress = async (req: Request, res: Response): Promise<void> => {
    const { userId, courseId } = req.params;
    console.log("courseId", courseId)
  try {
    // Verify the authenticated user
    const auth = getAuth(req);
    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Fetch course progress for the given userId and courseId
    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      res.status(404).json({ message: "Course progress not found for this user" });
      return;
    }

    console.log("progress", progress)

    res.status(200).json({
      message: "Course progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    console.log("<<<====Error fetching user course progress====>>>:", error);
    res.status(500).json({
      message: "An error occurred while fetching user course progress",
      error,
    });
  }
};


const getUserCourseProgressBatch = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { courseIds } = req.body; // Expect an array of 
  
  console.log("courseIds", courseIds)

  try {
    const auth = getAuth(req);
    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    if (!courseIds || !Array.isArray(courseIds)) {
      res.status(400).json({ message: "courseIds must be a non-empty array" });
      return;
    }

    const progresses = await CourseProgress.find({
      userId,
      courseId: { $in: courseIds.map(id => new mongoose.Types.ObjectId(id)) },
    }).exec();

    console.log("progresses", progresses)

    if (!progresses || progresses.length === 0) {
      res.status(404).json({ message: "No course progress found for this user" });
      return;
    }

    const progressData = progresses.map(progress => ({
      courseId: progress.courseId.toString(),
      overallProgress: progress.overallProgress,
      enrollmentDate: progress.enrollmentDate,
      lastAccessedTimestamp: progress.lastAccessedTimestamp,
      sections: progress.sections,
      totalPoints: progress.totalPoints || Math.min(progress.overallProgress * 100, 100) * 10, // Default calculation
      totalPrize: progress.totalPrize || Math.min(progress.overallProgress * 100, 100) * 50, // Default calculation
      lastActivityDate: progress.lastActivityDate,
      completionStatus: progress.completionStatus,
      badges: progress.badges,
      engagementScore: progress.engagementScore,
    }));

    console.log("progressData", progressData)

    res.status(200).json({
      message: "Course progresses retrieved successfully",
      data: progressData,
    });
  } catch (error) {
    console.error("Error fetching batch course progress:", error);
    res.status(500).json({
      message: "An error occurred while fetching batch course progress",
      error,
    });
  }
};


// Todo: Add learning leaderBoard
const getLearningLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    if (!auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Count total unique users with course progress
    const totalUsers = await CourseProgress.distinct("userId").countDocuments().exec();

    const progressData = await CourseProgress.aggregate([
      { $group: { 
        _id: "$userId",                                // Group by userId 
        overallProgress: { $avg: "$overallProgress" }, // Average overall progress across courses 
        userCount: { $sum: 1 },                        // Count the number of courses per user 
        totalPoints: { $sum: "$totalPoints" },         // Aggregate total points
        totalPrize: { $sum: "$totalPrize" },           // Aggregate total prize
        },
      }, 
      { $sort: { overallProgress: -1, totalPoints: -1 } }, // Sort by overallProgress (descending) and limit to top 10 and totalPoints
      { $limit: 10 },
      { $project: {
          userId: "$_id",
          overallProgress: { $round: ["$overallProgress", 2] }, // Round to 2 decimal places
          courseCount: "$userCount",
          totalPoints: 1,
          totalPrize: 1,
          _id: 0, // Exclude the _id field
        },
      },
    ]).exec();

    console.log("progressData", progressData)

    // Optionally anonymize user data or map to user names if available (e.g., via Clerk)
    const leaderboard = progressData.map((entry) => ({
      userId: entry.userId, // You might want to map this to a username or pseudonym for privacy
      overallProgress: entry.overallProgress,
      courseCount: entry.courseCount,
      totalPoints: entry.totalPoints || Math.min(entry.overallProgress * 100, 100) * 100, // Default points matching UI
      totalPrize: entry.totalPrize || Math.min(entry.overallProgress * 100, 100) * 1000,  // Default prize matching UI
    }));

    console.log("leaderboard", leaderboard)
    console.log("totalUsers", totalUsers)

    res.status(200).json({
      message: "Learning leaderboard retrieved successfully",
      data: leaderboard,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching learning leaderboard:", error);
    res.status(500).json({
      message: "An error occurred while fetching learning leaderboard",
      error,
    });
  }
}

// Get course-specific leaderboard (optional, if you want to rank by a specific course)
const getCourseLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  try {
    const auth = getAuth(req);
    if (!auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const progressData = await CourseProgress.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) }, }, // Filter by courseId
      { $group: { _id: "$userId", overallProgress: { $max: "$overallProgress" }, }, }, // Use max progress for the course
      { $sort: { overallProgress: -1 }, },
      { $limit: 10, },// Top 10 users for this course
      { $project: { userId: "$_id", overallProgress: { $round: ["$overallProgress", 2] },_id: 0, }, },
    ]).exec();

    const leaderboard = progressData.map((entry) => ({
      userId: entry.userId, // Map to username or pseudonym if needed
      overallProgress: entry.overallProgress,
    }));

    res.status(200).json({
      message: "Course-specific leaderboard retrieved successfully",
      data: leaderboard,
    });
  } catch (error) {
    console.error("Error fetching course leaderboard:", error);
    res.status(500).json({
      message: "An error occurred while fetching course leaderboard",
      error,
    });
  }
}

const updateUserCourseProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const progressData = req.body;

    // Verify the authenticated user
    const auth = getAuth(req);
    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Fetch existing progress or create a new one
    let progress = await CourseProgress.findOne({ userId, courseId }).exec();
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
        totalPoints: 0,
        totalPrize: 0,
        lastActivityDate: new Date().toISOString(),
        completionStatus: "in-progress",
        badges: [],
        engagementScore: 0,
      });
    } else {
      // Merge existing progress with the new data
      progress.sections = mergeSections(progress.sections, progressData.sections || []);
      progress.lastAccessedTimestamp = new Date().toISOString();
      progress.overallProgress = calculateOverallProgress(progress.sections);
      progress.totalPoints = Math.min(progress.overallProgress * 100, 100) * 10; // Update points
      progress.totalPrize = Math.min(progress.overallProgress * 100, 100) * 50; // Update prize
      progress.completionStatus = progress.overallProgress === 1 ? "completed" : "in-progress";
      // Update badges based on progress (e.g., 50%, 100%)
      if (progress.overallProgress >= 0.5 && !progress.badges.includes("intermediate")) {
        progress.badges.push("intermediate");
      }
      if (progress.overallProgress === 1 && !progress.badges.includes("advanced")) {
        progress.badges.push("advanced");
      }
      // Update engagementScore (example: increment based on activity)
      progress.engagementScore += 10; // Example increment; adjust based on logic
    }

    // Save the updated progress
    await progress.save();

    res.status(200).json({
      message: "User course progress updated successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error updating user course progress:", error);
    res.status(500).json({
      message: "Error updating user course progress",
      error,
    });
  }
};


export {
  getUserEnrolledCourses,
  getUserCourseProgress,
  getUserCourseProgressBatch,
  getLearningLeaderboard,
  getCourseLeaderboard,
  updateUserCourseProgress,
};
