import mongoose from "mongoose";
import { Request, Response } from "express";
import { getAuth } from "@clerk/express";

import CourseProgress from "./model";
import Course from "../courses/model";
import calculateOverallProgress from "../../utils/progressUtils"
import { mergeSections } from "../../utils/mergeSections"

interface LeaderboardEntry {
  userId: string;
  overallProgress: number;
  courseCount: number;
  totalPoints: number;
  totalPrize: number;
}

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
    console.log("userId", userId)
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

    console.log("get progress===>", progress)

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

    console.log("progresses==>", progresses)

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

    console.log("progressData====>", progressData)

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
// const getLearningLeaderboard = async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;
//   try {
    
//     const auth = getAuth(req);
//     if (!auth || auth.userId !== userId) {
//       res.status(403).json({ message: "Access denied" });
//       return;
//     }

//     // Count total unique users with course progress
//     let totalUsers 
//     let userPosition: number | null = null;
//     let userData: LeaderboardEntry | undefined;

//     try {
//       totalUsers = await CourseProgress.distinct("userId").countDocuments().exec();
//       console.log("totalUsers", totalUsers)
//     } catch (error) {
//       console.error("Error calculating totalUsers:", error);
//       totalUsers = 0;
//     }

//     const progressData = await CourseProgress.aggregate([
//       { $group: { 
//         _id: "$userId",                                // Group by userId 
//         overallProgress: { $avg: "$overallProgress" }, // Average overall progress across courses 
//         userCount: { $sum: 1 },                        // Count the number of courses per user 
//         totalPoints: { $sum: "$totalPoints" },         // Aggregate total points
//         totalPrize: { $sum: "$totalPrize" },           // Aggregate total prize
//         },
//       }, 
//       { $sort: { overallProgress: -1, totalPoints: -1 } }, // Sort by overallProgress (descending) and limit to top 10 and totalPoints
//       { $limit: 10 },
//       { $project: {
//           userId: "$_id",
//           overallProgress: { $round: ["$overallProgress", 2] }, // Round to 2 decimal places
//           courseCount: "$userCount",
//           totalPoints: 1,
//           totalPrize: 1,
//           _id: 0, // Exclude the _id field
//         },
//       },
//     ]).exec();

//     console.log("progressData", progressData)

//     // Optionally anonymize user data or map to user names if available (e.g., via Clerk)
//     const leaderboard: LeaderboardEntry[]  = progressData.map((entry) => ({
//       userId: entry.userId, // You might want to map this to a username or pseudonym for privacy
//       overallProgress: Math.min(entry.overallProgress, 1), // Cap at 1 (100%) to normalize
//       courseCount: entry.courseCount,
//       totalPoints: entry.totalPoints, // Default points matching UI
//       totalPrize: entry.totalPrize  // Default prize matching UI
//     }));

//     console.log("leaderboard", leaderboard)

//     // Find the specific user's position in the leaderboard (if they exist)
//     userData = leaderboard.find((entry) => entry.userId === userId);
//     console.log("userData", userData)
//     if (userData) {
//       userPosition = leaderboard.findIndex((entry) => entry.userId === userId) + 1; // 1-based rank
//     } else {
//       // If the user isn't in the top 10, fetch their progress to include them
//       const userProgress = await CourseProgress.aggregate([
//         { $match: { userId } },
//         { $group: { 
//           _id: "$userId",
//           overallProgress: { $avg: "$overallProgress" },
//           userCount: { $sum: 1 },
//           totalPoints: { $sum: "$totalPoints" },
//           totalPrize: { $sum: "$totalPrize" },
//         }},
//         { $project: {
//           userId: "$_id",
//           overallProgress: { $round: ["$overallProgress", 2] },
//           courseCount: "$userCount",
//           totalPoints: 1,
//           totalPrize: 1,
//           _id: 0,
//         }},
//       ]).exec();
    
//       if (userProgress.length > 0) {
//         const userEntry = {
//           userId,
//           overallProgress: Math.min(userProgress[0].overallProgress, 1), // Cap at 1 (100%)
//           courseCount: userProgress[0].courseCount,
//           totalPoints: userProgress[0].totalPoints || Math.min(userProgress[0].overallProgress * 100, 100) * 100,
//           totalPrize: userProgress[0].totalPrize || Math.min(userProgress[0].overallProgress * 100, 100) * 1000,
//         };
//         // Calculate the user's rank by comparing their totalPoints with the entire leaderboard (not just top 10)
//         const allProgressData = await CourseProgress.aggregate([
//           { $group: { 
//             _id: "$userId",
//             overallProgress: { $avg: "$overallProgress" },
//             userCount: { $sum: 1 },
//             totalPoints: { $sum: "$totalPoints" },
//             totalPrize: { $sum: "$totalPrize" },
//           }},
//           { $sort: { totalPoints: -1 } }, // Sort by totalPoints descending for accurate ranking
//           { $project: {
//             userId: "$_id",
//             overallProgress: { $round: ["$overallProgress", 2] },
//             courseCount: "$userCount",
//             totalPoints: 1,
//             totalPrize: 1,
//             _id: 0,
//           }},
//         ]).exec();

