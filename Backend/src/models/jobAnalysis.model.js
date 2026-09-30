const mongoose = require("mongoose");

const jobAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    roleTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        default: 0
    },
    experienceLevel: {
        type: String,
        default: "Mid-Level"    
    },
    matchedSkills: [{
        type: String
    }],
    missingSkills: [{
        type: String
    }],
    requiredSkills: [{
        type: String
    }],
    preferredSkills: [{
        type: String
    }],
    partiallyMatchedSkills: [{
        type: String
    }],
    responsibilities: [{
        type: String
    }],
    preparationRecommendations: [{
        type: String
    }]
}, {
    timestamps: true
});

const jobAnalysisModel = mongoose.model("JobAnalysis", jobAnalysisSchema);

module.exports = jobAnalysisModel;
