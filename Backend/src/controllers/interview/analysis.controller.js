const pdfParse = require("pdf-parse");
const {
    parseResumeComprehensive,
    analyzeJobDescription
} = require("../../services/ai");
const candidateProfileModel = require("../../models/candidateProfile.model");
const jobAnalysisModel = require("../../models/jobAnalysis.model");
const { handleAiError } = require("./helpers");

/**
 * @name analyzeResumeController
 * @description Analyzes resume and automatically updates user's CandidateProfile in MongoDB
 */
async function analyzeResumeController(req, res) {
    try {
        let resumeText = req.body.resumeText;
        let resumeFileName = "Resume.pdf";

        if (req.file) {
            resumeFileName = req.file.originalname || "Resume.pdf";
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = parsed.text;
        }

        if (!resumeText) {
            return res.status(400).json({ message: "Resume file or resume text is required." });
        }

        const targetRole = req.body.targetRole || "Software Engineer";

        // Parse comprehensively
        const analysis = await parseResumeComprehensive({
            resumeText,
            targetRole
        });

        // Automatically update user's persistent CandidateProfile
        const profile = await candidateProfileModel.findOneAndUpdate(
            { user: req.user.id },
            {
                user: req.user.id,
                resumeText,
                resumeFileName,
                resumeUploadedAt: new Date(),
                atsScore: analysis.atsScore,
                technicalStrength: analysis.technicalStrength,
                projectStrength: analysis.projectStrength,
                roleRelevance: analysis.roleRelevance,
                formattingScore: analysis.formattingScore,
                extractedSkills: analysis.extractedSkills,
                projects: analysis.projects,
                experience: analysis.experience,
                education: analysis.education,
                certifications: analysis.certifications,
                missingSkills: analysis.missingSkills,
                missingKeywords: analysis.missingKeywords,
                weakAreas: analysis.weakAreas,
                strengths: analysis.strengths,
                recommendations: analysis.recommendations,
                targetRoles: analysis.targetRoles,
                competencyScores: analysis.competencyScores
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            analysis,
            profile,
            resumeText
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to analyze resume.");
    }
}

/**
 * @name analyzeJobDescriptionController
 * @description Compares JD with stored resume and saves analysis to user account
 */
async function analyzeJobDescriptionController(req, res) {
    try {
        let { jobDescription, resumeText } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." });
        }

        // If no resumeText provided, automatically use candidate's stored resume!
        if (!resumeText) {
            const profile = await candidateProfileModel.findOne({ user: req.user.id });
            if (profile && profile.resumeText) {
                resumeText = profile.resumeText;
            }
        }

        const analysis = await analyzeJobDescription({ jobDescription, resumeText: resumeText || "" });

        // Save analysis to user account in DB
        const savedAnalysis = await jobAnalysisModel.create({
            user: req.user.id,
            roleTitle: analysis.roleTitle || "Target Role",
            jobDescription,
            matchScore: analysis.matchedSkills?.length ? Math.round((analysis.matchedSkills.length / (analysis.matchedSkills.length + (analysis.missingSkills?.length || 1))) * 100) : 60,
            experienceLevel: analysis.experienceLevel || "Mid-Level",
            matchedSkills: analysis.matchedSkills || [],
            missingSkills: analysis.missingSkills || [],
            requiredSkills: analysis.requiredSkills || [],
            preferredSkills: analysis.preferredSkills || [],
            partiallyMatchedSkills: analysis.partiallyMatchedSkills || [],
            responsibilities: analysis.responsibilities || [],
            preparationRecommendations: analysis.preparationRecommendations || []
        });

        return res.status(200).json({
            analysis,
            savedAnalysis
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to analyze job description.");
    }
}

module.exports = {
    analyzeResumeController,
    analyzeJobDescriptionController
};