//         userPosition = allProgressData.findIndex((entry) => entry._id === userId) + 1 || null;
//         leaderboard.push(userEntry); // Add the user's data to the leaderboard if not in top 10
//       }
//     }


//     res.status(200).json({
//       message: "Learning leaderboard retrieved successfully",
//       // data: leaderboard,
//       totalUsers: totalUsers,
//       userPosition, // Include the user's rank (1-based) or null if not found
//       userData: userData,     // Include user's data if available
//     });
//   } catch (error) {
//     console.error("Error fetching learning leaderboard:", error);
//     res.status(500).json({
//       message: "An error occurred while fetching learning leaderboard",
//       error,
//     });
//   }
// }

const getLearningLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    const auth = getAuth(req);
    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Aggregate pipeline to get comprehensive leaderboard data
    const aggregationPipeline: mongoose.PipelineStage[] = [
      {
        $group: {
          _id: "$userId",
          overallProgress: { $avg: "$overallProgress" },
          courseCount: { $sum: 1 },
          totalPoints: { $sum: "$totalPoints" },
          totalPrize: { $sum: "$totalPrize" }
        }
      },
      {
        $project: {
          userId: "$_id",
          overallProgress: { $round: ["$avg", 2] },
          courseCount: 1,
          totalPoints: 1,
          totalPrize: 1,
          _id: 0
        }
      },
      { $sort: { totalPoints: -1, overallProgress: -1 } }
    ];


    // Get full leaderboard data
    const fullLeaderboardData = await CourseProgress.aggregate(aggregationPipeline).exec();

    // Normalize and cap progress
    const processedLeaderboard = fullLeaderboardData.map((entry, index) => ({
      ...entry,
      overallProgress: Math.min(entry.overallProgress, 1),
      rank: index + 1
    }));

    const leaderboard = processedLeaderboard.slice(0, 10) // Top 10 entries
    console.log("leaderboard", leaderboard)

    // Prepare response
    res.status(200).json({
      message: "Learning leaderboard retrieved successfully",
      data: leaderboard
    });

  } catch (error) {
    console.error("Error fetching learning leaderboard:", error);
    res.status(500).json({
      message: "An error occurred while fetching learning leaderboard",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

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
    const existingProgress = await CourseProgress.findOne({ userId, courseId }).exec();
    console.log("existingProgress", existingProgress)


    if (!existingProgress) {
      const newProgress = new CourseProgress({
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

      const saved = await newProgress.save();
      console.log("saved.....", saved)

      res.status(201).json({
        message: "User course progress created successfully",
        data: saved,
      });

      return;
    } 
      // Merge existing progress with the new data
      const mergedSections = mergeSections(existingProgress.sections, progressData.sections || []);

      // Update chapter progress with score and lock status if provided // Update sectionScore for each section
      mergedSections.forEach((section: any) => {
        const totalScore = section.chapters.reduce((sum: number, chapter: any) => sum + (chapter.score || 0), 0);
        section.sectionScore = section.chapters.length > 0 ? totalScore / section.chapters.length : 0;
      });
      
      // Calculate overall progress
      const overallProgress = calculateOverallProgress(mergedSections);
      const totalPoints = Math.min(overallProgress * 100, 100) * 10;
      const totalPrize = Math.min(overallProgress * 100, 100) * 50;
      const completionStatus = overallProgress === 1 ? "completed" : "in-progress";
      const lastActivityDate = new Date().toISOString();
      const lastAccessedTimestamp = new Date().toISOString();
      
      // Update badges if needed
      const existingBadges = existingProgress.badges.map((badge: any) => badge.name);
      const badgesToAdd: any[] = [];
      if (overallProgress >= 0.5 && !existingBadges.includes("Intermediate Learner")) {
        badgesToAdd.push({
          name: "Intermediate Learner",
          category: "Heroic",
          level: 1,
          earnedAt: new Date(),
          description: "Reached 50% completion—halfway to greatness!",
        });
      }
      
      if (overallProgress === 1 && !existingBadges.includes("Course Master")) {
        badgesToAdd.push({
          name: "Course Master",
          category: "Heroic",
          level: 3,
          earnedAt: new Date(),
          description: "Completed the course a true hero of learning!",
        });
      }
      
      // Update engagement score
      const updatedEngagementScore = (existingProgress.engagementScore || 0) + 10; // Example increment
      
      // Perform the atomic update using findByIdAndUpdate
      const updatedProgress = await CourseProgress.findByIdAndUpdate(
        existingProgress._id,
        {
          $set: {
            sections: mergedSections,
            overallProgress,
            totalPoints,
            totalPrize,
            completionStatus,
            lastActivityDate,
            lastAccessedTimestamp,
            engagementScore: updatedEngagementScore,
        },
        $push: {
          badges: { $each: badgesToAdd }, // Add new badges to the existing array
        },
      },
      { new: true, runValidators: true } // Return the updated document
    ).exec();
    
    if (!updatedProgress) {
      throw new Error("Failed to update course progress");
    }
    
    // Log the updated progress with fully expanded chapters
    console.log("updated.....", JSON.stringify(updatedProgress.sections, null, 2));


    res.status(200).json({
      message: "User course progress updated successfully",
      data: updatedProgress,
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
