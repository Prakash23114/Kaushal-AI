const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    date: {
        type: String, // 'YYYY-MM-DD'
        required: true,
        index: true
    },
    activityType: {
        type: String,
        enum: ["daily_challenge", "question_practiced", "strategy_created", "mock_interview"],
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index to quickly find user activity by date and type
userActivitySchema.index({ user: 1, date: 1, activityType: 1 });

const userActivityModel = mongoose.model("UserActivity", userActivitySchema);

module.exports = userActivityModel;
