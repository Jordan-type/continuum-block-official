import mongoose, { Document, Model, Schema } from "mongoose";

const homeworkSubmissionSchema = new Schema({
    submissionId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    chapterId: { type: String, required: true },
    content: { type: String, required: true },  // This could be text or a link to a file
    timestamp: { type: Date, default: Date.now },
    graded: { type: Boolean, default: false },
    grade: { type: Number }
});

const HomeworkSubmission = mongoose.model("HomeworkSubmissions", homeworkSubmissionSchema);
export default HomeworkSubmission;
