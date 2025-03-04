import mongoose, { Document, Model, Schema } from "mongoose";

const chapterProgressSchema = new Schema({
  chapterId: { type: String, required: true },
  completed: { type: Boolean, required: true },
  completionTime: { type: Date, default: null }, // Time when chapter was completed
  score: { type: Number, default: 0 },           // Optional score for quizzes or assessments
});

const sectionProgressSchema = new Schema({
  sectionId: { type: String, required: true },
  chapters: { type: Array, schema: [chapterProgressSchema] },
  sectionScore: { type: Number, default: 0 }, // Aggregate score for the section
});

const courseProgressSchema = new Schema({
    userId: { type: String, hashKey: true, required: true, index: true}, // Indexed for fast queries
    courseId: { type: Schema.Types.ObjectId, ref: "Courses", required: true, },
    enrollmentDate: { type: String, required: true, },
    overallProgress: { type: Number, required: true, },
    sections: { type: Array, schema: [sectionProgressSchema], },
    lastAccessedTimestamp: { type: String, required: true, },
    totalPoints: { type: Number, default: 0 }, // Total points earned (e.g., for leaderboard)
    totalPrize: { type: Number, default: 0 }, // Total prize value (e.g., for rewards)
    lastActivityDate: { type: String, default: null }, // Last interaction date for daily/monthly filtering
    completionStatus: { type: String, enum: ["in-progress", "completed"], default: "in-progress" }, // Track course completion
    badges: [{ type: String, enum: ["beginner", "intermediate", "advanced"], default: [] }], // Badges for achievements
    engagementScore: { type: Number, default: 0 }, // Measure engagement (e.g., time spent, interactions)
},{
  timestamps: true,
})

courseProgressSchema.index({ userId: 1, courseId: 1 }); // Compound index for frequent queries
courseProgressSchema.index({ overallProgress: -1 }); // Index for sorting by progress in leaderboards

const CourseProgress = mongoose.model("Course-Progress", courseProgressSchema);
export default CourseProgress;
