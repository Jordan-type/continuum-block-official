import express, { Router } from "express";
import { requireAuth } from "@clerk/express";
import multer from "multer";

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// controller
import { imageMulter, videoMulter  } from "../../utils/fileUploader";
import { createCourse, listCourses, getCourse, updateCourseImage, updateCourse, getUploadVideoUrl, deleteCourse } from "../../modules/courses/course.controller";

router.post("/create", requireAuth(), createCourse)
router.get("/all-courses", listCourses);
router.get("/:courseId", getCourse);
router.put("/update-image/:courseId", imageMulter, updateCourseImage);
router.put("/update/:courseId", requireAuth(), updateCourse); // imageMulter,
router.post("/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",  videoMulter,  getUploadVideoUrl);
router.delete("/delete/:courseId", requireAuth(), deleteCourse);

export default router;              