import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

// controller
import { updateUser } from "../../modules/users/user.controller"

const router: Router = express.Router();

router.put("/update/:userId", updateUser);

export default router;