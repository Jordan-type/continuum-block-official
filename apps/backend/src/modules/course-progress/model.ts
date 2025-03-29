import mongoose, { Document, Model, Schema } from "mongoose";

const badgeSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Sidekick", "Cosmic Guardian"
  category: { 
    type: String, 
    enum: ["Heroic", "Cosmic", "Tech", "Mystic", "Villain"], // Comic-inspired tiers
    required: true 
  },
  level: { type: Number, default: 1, min: 1, max: 5 }, // Progression within a category (e.g., Sidekick I, II, III)
  earnedAt: { type: Date, default: Date.now }, // When the badge was awarded nftTokenId: { type: String }, // Optional: NFT token ID if minted as an NFT
  description: { type: String }, // Fun flavor text, e.g., "Defeated the Code Kraken!"
});

const chapterProgressSchema = new Schema({
  chapterId: { type: String, required: true },
  completed: { type: Boolean, required: true },
  completionTime: { type: Date, default: null }, // Time when chapter was completed
  score: { type: Number, default: 0 },           // Optional score for quizzes or assessments
  isLocked: { type: Boolean, default: false }, // Flag to lock the quiz after completion
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
    badges: [badgeSchema], // Badges for achievements
    engagementScore: { type: Number, default: 0 }, // Measure engagement (e.g., time spent, interactions)
},{
  timestamps: true,
})

courseProgressSchema.index({ userId: 1, courseId: 1 }); // Compound index for frequent queries
courseProgressSchema.index({ overallProgress: -1 }); // Index for sorting by progress in leaderboards

const CourseProgress = mongoose.model("Course-Progress", courseProgressSchema);
export default CourseProgress;

// Comic-Inspired Badge Ideas

// 1. Heroic (Superhero Theme)
// Sidekick (Level 1): "You’ve joined the fight—every hero starts somewhere!"
// Vigilante (Level 2): "Patrolling the streets of knowledge with grit!"
// Captain (Level 3): "Leading the charge against ignorance!"
// Avenger (Level 4): "Assembling skills to save the day!"
// Legend (Level 5): "A mythic hero etched in the halls of learning!"

// 2. Cosmic (Space/Galactic Theme)
// Star Cadet (Level 1): "Blasting off into the learning cosmos!"
// Nova Scout (Level 2): "Navigating the galaxy of code!"
// Planet Shaper (Level 3): "Building worlds with your skills!"
// Galactic Knight (Level 4): "Wielding cosmic power over challenges!"
// Cosmic Guardian (Level 5): "Protector of the universe’s knowledge!"

// 3. Tech (Gadgeteer/Iron Man Theme)
// Gear Tinkerer (Level 1): "Crafting your first learning gadget!"
// Circuit Breaker (Level 2): "Sparking innovation in the lab!"
// Tech Knight (Level 3): "Armored with tech mastery!"
// Quantum Engineer (Level 4): "Bending reality with your skills!"
// Genix Master (Level 5): "The ultimate inventor of solutions!"

// 4. Mystic (Magic/Doctor Strange Theme)
// Apprentice (Level 1): "Unlocking the secrets of the arcane!"
// Rune Weaver (Level 2): "Casting spells of understanding!"
// Sorcerer (Level 3): "Mastering the mystical arts!"
// Astral Sage (Level 4): "Transcending to higher knowledge!"
// Eldritch Lord (Level 5): "Commanding the forces of learning!"

// 5. Villain (Anti-Hero/Dark Theme)
// Rogue (Level 1): "Stealing knowledge from the shadows!"
// Trickster (Level 2): "Outsmarting the system with flair!"
// Mastermind (Level 3): "Plotting your rise to brilliance!"
// Overlord (Level 4): "Conquering challenges with cunning!"
// Dark Titan (Level 5): "Ruling the learning underworld!"

// {
//   "name": "Cosmic Guardian",
//   "description": "Protector of the universe’s knowledge!",
//   "image": "ipfs://Qm.../cosmic-guardian.png",
//   "attributes": [
//     { "trait_type": "Category", "value": "Cosmic" },
//     { "trait_type": "Level", "value": "5" }
//   ]
// }