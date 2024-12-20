import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

// controller
import { createCourse, listCourses, getCourse } from "../../modules/courses/course.controller";

const router: Router = express.Router();

router.get("/all-courses", listCourses);
router.get("/:id", getCourse);
router.post("/create", createCourse)

export default router;

