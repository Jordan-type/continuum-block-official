import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  courseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
});

const memberSchema = new Schema({
  memberId: { type: String, required: true }, // Could reference a User model
  fullName: { type: String, required: true },
  progress: { type: Number, required: true, min: 0, max: 100 },
});

const hostedBySchema = new Schema({
  type: { type: String, enum: ["Organization", "Individual"], required: true },
  name: { type: String, required: true }, // e.g., "xAI" or "John Doe"
  id: { type: String, required: true }, // Reference to User or Organization model
});

const bootcampSchema = new Schema({
  hostedBy: { type: hostedBySchema, required: true, }, // should be the name of the user who created the bootcamp
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  duration: { type: String, required: true },
  type: { type: String, required: true, enum: ["Part-Time", "Full-Time"], default: "Full-Time" },
  liveClasses: {
    count: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, default: "No live classes scheduled" },
  },
  practicalCaseStudy: { type: String, required: true },
  weeklyFeedback: { type: String, required: true },
  certification: { type: String, required: true },
  enrollmentStatus: { type: String, enum: ["Open", "Closed"], default: "Open" },
  image: { type: String, required: false},
  status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
  courses: [courseSchema],
  members: [memberSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BootcampModel = mongoose.model("Bootcamp", bootcampSchema);
export default BootcampModel;