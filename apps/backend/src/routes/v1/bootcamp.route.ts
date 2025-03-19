import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

const router: Router = express.Router();

import { imageMulter, videoMulter  } from "../../utils/fileUploader";
import { createBootcamp, listBootcamps, getBootcamp, updateBootcamp, deleteBootcamp, addCourseToBootcamp, enrollMemberInBootcamp, removeMemberFromBootcamp, } from "../../modules/bootcamp/bootcamp.controller";

router.post("/create", requireAuth(), createBootcamp);
router.get("/all-bootcamps", listBootcamps);
router.get("/:bootcampId", getBootcamp);
router.put("/update/:bootcampId", requireAuth(), imageMulter, updateBootcamp);
router.delete("/:bootcampId", deleteBootcamp);
router.post("/add-course", addCourseToBootcamp);
router.post("/enroll-member", enrollMemberInBootcamp);
router.post("/remove-member", removeMemberFromBootcamp);

export default router;