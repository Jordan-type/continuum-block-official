import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

const router: Router = express.Router();

// controller
import { imageMulter, videoMulter  } from "../../utils/fileUploader";
import { createCourse, listCourses, listCoursesByIds, getCourse, updateCourse, getUploadVideoUrl, deleteCourse } from "../../modules/courses/course.controller";

router.post("/create", requireAuth(), createCourse)
router.get("/all-courses", listCourses);
router.post("/by-ids", listCoursesByIds);
router.get("/:courseId", getCourse);
router.put("/update/:courseId", requireAuth(), imageMulter, updateCourse); // imageMulter,
router.post("/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url", requireAuth(), videoMulter,  getUploadVideoUrl);
router.delete("/delete/:courseId", requireAuth(), deleteCourse);

export default router;              