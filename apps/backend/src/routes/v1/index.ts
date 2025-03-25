import express, { Router } from "express"
import { requireAuth } from "@clerk/express";
const routing: Router = express.Router();

// v1 routes imports
import userRoutes from "./user.route"
import courseRoutes from "./course.route"
import bootcampRoutes from "./bootcamp.route"
import courseProgress from "./course.progress.route"
import transactionRoutes from "./trasactions.route";
import tweetsRoutes from "./twitter.route"

// v1 routes
routing.use('/api/v1/users', userRoutes)
routing.use('/api/v1/courses', courseRoutes)
routing.use('/api/v1/bootcamps', bootcampRoutes)
routing.use('/api/v1/course-progress', requireAuth(), courseProgress)
routing.use('/api/v1/transactions', requireAuth(), transactionRoutes)
routing.use('/api/v1/tweets', tweetsRoutes)

export default routing