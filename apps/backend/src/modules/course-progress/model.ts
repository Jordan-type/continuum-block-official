import mongoose, { Document, Model, Schema } from "mongoose";

const chapterProgressSchema = new Schema({
  chapterId: { type: String, required: true },
  completed: { type: Boolean, required: true },
});

const sectionProgressSchema = new Schema({
  sectionId: { type: String, required: true },
  chapters: { type: Array, schema: [chapterProgressSchema] },
});

const courseProgressSchema = new Schema({
    userId: { type: String, hashKey: true, required: true, },
    courseId: { type: Schema.Types.ObjectId, ref: "Courses", required: true, },
    enrollmentDate: { type: String, required: true, },
    overallProgress: { type: Number, required: true,},
    sections: { type: Array, schema: [sectionProgressSchema], },
    lastAccessedTimestamp: { type: String, required: true, },
},{
  timestamps: true,
})

const CourseProgress = mongoose.model("Course-Progress", courseProgressSchema);
export default CourseProgress;
