const { getDailyChallengeQuestions } = require("../../services/ai");
const candidateProfileModel = require("../../models/candidateProfile.model");
const userActivityModel = require("../../models/userActivity.model");
const { handleAiError } = require("./helpers");

/**
 * @name getDailyChallengeController
 * @description Get daily challenge grounded in candidate's weak areas
 */
async function getDailyChallengeController(req, res) {
    try {
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const targetRole = req.query.role || candidateProfile?.targetRoles?.[0] || "Full Stack Developer";

        const challenge = await getDailyChallengeQuestions({
            targetRole,
            weakAreas: candidateProfile?.weakAreas || [],
            skills: candidateProfile?.extractedSkills || []
        });

        // Check if user completed challenge today
        const today = new Date().toISOString().slice(0, 10);
        const completion = await userActivityModel.findOne({
            user: req.user.id,
            date: today,
            activityType: "daily_challenge"
        });

        return res.status(200).json({
            challenge,
            completedToday: !!completion,
            weakAreaGrounding: candidateProfile?.weakAreas?.[0]?.name || null
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate daily challenge.");
    }
}

/**
 * @name submitDailyChallengeController
 * @description Record daily challenge completion and update streak
 */
async function submitDailyChallengeController(req, res) {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const { evaluations = {} } = req.body;

        await userActivityModel.findOneAndUpdate(
            { user: req.user.id, date: today, activityType: "daily_challenge" },
            {
                user: req.user.id,
                date: today,
                activityType: "daily_challenge",
                metadata: { evaluations }
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Daily challenge completed! Streak updated.",
            completedToday: true
        });
    } catch (error) {
        console.error("Submit Daily Challenge Error:", error);
        return res.status(500).json({ message: "Failed to record daily challenge.", error: error.message });
    }
}

module.exports = {
    getDailyChallengeController,
    submitDailyChallengeController
};
