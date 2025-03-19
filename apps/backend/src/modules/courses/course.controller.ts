import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import  { cloudinary } from "../../config/cloudinary.config";	
import Course from "./model";

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

const listCoursesByIds = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseIds } = req.body;
        if (!courseIds || !Array.isArray(courseIds)) {
            res.status(400).json({ message: "courseIds must be a non-empty array" });
            return;
        }
        
        const courses = await Course.find({ _id: { $in: courseIds } }).select("title").exec();
        res.status(200).json({ 
            message: "Courses retrieved successfully", 
            data: courses 
        });
    } catch (error) {
        console.error("Error fetching courses by IDs:", error);
        res.status(500).json({ 
            message: "Error fetching courses", 
            error 
        });
    }
};


const getCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

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
        const { title, description, price, sections, category, status } = req.body;
        let image = req.file ? req.file.path : null;

        console.log("Update Course API called with courseId:", req.params);
        console.log("<====update body===>", req.body);
        console.log("<====update image===>", image);   
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

        // Prepare updated data
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (status) updateData.status = status;
        
        // UPLOAD IMAGE TO CLOUDINARY
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "continuum_block",
                public_id: courseId + "_image" // Optional: to have a custom public ID
            });
            updateData.image = result.url;  // Assuming `image` field in your course schema
            fs.unlinkSync(image); // Delete the file locally after uploading
        }
        
        if (price) {
            const numericPrice = parseInt(price);
            if (isNaN(numericPrice)) {
              res.status(400).json({
                message: "Invalid price format",
                error: "Price must be a valid number",
              });
              return;
            }
            updateData.price = numericPrice * 100;
        }

        if (sections) {
            const sectionsData = typeof sections === "string" ? JSON.parse(sections) : sections;

            console.log("Sections data:", sectionsData);

            updateData.sections = sectionsData.map((section: any) => ({
              ...section,
              sectionId: section.sectionId || uuidv4(),
              chapters: section.chapters.map((chapter: any) => {
                // Handle quiz questions if present
                const updatedChapter = { ...chapter, chapterId: chapter.chapterId || uuidv4() };
                if (chapter.quiz) {
                  console.log(`Processing quiz for Chapter ${chapter.chapterId || updatedChapter.chapterId}:`, chapter.quiz);
                  updatedChapter.quiz = chapter.quiz.map((question: any) => {
                    const updatedQuestion = {
                      questionId: question.questionId || uuidv4(),
                      text: question.text,
                      options: question.options.map((option: any) => ({
                        optionId: option.optionId || uuidv4(),
                        text: option.text,
                        isCorrect: option.isCorrect,
                      })),
                    };
                    console.log(`Updated question for Chapter ${chapter.chapterId || updatedChapter.chapterId}:`, updatedQuestion);
                    return updatedQuestion;
                  });
                  console.log(`Updated quiz questions for Chapter ${chapter.chapterId || updatedChapter.chapterId}:`, updatedChapter.quiz);
                }
                return updatedChapter;
              }),
            }));
          }
      

        console.log("Final update data:", updateData);
        await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        const updatedCourse = await Course.findById(courseId);
      
          res.json({ 
            message: "Course updated successfully", 
            data: updatedCourse 
        });
    } catch(error) {
        console.log("<====error====>", error)
        res.status(500).json({ 
            message: "Error updating course", 
            error 
        });
    }
}

const getUploadVideoUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        console.log("file", file);

        if (!file) {
            res.status(400).json({
                message: "No file uploaded"
            });
            return;
        }

        const filePath = file.path;  // This depends on your multer setup to provide the local path
        const options = {
            folder: "continuum_block", 
            resource_type: "video" as "video",
            public_id: `videos/${uuidv4()}/${file.originalname}`,
            overwrite: true, // Depending on your requirement
        };

        // Upload the file directly to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, options);

        // Optionally delete the file if it's temporarily stored locally
        fs.unlinkSync(filePath);

        res.json({
            message: "Video uploaded successfully",
            data: {
                uploadUrl: result.public_id,
                videoUrl: result.secure_url // Use secure_url to ensure you use https
            }
        });
    } catch (error) {
        console.error("Error uploading video:", error);
        res.status(500).json({
            message: "Error uploading video",
            error
        });
    }
}

const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try{
        const { courseId } = req.params;
        const { userId } = getAuth(req);

        const course = await Course.findById(courseId);
        console.log("course===>",course);
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

        await Course.findByIdAndDelete(courseId);

        res.json({ 
            message: "Course deleted successfully", 
            data: course 
        });
    } catch (error) {
        console.log("error===>",error);
        res.status(500).json({ 
            message: "Error deleting course", 
            error 
        });
    }
}

const addReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const { userId } = getAuth(req);

        // Validate input
        if (!rating || !comment) {
            res.status(400).json({
                message: "Rating and comment are required"
            });
            return;
        }
        
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
            return;
        }
        
        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }

        // Create new review // Assuming req.user has a name property
        const newReview = {
            user: { userId, name: "Anonymous"}, 
            rating,
            comment,
            commentReplies: [],
        };

        // Add the review to the course
        course.reviews.push(newReview);
        
        // Calculate new average rating
        const totalRatings = course.reviews.reduce((sum, review) => sum + review.rating, 0);
        course.ratings = course.reviews.length > 0 ? totalRatings / course.reviews.length : 0;
        
        // Save the updated course
        await course.save();
        
        res.status(201).json({
            message: "Review added successfully",
            data:course
        });
    }  catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({
            message: "Error adding review",
            error
        });
    }
}


export {
    createCourse,
    listCourses,
    listCoursesByIds,
    getCourse,
    updateCourse,
    getUploadVideoUrl,
    deleteCourse
}