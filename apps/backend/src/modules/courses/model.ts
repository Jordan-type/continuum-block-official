import mongoose, { Document, Model, Schema } from "mongoose";

const reviewSchema = new Schema({
    user: { type: new Schema({ userId: { type: String, required: true, }, name: { type: String }, }), },
    rating: { type: Number, default: 0,},
    comment: { type: String, },
    commentReplies: [Object],
  });

const quizOptionSchema = new Schema({
    optionId: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const quizQuestionSchema = new Schema({
    questionId: { type: String, required: true },
    text: { type: String, required: true },
    options: [quizOptionSchema]
});

// New schema to store user quiz responses
const quizResponseSchema = new Schema({
    userId: { type: String, required: true },
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const commentSchema = new Schema({
  commentId: {type: String,required: true,}, 
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  text: { type: String, required: true,},
  timestamp: { type: String, required: true,},
});

const chapterSchema = new Schema({
    chapterId: { type: String, required: true,},  
    type: {type: String, enum: ["Text", "Quiz", "Video"], required: true,},
    title: { type: String, required: true, },
    content: { type: String, required: true, },
    comments: { type: Array, schema: [commentSchema],},
    video: { type: String, },
    quiz: [quizQuestionSchema], 
    homeworks: [{ type: Schema.Types.ObjectId, ref: "HomeworkSubmissions" }],
    duration: { type: String, default: "0min" }, // (e.g., "4min")
});

const sectionSchema = new Schema({
    sectionId: {type: String, required: true, },
    sectionTitle: { type: String, required: true, },
    sectionDescription: { type: String, },
    chapters: { type: Array, schema: [chapterSchema],},
    duration: { type: String, default: "0min" }, // (e.g., "1h 18min")
});

const courseSchema = new Schema({
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true, },
    title: { type: String, required: true, },
    description: { type: String, },
    category: { type: String, required: true, },
    image: { type: String, },
    price: { type: Number, },
    level: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"],},
    status: { type: String, required: true, enum: ["Draft", "Published"], },
    sections: { type: Array, schema: [sectionSchema],},
    reviews: [reviewSchema],
    ratings: { type: Number, default: 0, },
    enrollments: { type: Array, schema: [ 
        new Schema({userId: 
            { type: String, required: true, }, 
        }), ],
    },
    quizResponses: [quizResponseSchema], 
    duration: { type: String, default: "0min" }, 
}, { timestamps: true, });

const Course = mongoose.model("Courses", courseSchema);
export default Course;
