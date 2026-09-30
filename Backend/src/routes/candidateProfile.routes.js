const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const {
    getMyProfileController,
    onboardingResumeController,
    getDashboardDataController
} = require("../controllers/candidateProfile.controller");

const profileRouter = express.Router();

/**
 * @route GET /api/profile/me
 * @description Get candidate profile of logged in user
 * @access private
 */
profileRouter.get("/me", authMiddleware.authUser, getMyProfileController);

/**
 * @route POST /api/profile/onboarding
 * @description Upload resume PDF, extract text, analyze with Gemini, and save CandidateProfile
 * @access private
 */
profileRouter.post("/onboarding", authMiddleware.authUser, upload.single("resume"), onboardingResumeController);

/**
 * @route PUT /api/profile/update-resume
 * @description Re-upload and re-analyze resume, updating CandidateProfile and ATS score
 * @access private
 */
profileRouter.put("/update-resume", authMiddleware.authUser, upload.single("resume"), onboardingResumeController);

/**
 * @route GET /api/profile/dashboard
 * @description Get dynamic real-time dashboard data for logged-in user
 * @access private
 */
profileRouter.get("/dashboard", authMiddleware.authUser, getDashboardDataController);

module.exports = profileRouter;
