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
      });
    } else {
      // Merge existing progress with the new data
      progress.sections = mergeSections(progress.sections, progressData.sections || []);
      progress.lastAccessedTimestamp = new Date().toISOString();
      progress.overallProgress = calculateOverallProgress(progress.sections);
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
  updateUserCourseProgress,
};
