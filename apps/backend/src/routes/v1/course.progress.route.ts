import express, { Router } from "express";

const router: Router = express.Router();

// controller
import { getUserEnrolledCourses } from "../../modules/course-progress/course.progress.controller"

router.get("/:userId/enrolled-courses", getUserEnrolledCourses)

export default router

