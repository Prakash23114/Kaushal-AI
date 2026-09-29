const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

/**
 * @route POST /api/interview/coach/chat
 * @description Context-aware AI Coach chat
 * @access private
 */
interviewRouter.post("/coach/chat", authMiddleware.authUser, interviewController.askAiCoachController)

/**
 * @route POST /api/interview/mock/evaluate
 * @description Evaluate mock interview answer
 * @access private
 */
interviewRouter.post("/mock/evaluate", authMiddleware.authUser, interviewController.evaluateMockAnswerController)

/**
 * @route POST /api/interview/analyze-resume
 * @description Analyze resume for ATS score, strengths, and missing keywords
 * @access private
 */
interviewRouter.post("/analyze-resume", authMiddleware.authUser, upload.single("resume"), interviewController.analyzeResumeController)

/**
 * @route POST /api/interview/analyze-jd
 * @description Analyze job description and compare skills
 * @access private
 */
interviewRouter.post("/analyze-jd", authMiddleware.authUser, interviewController.analyzeJobDescriptionController)

/**
 * @route GET /api/interview/daily-challenge
 * @description Get daily 3-question challenge
 * @access private
 */
interviewRouter.get("/daily-challenge", authMiddleware.authUser, interviewController.getDailyChallengeController)

module.exports = interviewRouter