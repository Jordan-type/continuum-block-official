import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

const router: Router = express.Router();

// controller
import { getUserEnrolledCourses, getUserCourseProgress, updateUserCourseProgress } from "../../modules/course-progress/course.progress.controller"

router.get("/:userId/enrolled-courses", getUserEnrolledCourses)
router.get("/:userId/courses/:courseId", getUserCourseProgress)
router.put("/:userId/courses/:courseId", updateUserCourseProgress);

export default router

