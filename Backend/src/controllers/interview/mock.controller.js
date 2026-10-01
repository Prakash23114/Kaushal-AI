const {
    generateResumeSpecificMockQuestions,
    evaluateMockAnswer,
    generateProjectDefenseQuestions
} = require("../../services/ai");
const interviewReportModel = require("../../models/interviewReport.model");
const candidateProfileModel = require("../../models/candidateProfile.model");
const interviewSessionModel = require("../../models/interviewSession.model");
const userActivityModel = require("../../models/userActivity.model");
const { handleAiError } = require("./helpers");

/**
 * @name generateMockQuestionsController
 * @description Generate mock interview questions grounded in candidate's strategy, resume projects, and skills
 */
async function generateMockQuestionsController(req, res) {
    try {
        const { strategyId, role, difficulty = "Intermediate", interviewType = "Technical" } = req.body;

        let strategy = null;
        if (strategyId) {
            strategy = await interviewReportModel.findOne({ _id: strategyId, user: req.user.id });
        }
        if (!strategy) {
            // Pick latest strategy for user to ensure zero stale data from past strategies
            strategy = await interviewReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        }

        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const targetRole = role || strategy?.title || candidateProfile?.targetRoles?.[0] || "Software Engineer";

        const questions = await generateResumeSpecificMockQuestions({
            candidateProfile: candidateProfile || {},
            strategy,
            role: targetRole,
            difficulty,
            interviewType
        });

        return res.status(200).json({ questions, strategyId: strategy?._id || null, role: targetRole });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate interview questions.");
    }
}

/**
 * @name evaluateMockAnswerController
 */
async function evaluateMockAnswerController(req, res) {
    try {
        const { question, answer, role, difficulty, interviewType, strategyId } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and answer are required." });
        }

        let jobDescription = "";
        if (strategyId) {
            const strategy = await interviewReportModel.findOne({ _id: strategyId, user: req.user.id });
            if (strategy) jobDescription = strategy.jobDescription || "";
        }

        const evaluation = await evaluateMockAnswer({ question, answer, role, difficulty, interviewType, jobDescription });
        return res.status(200).json({ evaluation });
    } catch (error) {
        return handleAiError(res, error, "Failed to evaluate answer.");
    }
}

/**
 * @name saveMockSessionController
 * @description Save complete mock interview session to database
 */
async function saveMockSessionController(req, res) {
    try {
        const {
            strategyId,
            role,
            interviewType,
            difficulty,
            questions = [],
            answers = [],
            score = 0,
            technicalScore = 0,
            communicationScore = 0,
            behavioralScore = 0,
            projectScore = 0,
            evaluations = [],
            feedback = "",
            duration = 0
        } = req.body;

        const allowedConfidence = ["Low", "Moderate", "High", "Needs Improvement"];
        const sanitizedEvaluations = (evaluations || []).map(item => {
            let conf = item.confidence || "Moderate";
            if (!allowedConfidence.includes(conf)) {
                if (String(conf).toLowerCase().includes("need") || String(conf).toLowerCase().includes("low")) {
                    conf = "Needs Improvement";
                } else if (String(conf).toLowerCase().includes("high")) {
                    conf = "High";
                } else {
                    conf = "Moderate";
                }
            }
            return {
                ...item,
                confidence: conf
            };
        });

        const session = await interviewSessionModel.create({
            user: req.user.id,
            strategy: strategyId || undefined,
            role: role || "Software Engineer",
            interviewType: interviewType || "Technical",
            difficulty: difficulty || "Intermediate",
            questions,
            answers,
            score,
            technicalScore: technicalScore || score,
            communicationScore: communicationScore || score,
            behavioralScore: behavioralScore || score,
            projectScore: projectScore || score,
            evaluations: sanitizedEvaluations,
            feedback,
            duration
        });

        // Record user practice activity
        const today = new Date().toISOString().slice(0, 10);
        await userActivityModel.create({
            user: req.user.id,
            date: today,
            activityType: "mock_interview",
            metadata: { sessionId: session._id, questionsCount: questions.length, score }
        });

        return res.status(201).json({
            message: "Interview session recorded successfully.",
            session
        });
    } catch (error) {
        console.error("Save Mock Session Error:", error);
        return res.status(500).json({ message: "Failed to save interview session.", error: error.message });
    }
}

/**
 * @name getAllInterviewSessionsController
 */
async function getAllInterviewSessionsController(req, res) {
    try {
        const sessions = await interviewSessionModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({ sessions });
    } catch (error) {
        console.error("Get Sessions Error:", error);
        return res.status(500).json({ message: "Failed to fetch interview history.", error: error.message });
    }
}

/**
 * @name getProjectDefenseQuestionsController
 * @description Generate project defense questions based on candidate's detected projects
 */
async function getProjectDefenseQuestionsController(req, res) {
    try {
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });

        let { projectName, techStack, projectSummary } = req.body;

        // If not specified by user, auto-select their first detected resume project!
        if (!projectName && candidateProfile?.projects?.length > 0) {
            const firstProj = candidateProfile.projects[0];
            projectName = firstProj.title;
            techStack = firstProj.techStack?.join(", ") || "";
            projectSummary = firstProj.description || "";
        }

        projectName = projectName || "Main Web Application";

        const questions = await generateProjectDefenseQuestions({
            projectName,
            techStack,
            projectSummary,
            candidateProfile: candidateProfile || {}
        });

        return res.status(200).json({
            projectName,
            techStack,
            projectSummary,
            detectedProjects: candidateProfile?.projects || [],
            questions
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate project defense questions.");
    }
}

module.exports = {
    generateMockQuestionsController,
    evaluateMockAnswerController,
    saveMockSessionController,
    getAllInterviewSessionsController,
    getProjectDefenseQuestionsController
};
