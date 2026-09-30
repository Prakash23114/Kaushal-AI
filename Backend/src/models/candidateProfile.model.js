const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    techStack: [{ type: String }],
    description: { type: String, default: "" },
    keyHighlights: [{ type: String }]
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    duration: { type: String, default: "" },
    summary: { type: String, default: "" }
}, { _id: false });

const educationSchema = new mongoose.Schema({
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    year: { type: String, default: "" }
}, { _id: false });

const weakAreaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    severity: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium"
    },
    recommendation: { type: String, default: "" }
}, { _id: false });

const candidateProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true,
        index: true
    },
    resumeText: {
        type: String,
        required: true
    },
    resumeFileName: {
        type: String,
        default: "Resume.pdf"
    },
    resumeUploadedAt: {
        type: Date,
        default: Date.now
    },

    // ATS & Strength Scores
    atsScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    technicalStrength: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    projectStrength: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    roleRelevance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    formattingScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    // Extracted Profile Entities
    extractedSkills: [{
        type: String
    }],
    projects: [projectSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [{
        type: String
    }],

    // Gap Analysis & Suggestions
    missingSkills: [{
        type: String
    }],
    missingKeywords: [{
        type: String
    }],
    weakAreas: [weakAreaSchema],
    strengths: [{
        type: String
    }],
    recommendations: [{
        type: String
    }],
    targetRoles: [{
        type: String
    }],

    // Dynamic Competencies (starts from resume, evolves with interviews)
    competencyScores: {
        technicalSkills: { type: Number, default: 0 },
        behavioral: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        projectArchitecture: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

const candidateProfileModel = mongoose.model("CandidateProfile", candidateProfileSchema);

module.exports = candidateProfileModel;
