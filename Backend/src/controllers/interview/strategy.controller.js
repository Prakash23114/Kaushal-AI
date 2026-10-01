const pdfParse = require("pdf-parse");
const {
    generateInterviewReport,
    generateResumePdf,
    parseResumeComprehensive
} = require("../../services/ai");
const interviewReportModel = require("../../models/interviewReport.model");
const candidateProfileModel = require("../../models/candidateProfile.model");
const userActivityModel = require("../../models/userActivity.model");
const { handleAiError } = require("./helpers");

/**
 * @name generateInterViewReportController
 * @description Generate interview strategy report. Uses uploaded PDF or user's stored CandidateProfile resume.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";
        let newResumeFileName = "Resume.pdf";

        // 1. If file uploaded, parse text
        if (req.file) {
            newResumeFileName = req.file.originalname || "Resume.pdf";
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = parsed.text;
        } else {
            // 2. Otherwise, check if user has a stored resume in CandidateProfile
            const profile = await candidateProfileModel.findOne({ user: req.user.id });
            if (profile && profile.resumeText) {
                resumeText = profile.resumeText;
                newResumeFileName = profile.resumeFileName || "Resume.pdf";
            }
        }

        const { selfDescription = "", jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Target job description is required."
            });
        }

        if (!resumeText && !selfDescription.trim()) {
            return res.status(400).json({
                message: "Resume PDF is required or please complete resume onboarding first."
            });
        }

        // Generate interview report using AI
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // Save report in MongoDB for authenticated user
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        // Re-analyze or update CandidateProfile with the new resume and strategy target role
        const targetRole = interViewReportByAi.title || "Software Engineer";
        if (req.file && resumeText) {
            try {
                const analysis = await parseResumeComprehensive({
                    resumeText: resumeText.trim(),
                    targetRole
                });
                await candidateProfileModel.findOneAndUpdate(
                    { user: req.user.id },
                    {
                        user: req.user.id,
                        resumeText: resumeText.trim(),
                        resumeFileName: newResumeFileName,
                        resumeUploadedAt: new Date(),
                        atsScore: analysis.atsScore || 75,
                        technicalStrength: analysis.technicalStrength || 75,
                        projectStrength: analysis.projectStrength || 75,
                        roleRelevance: analysis.roleRelevance || 75,
                        formattingScore: analysis.formattingScore || 80,
                        extractedSkills: analysis.extractedSkills || [],
                        projects: analysis.projects || [],
                        experience: analysis.experience || [],
                        education: analysis.education || [],
                        certifications: analysis.certifications || [],
                        missingSkills: analysis.missingSkills || [],
                        missingKeywords: analysis.missingKeywords || [],
                        weakAreas: analysis.weakAreas || [],
                        strengths: analysis.strengths || [],
                        recommendations: analysis.recommendations || [],
                        targetRoles: [targetRole, ...(analysis.targetRoles || [])],
                        competencyScores: analysis.competencyScores || {
                            technicalSkills: 75,
                            behavioral: 70,
                            communication: 72,
                            projectArchitecture: 76,
                            problemSolving: 65
                        }
                    },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.warn("Resume re-analysis note during strategy creation:", err.message);
                await candidateProfileModel.findOneAndUpdate(
                    { user: req.user.id },
                    {
                        resumeText: resumeText.trim(),
                        resumeFileName: newResumeFileName,
                        resumeUploadedAt: new Date(),
                        $addToSet: { targetRoles: targetRole }
                    },
                    { upsert: true }
                );
            }
        } else {
            // Update targetRoles prioritizing the new strategy role
            await candidateProfileModel.findOneAndUpdate(
                { user: req.user.id },
                {
                    $pull: { targetRoles: targetRole }
                }
            );
            await candidateProfileModel.findOneAndUpdate(
                { user: req.user.id },
                {
                    $push: { targetRoles: { $each: [targetRole], $position: 0 } }
                }
            );
        }

        // Record user activity
        const today = new Date().toISOString().slice(0, 10);
        await userActivityModel.create({
            user: req.user.id,
            date: today,
            activityType: "strategy_created",
            metadata: { reportId: interviewReport._id, title: interviewReport.title }
        });

        return res.status(201).json({
            message: "Interview strategy generated successfully.",
            interviewReport
        });

    } catch (error) {
        return handleAiError(res, error, "Failed to generate interview report.");
    }
}

/**
 * @name getInterviewReportByIdController
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    });
}

/** 
 * @name getAllInterviewReportsController
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v");

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    });
}

/**
 * @name generateResumePdfController
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Generate Resume PDF Error:", error);
        return res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: error.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};
