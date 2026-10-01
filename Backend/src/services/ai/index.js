/**
 * @file index.js
 * @description Central export index for modular AI services in Kaushal-AI
 */

const {
    ai,
    GEMINI_MODELS,
    callGeminiWithRetry
} = require("./gemini.client");

const {
    interviewReportSchema,
    generateInterviewReport,
    generatePdfFromHtml,
    generateResumePdf
} = require("./strategy.ai.service");

const {
    mockEvaluationSchema,
    evaluateMockAnswer,
    generateHeuristicMockEvaluation,
    mockQuestionsSchema,
    generateResumeSpecificMockQuestions,
    projectDefenseSchema,
    generateProjectDefenseQuestions
} = require("./mock.ai.service");

const {
    askAiCoach,
    generateAiCoachFallback
} = require("./coach.ai.service");

const {
    personalizedRoadmapSchema,
    generatePersonalizedRoadmap
} = require("./roadmap.ai.service");

const {
    dailyChallengeSchema,
    getDailyChallengeQuestions,
    CURATED_DAILY_CHALLENGES
} = require("./challenge.ai.service");

const {
    resumeAnalysisSchema,
    comprehensiveResumeSchema,
    jdAnalysisSchema,
    extractResumeHeuristics,
    analyzeResumeDetails,
    parseResumeComprehensive,
    analyzeJobDescription
} = require("./analysis.ai.service");

module.exports = {
    // Gemini client utilities
    ai,
    GEMINI_MODELS,
    callGeminiWithRetry,

    // Strategy & Resume PDF
    interviewReportSchema,
    generateInterviewReport,
    generatePdfFromHtml,
    generateResumePdf,

    // Mock Interview & Project Defense
    mockEvaluationSchema,
    evaluateMockAnswer,
    generateHeuristicMockEvaluation,
    mockQuestionsSchema,
    generateResumeSpecificMockQuestions,
    projectDefenseSchema,
    generateProjectDefenseQuestions,

    // AI Coach
    askAiCoach,
    generateAiCoachFallback,

    // Roadmap
    personalizedRoadmapSchema,
    generatePersonalizedRoadmap,

    // Daily Challenge
    dailyChallengeSchema,
    getDailyChallengeQuestions,
    CURATED_DAILY_CHALLENGES,

    // Resume & JD Analysis
    resumeAnalysisSchema,
    comprehensiveResumeSchema,
    jdAnalysisSchema,
    extractResumeHeuristics,
    analyzeResumeDetails,
    parseResumeComprehensive,
    analyzeJobDescription
};
