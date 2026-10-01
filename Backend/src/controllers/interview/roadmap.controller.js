const { generatePersonalizedRoadmap } = require("../../services/ai");
const candidateProfileModel = require("../../models/candidateProfile.model");
const interviewReportModel = require("../../models/interviewReport.model");
const { handleAiError } = require("./helpers");

/**
 * @name getPersonalizedRoadmapController
 * @description Generate personalized preparation roadmap targeting candidate's weak areas
 */
async function getPersonalizedRoadmapController(req, res) {
    try {
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const latestReport = await interviewReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });

        if (!candidateProfile && !latestReport) {
            return res.status(200).json({
                hasRoadmap: false,
                message: "No personalized roadmap yet. Create a strategy to generate your roadmap."
            });
        }

        const targetRole = req.query.role || latestReport?.title || candidateProfile?.targetRoles?.[0] || "Software Engineer";

        const roadmap = await generatePersonalizedRoadmap({
            candidateProfile: candidateProfile || {},
            targetRole
        });

        return res.status(200).json({
            hasRoadmap: true,
            roadmap
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate preparation roadmap.");
    }
}

module.exports = {
    getPersonalizedRoadmapController
};
