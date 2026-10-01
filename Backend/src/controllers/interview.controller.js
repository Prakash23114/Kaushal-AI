/**
 * @file interview.controller.js
 * @description Facade re-exporting modular interview controllers from ./interview/
 * All controller responsibilities are separated into clean, focused files:
 * - strategy.controller.js: Strategy generation, report fetch, and PDF resume export
 * - mock.controller.js: Mock questions, answer evaluation, session persistence, and project defense
 * - coach.controller.js: AI Coach chat interactions
 * - roadmap.controller.js: Personalized preparation roadmaps
 * - challenge.controller.js: Daily challenge retrieval and streak submissions
 * - questionBank.controller.js: Question bank list, practice toggles, and bookmarks
 * - analytics.controller.js: DB-backed performance metrics and radar stats
 * - analysis.controller.js: Resume ATS analysis and Job Description comparison
 * - helpers.js: Centralized AI error handling and status code mapping
 */

const interviewControllers = require("./interview");

module.exports = {
    ...interviewControllers
};