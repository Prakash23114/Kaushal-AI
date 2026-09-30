const mongoose = require("mongoose");

const evaluationItemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    score: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    answerStructure: { type: String, default: "" },
    confidence: { type: String, enum: ["Low", "Moderate", "High", "Needs Improvement"], default: "Moderate" },
    missingPoints: [{ type: String }],
    improvementSuggestions: [{ type: String }],
    betterAnswerApproach: { type: String, default: "" },
    followUpQuestion: { type: String, default: "" }
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    strategy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport"
    },
    role: {
        type: String,
        required: true
    },
    interviewType: {
        type: String,
        enum: ["Technical", "Behavioral", "Situational", "Project", "Hybrid"],
        default: "Technical"
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Professional"],
        default: "Intermediate"
    },
    questions: [{
        type: mongoose.Schema.Types.Mixed
    }],
    answers: [{
        type: mongoose.Schema.Types.Mixed
    }],
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    technicalScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    communicationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    behavioralScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    projectScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    evaluations: [evaluationItemSchema],
    feedback: {
        type: String,
        default: ""
    },
    duration: {
        type: Number, // duration in seconds
        default: 0
    }
}, {
    timestamps: true
});

const interviewSessionModel = mongoose.model("InterviewSession", interviewSessionSchema);

module.exports = interviewSessionModel;
