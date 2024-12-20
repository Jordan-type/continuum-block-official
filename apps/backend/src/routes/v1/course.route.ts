import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

const router: Router = express.Router();

// controller
import { createCourse, listCourses, getCourse } from "../../modules/courses/course.controller";

router.get("/all-courses", listCourses);
router.get("/:id", getCourse);
router.post("/create", createCourse)

export default router;

