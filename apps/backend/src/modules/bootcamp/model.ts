import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  courseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
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

// Sub-schema for testimonials
const testimonialSchema = new Schema({
  author: {
    name: { type: String, required: true },
    username: { type: String, required: true },
    profileImageUrl: { type: String, required: false },
  },
  text: { type: String, required: true },
  rating: { type: Number, required: false, min: 1, max: 5 }, // Rating out of 5
  date: { type: Date, required: true, default: Date.now },
});

// Sub-schema for price
const priceSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: "USD" }, // ISO 4217 format
});

// Sub-schema for live class schedules
const liveClassScheduleSchema = new Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
});

// Sub-schema for leaderboard entries
const leaderboardEntrySchema = new Schema({
  userId: { type: String, required: true },
  overallProgress: { type: Number, required: true, min: 0, max: 100 },
  courseCount: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  totalPrize: { type: Number, required: true },
  rank: { type: Number, required: true },
});

// Main schema for bootcamps
const bootcampSchema = new Schema({
  hostedBy: { type: hostedBySchema, required: true, }, // should be the name of the user who created the bootcamp
  title: { type: String, required: true },
  description: { type: String, required: true }, // Added for more detail
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }, // Added to specify the end date
  duration: { type: String, required: true }, // e.g., "3 months"
  type: { type: String, required: true, enum: ["Part-Time", "Full-Time"], default: "Full-Time" },
  deliveryMode: { type: String, enum: ["Online", "In-Person", "Hybrid"], required: true, default: "Online" }, 
  liveClasses: {
    count: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, default: "No live classes scheduled" },
    schedule: [liveClassScheduleSchema], // Added detailed schedule
  },
  practicalCaseStudy: { type: String, required: true },
  weeklyFeedback: { type: String, required: true },
  certification: { type: String, required: true },
  enrollmentStatus: { type: String, enum: ["Open", "Closed"], default: "Open" },
  image: { type: String, required: false},
  status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
  courses: [courseSchema],
  members: [memberSchema],
  testimonials: [testimonialSchema], 
  price: { type: priceSchema, required: true }, 
  categories: [{ type: String }], // Added for filtering, e.g., ["Blockchain", "Web3"]
  averageRating: { type: Number, required: false, min: 1, max: 5 }, // Added
  reviewCount: { type: Number, required: false, default: 0 }, // Added
  prerequisites: { type: String, required: false }, // Added, e.g., "Basic JavaScript knowledge"
  leaderboard: [leaderboardEntrySchema], // Added to store leaderboard data
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically update the updatedAt field on save
bootcampSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const BootcampModel = mongoose.model("Bootcamp", bootcampSchema);
export default BootcampModel;