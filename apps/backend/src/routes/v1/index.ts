import express, { Router } from "express"

const routing: Router = express.Router();

// v1 routes imports
import userRoutes from "./user.route"
import courseRoutes from "./course.route"

routing.use('/api/v1/courses', courseRoutes)
routing.use('/api/v1/users', userRoutes)


export default routing