/**
 * @file index.js
 * @description Central export index for modular interview controllers in Kaushal-AI
 */

const {
    handleAiError
} = require("./helpers");

const {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} = require("./strategy.controller");

const {
    generateMockQuestionsController,
    evaluateMockAnswerController,
    saveMockSessionController,
    getAllInterviewSessionsController,
    getProjectDefenseQuestionsController
} = require("./mock.controller");

const {
    askAiCoachController
} = require("./coach.controller");

const {
    getPersonalizedRoadmapController
} = require("./roadmap.controller");

const {
    getDailyChallengeController,
    submitDailyChallengeController
} = require("./challenge.controller");

const {
    getQuestionBankController,
    toggleQuestionPracticedController,
    toggleQuestionBookmarkedController
} = require("./questionBank.controller");

const {
    getAnalyticsController
} = require("./analytics.controller");

const {
    analyzeResumeController,
    analyzeJobDescriptionController
} = require("./analysis.controller");

module.exports = {
    handleAiError,

    // Strategy
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,

    // Mock Interview & Project Defense
    generateMockQuestionsController,
    evaluateMockAnswerController,
    saveMockSessionController,
    getAllInterviewSessionsController,
    getProjectDefenseQuestionsController,

    // AI Coach
    askAiCoachController,

    // Preparation Roadmap
    getPersonalizedRoadmapController,

    // Daily Challenge
    getDailyChallengeController,
    submitDailyChallengeController,

    // Question Bank
    getQuestionBankController,
    toggleQuestionPracticedController,
    toggleQuestionBookmarkedController,

    // Performance Analytics
    getAnalyticsController,

    // Resume & JD Analysis
    analyzeResumeController,
    analyzeJobDescriptionController
};
