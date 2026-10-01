/**
 * @file ai.service.js
 * @description Facade re-exporting modular AI services from ./ai/
 * All sub-services are separated cleanly by responsibility:
 * - gemini.client.js: GenAI client initialization and retry logic
 * - strategy.ai.service.js: Strategy reports and ATS PDF resume generation
 * - mock.ai.service.js: Mock question generation, answer evaluation, and project defense
 * - coach.ai.service.js: Conversational AI coaching and mentoring
 * - roadmap.ai.service.js: Personalized 14-day preparation roadmaps
 * - challenge.ai.service.js: Daily challenges with caching and offline bank
 * - analysis.ai.service.js: Candidate profile parsing, ATS score, and JD comparison
 */

const aiServices = require("./ai");

module.exports = {
    ...aiServices
};