const { askAiCoach } = require("../../services/ai");
const candidateProfileModel = require("../../models/candidateProfile.model");
const interviewReportModel = require("../../models/interviewReport.model");
const { handleAiError } = require("./helpers");

/**
 * @name askAiCoachController
 * @description Context-aware AI Coach grounded in user's CandidateProfile
 */
async function askAiCoachController(req, res) {
    try {
        const { messages, context = {} } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Messages array is required." });
        }

        // Fetch candidate profile and latest active strategy for authenticated user
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const latestStrategy = await interviewReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        const enrichedContext = {
            ...context,
            candidateProfile: candidateProfile || null,
            latestStrategy: latestStrategy || null
        };

        const reply = await askAiCoach({ messages, context: enrichedContext });
        return res.status(200).json({ reply });
    } catch (error) {
        return handleAiError(res, error, "AI Coach is currently unavailable.");
    }
}

module.exports = {
    askAiCoachController
};
