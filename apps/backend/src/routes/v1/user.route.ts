import express, { Router } from "express";
import { requireAuth } from "@clerk/express";

// controller
import { createUser, getUser, listUsers, syncUser, deleteUser, updateUser, promoteUserRole } from "../../modules/users/user.controller"

const router: Router = express.Router();

router.post("/create", createUser)
router.get("/all-users",  requireAuth(), listUsers)
router.get("/:userId",  requireAuth(), getUser)
router.put("/:userId", requireAuth(), syncUser)
router.put("/update/:userId", updateUser);
router.put("/promote-role/:userId", requireAuth(), promoteUserRole)
router.delete("/delete/:userId", requireAuth(), deleteUser)

export default router;