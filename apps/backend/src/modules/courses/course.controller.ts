import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import Course from "./model";

const s3 = new AWS.S3();

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

const listCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.query

        // Query courses based on the category parameter
        const query = category && category !== "all" ? { category } : {};
        const courses = await Course.find(query);

        res.json({
            message: "Courses retrieved successfully",
            data: courses
        }) 
    } catch (error) {
        console.log("error",error);
        res.status(500).json({ 
            message: "Error retrieving courses", 
            error: error 
        });
    }
}

const getCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        console.log("req.params", req.params);

        const course = await Course.findById(courseId);
        console.log("Fetched course:", course);

        if (!course) {
            res.status(404).json({
                message: "Course not found",
            })

            return
        }
        
        res.status(200).json({
            message: "Course retrieved successfully",
            data: course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error retrieving course",
            error: error
        });
    }
}

const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const updateData = { ...req.body };
        const { userId } = getAuth(req);

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({
                 message: "Course not found" 
                });
            return;
        }

        if (course.teacherId.toString() !== userId) {
            res.status(403).json({ 
                message: "Not authorized to update this course "
            });
            return;
        }

        if (updateData.price) {
            const price = parseInt(updateData.price);
            if (isNaN(price)) {
              res.status(400).json({
                message: "Invalid price format",
                error: "Price must be a valid number",
              });
              return;
            }
            updateData.price = price * 100;
        }

        if (updateData.sections) {
            const sectionsData =
              typeof updateData.sections === "string"
                ? JSON.parse(updateData.sections)
                : updateData.sections;
      
            updateData.sections = sectionsData.map((section: any) => ({
              ...section,
              sectionId: section.sectionId || uuidv4(),
              chapters: section.chapters.map((chapter: any) => ({
                ...chapter,
                chapterId: chapter.chapterId || uuidv4(),
              })),
            }));
          }
      
          Object.assign(course, updateData);
          await course.save();
      
          res.json({ 
            message: "Course updated successfully", 
            data: course 
        });
    } catch(error) {
        res.status(500).json({ 
            message: "Error updating course", 
            error 
        });
    }
}

const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try{
        const { courseId } = req.params;
        const { userId } = getAuth(req);

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ 
                message: "Course not found" 
            });
            return;
        }

        if (course.teacherId.toString() !== userId) {
            res.status(403).json({ 
                message: "Not authorized to delete this course " 
            });
            return;
        }

        await Course.deleteOne({courseId})

        res.json({ 
            message: "Course deleted successfully", 
            data: course 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting course", 
            error 
        });
    }
}

const getUploadVideoUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileName, fileType } = req.body;
        
        if (!fileName || !fileType) {
            res.status(400).json({
                message: "File name and type are required" 
            });
            return;
        }

        const uniqueId = uuidv4();
        const s3Key = `videos/${uniqueId}/${fileName}`;

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME || "",
            Key: s3Key,
            Expires: 60,
            ContentType: fileType,
        };

        const uploadUrl = s3.getSignedUrl("putObject", s3Params);
        const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;

        res.json({
            message: "Upload URL generated successfully",
            data: { 
                uploadUrl, 
                videoUrl 
            },
          });
    } catch(error) {
        res.status(500).json({ 
            message: "Error generating upload URL",
            error 
        });
    }
}

export {
    createCourse,
    listCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    getUploadVideoUrl
}