const interviewSessionModel = require("../../models/interviewSession.model");
const interviewReportModel = require("../../models/interviewReport.model");
const candidateProfileModel = require("../../models/candidateProfile.model");
const userActivityModel = require("../../models/userActivity.model");
const questionPracticeModel = require("../../models/questionPractice.model");

/**
 * @name getAnalyticsController
 * @description Generate analytics charts based strictly on real DB records
 */
async function getAnalyticsController(req, res) {
    try {
        const userId = req.user.id;

        const sessions = await interviewSessionModel.find({ user: userId }).sort({ createdAt: 1 });
        const reports = await interviewReportModel.find({ user: userId });
        const profile = await candidateProfileModel.findOne({ user: userId });
        const userActivity = await userActivityModel.findOne({ user: userId });
        const questionsPracticedCount = await questionPracticeModel.countDocuments({ user: userId, isPracticed: true });

        // Calculate actual streak
        let streak = 0;
        if (userActivity?.lastActiveDate) {
            const today = new Date().toDateString();
            const lastActive = new Date(userActivity.lastActiveDate).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastActive === today || lastActive === yesterday) {
                streak = userActivity.streak || 1;
            }
        }

        const sessionQuestionsCount = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
        const totalQuestions = questionsPracticedCount + sessionQuestionsCount;

        if (sessions.length === 0 && reports.length === 0) {
            return res.status(200).json({
                hasData: false,
                message: "No performance history yet. Complete your first mock interview to see analytics.",
                streak,
                totalQuestions,
                strategiesCount: 0,
                readinessScore: 0
            });
        }

        // 1. Weekly Progress Chart Data
        const weeklyDataMap = new Map();
        sessions.forEach((s, idx) => {
            const date = new Date(s.createdAt);
            const weekLabel = `Session ${idx + 1} (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
            weeklyDataMap.set(weekLabel, {
                week: weekLabel,
                score: s.score || 0,
                technical: s.technicalScore || s.score || 0,
                behavioral: s.behavioralScore || s.score || 0
            });
        });

        const weeklyProgressData = Array.from(weeklyDataMap.values());

        // 2. Category Practice Data
        const categoryCounts = {
            "Technical": 0,
            "Behavioral": 0,
            "Project Defense": 0,
            "System Design": 0
        };

        sessions.forEach(s => {
            const type = s.interviewType === "project" ? "Project Defense" : (s.interviewType || "Technical");
            categoryCounts[type] = (categoryCounts[type] || 0) + (s.questions?.length || 1);
        });

        const categoryPracticeData = Object.keys(categoryCounts).map(cat => ({
            category: cat,
            practiced: categoryCounts[cat]
        }));

        // 3. Competency Radar Data
        const avgTech = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.technicalScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.technicalSkills || 0;
        const avgComm = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.communicationScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.communication || 0;
        const avgBeh = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.behavioralScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.behavioral || 0;
        const avgProj = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.projectScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.projectArchitecture || 0;
        const avgProblem = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length) : profile?.competencyScores?.problemSolving || 0;

        const skillRadarData = [
            { subject: "Technical Accuracy", score: avgTech },
            { subject: "STAR Communication", score: avgComm },
            { subject: "Project Architecture", score: avgProj },
            { subject: "Problem Solving", score: avgProblem },
            { subject: "Behavioral", score: avgBeh }
        ];

        // Calculated dynamic readiness
        const avgInterviewScore = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length) : 0;
        const ats = profile?.atsScore || 0;
        let readinessScore = 0;
        if (sessions.length > 0) {
            readinessScore = Math.min(100, Math.round(
                (ats * 0.3) +
                (avgInterviewScore * 0.45) +
                (Math.min(streak * 3, 15)) +
                (Math.min(totalQuestions, 10))
            ));
        }

        return res.status(200).json({
            hasData: sessions.length > 0,
            hasStrategies: reports.length > 0,
            weeklyProgressData,
            categoryPracticeData,
            skillRadarData,
            totalInterviews: sessions.length,
            averageScore: avgInterviewScore,
            streak,
            totalQuestions,
            strategiesCount: reports.length,
            readinessScore,
            hasEnoughDataForReadiness: sessions.length > 0
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ message: "Failed to generate analytics.", error: error.message });
    }
}

module.exports = {
    getAnalyticsController
};
