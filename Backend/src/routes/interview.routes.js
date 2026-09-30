const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * Strategy Reports & PDF
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController);
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

/**
 * AI Coach
 */
interviewRouter.post("/coach/chat", authMiddleware.authUser, interviewController.askAiCoachController);

/**
 * Mock Interview
 */
interviewRouter.post("/mock/questions", authMiddleware.authUser, interviewController.generateMockQuestionsController);
interviewRouter.post("/mock/evaluate", authMiddleware.authUser, interviewController.evaluateMockAnswerController);
interviewRouter.post("/mock/save-session", authMiddleware.authUser, interviewController.saveMockSessionController);
interviewRouter.get("/mock/sessions", authMiddleware.authUser, interviewController.getAllInterviewSessionsController);

/**
 * Project Defense
 */
interviewRouter.post("/project-defense/questions", authMiddleware.authUser, interviewController.getProjectDefenseQuestionsController);

/**
 * Preparation Roadmap
 */
interviewRouter.get("/roadmap", authMiddleware.authUser, interviewController.getPersonalizedRoadmapController);

/**
 * Daily Challenge
 */
interviewRouter.get("/daily-challenge", authMiddleware.authUser, interviewController.getDailyChallengeController);
interviewRouter.post("/daily-challenge/submit", authMiddleware.authUser, interviewController.submitDailyChallengeController);

/**
 * Progress Analytics
 */
interviewRouter.get("/analytics", authMiddleware.authUser, interviewController.getAnalyticsController);

/**
 * Question Bank
 */
interviewRouter.get("/question-bank", authMiddleware.authUser, interviewController.getQuestionBankController);
interviewRouter.post("/question-bank/toggle-practiced", authMiddleware.authUser, interviewController.toggleQuestionPracticedController);
interviewRouter.post("/question-bank/toggle-bookmark", authMiddleware.authUser, interviewController.toggleQuestionBookmarkedController);

/**
 * Resume and JD Analyzers
 */
interviewRouter.post("/analyze-resume", authMiddleware.authUser, upload.single("resume"), interviewController.analyzeResumeController);
interviewRouter.post("/analyze-jd", authMiddleware.authUser, interviewController.analyzeJobDescriptionController);

module.exports = interviewRouter;