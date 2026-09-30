const mongoose = require("mongoose");

const questionPracticeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    questionId: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "General"
    },
    topic: {
        type: String,
        default: ""
    },
    difficulty: {
        type: String,
        default: "Intermediate"
    },
    isPracticed: {
        type: Boolean,
        default: false
    },
    isBookmarked: {
        type: Boolean,
        default: false
    },
    lastPracticedAt: {
        type: Date
    }
}, {
    timestamps: true
});

questionPracticeSchema.index({ user: 1, questionId: 1 }, { unique: true });

const questionPracticeModel = mongoose.model("QuestionPractice", questionPracticeSchema);

module.exports = questionPracticeModel;
