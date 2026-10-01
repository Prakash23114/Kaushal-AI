const candidateProfileModel = require("../../models/candidateProfile.model");
const questionPracticeModel = require("../../models/questionPractice.model");
const userActivityModel = require("../../models/userActivity.model");

/**
 * @name getQuestionBankController
 */
async function getQuestionBankController(req, res) {
    try {
        const userId = req.user.id;
        const candidateProfile = await candidateProfileModel.findOne({ user: userId });

        // Retrieve user's practice and bookmark status from DB
        const userPracticeRecords = await questionPracticeModel.find({ user: userId });
        const practicedMap = new Map();
        const bookmarkedMap = new Map();

        userPracticeRecords.forEach(r => {
            practicedMap.set(r.questionId, r.isPracticed);
            bookmarkedMap.set(r.questionId, r.isBookmarked);
        });

        return res.status(200).json({
            candidateSkills: candidateProfile?.extractedSkills || [],
            weakAreas: candidateProfile?.weakAreas || [],
            practicedMap: Object.fromEntries(practicedMap),
            bookmarkedMap: Object.fromEntries(bookmarkedMap)
        });
    } catch (error) {
        console.error("Question Bank Error:", error);
        return res.status(500).json({ message: "Failed to fetch question bank data.", error: error.message });
    }
}

/**
 * @name toggleQuestionPracticedController
 */
async function toggleQuestionPracticedController(req, res) {
    try {
        const userId = req.user.id;
        const { questionId, question, category, topic, difficulty } = req.body;

        let record = await questionPracticeModel.findOne({ user: userId, questionId });
        const newStatus = record ? !record.isPracticed : true;

        record = await questionPracticeModel.findOneAndUpdate(
            { user: userId, questionId },
            {
                user: userId,
                questionId,
                question: question || "Interview Question",
                category: category || "General",
                topic: topic || "",
                difficulty: difficulty || "Intermediate",
                isPracticed: newStatus,
                lastPracticedAt: newStatus ? new Date() : undefined
            },
            { upsert: true, new: true }
        );

        if (newStatus) {
            const today = new Date().toISOString().slice(0, 10);
            await userActivityModel.create({
                user: userId,
                date: today,
                activityType: "question_practiced",
                metadata: { questionId }
            });
        }

        const totalPracticed = await questionPracticeModel.countDocuments({ user: userId, isPracticed: true });

        return res.status(200).json({
            questionId,
            isPracticed: newStatus,
            totalPracticed
        });
    } catch (error) {
        console.error("Toggle Question Error:", error);
        return res.status(500).json({ message: "Failed to update practice status.", error: error.message });
    }
}

/**
 * @name toggleQuestionBookmarkedController
 */
async function toggleQuestionBookmarkedController(req, res) {
    try {
        const userId = req.user.id;
        const { questionId, question, category } = req.body;

        let record = await questionPracticeModel.findOne({ user: userId, questionId });
        const newStatus = record ? !record.isBookmarked : true;

        record = await questionPracticeModel.findOneAndUpdate(
            { user: userId, questionId },
            {
                user: userId,
                questionId,
                question: question || "Interview Question",
                category: category || "General",
                isBookmarked: newStatus
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            questionId,
            isBookmarked: newStatus
        });
    } catch (error) {
        console.error("Toggle Bookmark Error:", error);
        return res.status(500).json({ message: "Failed to update bookmark.", error: error.message });
    }
}

module.exports = {
    getQuestionBankController,
    toggleQuestionPracticedController,
    toggleQuestionBookmarkedController
};
