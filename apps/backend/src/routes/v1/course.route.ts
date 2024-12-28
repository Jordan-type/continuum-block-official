import express, { Router } from "express";
import { requireAuth } from "@clerk/express";
import multer from "multer";

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// controller
import { createCourse, listCourses, getCourse, updateCourse, deleteCourse, getUploadVideoUrl } from "../../modules/courses/course.controller";

router.post("/create", requireAuth(), createCourse)
router.get("/all-courses", listCourses);
router.get("/:courseId", getCourse);
router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);
router.delete("/:courseId", requireAuth(), deleteCourse);
router.post("/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url", requireAuth(), getUploadVideoUrl);

export default router;
