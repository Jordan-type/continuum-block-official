import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import Course from "./model";

const listCourses = async (req: Request, res: Response): Promise<void> => {
    const { category } = req.query

    try {
        const courses = category && category !== "all" ? await Course.find({ category }).exec() : await Course.find().exec(); 

        res.json({
            message: "Courses retrieved successfully",
            data: courses
        }) 
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error retrieving courses", 
            error: error 
        });
    }
}

const getCourse = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        const course = await Course.findById(id).exec();

        if (!course) {
            res.status(404).json({
                message: "Course not found",
            })

            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving course",
            error: error
        });
    }
}

const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { teacherId, teacherName } = req.body;
        
        if (!teacherId || !teacherName) {
            res.status(400).json({ 
                message: "Teacher Id and name are required" 
            });
            return;
        }
        
        const newCourse = new Course({
            courseId: uuidv4(),
            teacherId,
            teacherName,
            title: "Untitled Course",
            description: "",
            category: "Uncategorized",
            image: "",
            price: 0,
            level: "Beginner",
            status: "Draft",
            sections: [],
            enrollments: [],
        });
        
        await newCourse.save();
        
        res.status(200).json({
            message: "Course created successfully",
            data: newCourse 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error creating course",
            error: error 
        });
    }
}



export {
    listCourses,
    getCourse,
    createCourse
}