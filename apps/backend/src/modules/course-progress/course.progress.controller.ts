import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

import CourseProgress from "./model";
import Course from "../courses/model";



const getUserEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const auth = getAuth(req);

        // verify the authenticated user
        if (!auth || auth.userId !== userId) {
            res.status(403).json({ 
                message: "Access denied" 
            });
            return;
        }

        // fetch enrolled courses by userId
        const enrolledCourses = await CourseProgress.find({ userId }).exec();

        if (!enrolledCourses || enrolledCourses.length === 0) {
          res.status(404).json({
            message: "No enrolled courses found",
          });
          return;
        }

        // extract courseIds from the enrolledCourses documents
        const courseIds = enrolledCourses.map((item) => item.courseId);
        
        // fetch course details for the courseIds
        const courses = await Course.find({
            _id: { $in: courseIds.map((id) => new mongoose.Types.ObjectId(id)) },
        }).exec();
  
      res.status(200).json({
        message: "Enrolled courses retrieved successfully",
        data: courses,
      });
    } catch (error) {
        console.log("Error fetching enrolled courses:", error);
        res.status(500).json({
            message: "An error occurred while fetching enrolled courses",
            error: error,
        });
    }
}


const getUserCourseProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, courseId } = req.params;

    } catch (error) {

    }
}


export {
    getUserEnrolledCourses,

}