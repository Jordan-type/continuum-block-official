import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

// controller
import { getUserEnrolledCourses, updateUser } from "../../modules/user/user.controller"

const router: Router = express.Router();

router.get('/:userId/enrolled-courses', getUserEnrolledCourses)
router.put("update/:userId", updateUser);

export default router;