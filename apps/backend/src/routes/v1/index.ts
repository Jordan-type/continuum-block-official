import express, { Router } from "express"
import { requireAuth } from "@clerk/express";

const routing: Router = express.Router();

// v1 routes imports
import userRoutes from "./user.route"
import courseRoutes from "./course.route"
import courseProgress from "./course.progress.route"

routing.use('/api/v1/users', userRoutes)
routing.use('/api/v1/courses', courseRoutes)
routing.use('/api/v1/courses-progress', requireAuth(), courseProgress)

export default routing