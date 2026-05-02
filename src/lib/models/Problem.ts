import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    patterns: [
      {
        type: String,
      },
    ],
    keyInsight: {
      type: String,
    },
    approachSummary: {
      type: String,
    },
    alternateApproach: {
      type: String,
    },
    timeComplexity: {
      type: String,
    },
    spaceComplexity: {
      type: String,
    },
    mistakes: [
      {
        type: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nextRevision: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 1 day after
    },
    lastRevised: {
      type: Date,
    },
    revisionCount: {
      type: Number,
      default: 0,
    },
    notes: [
      {
        url: { type: String, required: true },
        format: { type: String }, // e.g. "pdf", "jpg", "png"
        publicId: { type: String }, // Cloudinary public_id for deletion later
      },
    ],
  },
  { timestamps: true }
);

// Force Mongoose to recompile the schema during Next.js hot-reloads
if (mongoose.models.Problem) {
  delete mongoose.models.Problem;
}
const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
