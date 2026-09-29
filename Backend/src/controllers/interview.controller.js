const pdfParse = require("pdf-parse")
const {
    generateInterviewReport,
    generateResumePdf,
    askAiCoach,
    evaluateMockAnswer,
    analyzeResumeDetails,
    analyzeJobDescription,
    getDailyChallengeQuestions
} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




function handleAiError(res, error, fallbackMessage) {
    console.error("AI Controller Error:", error?.message || error);

    const isQuota = error?.status === 429 ||
        error?.code === "RESOURCE_EXHAUSTED" ||
        error?.message?.includes("RESOURCE_EXHAUSTED") ||
        error?.message?.includes("quota") ||
        error?.message?.includes("free_tier_requests");

    if (isQuota) {
        return res.status(429).json({
            message: "Gemini AI daily request quota limit reached (20 requests limit). Please check your plan or try again later.",
            code: "RESOURCE_EXHAUSTED"
        });
    }

    const isUnavailable = error?.status === 503 ||
        error?.code === "UNAVAILABLE" ||
        error?.message?.includes("high demand") ||
        error?.message?.includes("UNAVAILABLE");

    if (isUnavailable) {
        return res.status(503).json({
            message: "AI service is temporarily busy due to high demand. Please try again shortly.",
            code: "UNAVAILABLE"
        });
    }

    return res.status(500).json({
        message: fallbackMessage || "AI service encountered an unexpected error.",
        error: error.message
    });
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        // 1. Check if resume file exists
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required."
            });
        }

        // 2. Extract text from PDF
        const resumeContent = await (
            new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            )
        ).getText();

        // 3. Get form data
        const { selfDescription, jobDescription } = req.body;

        // 4. Validate required fields
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Self description and job description are required."
            });
        }

        // 5. Generate interview report using AI
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        // 6. Save report in MongoDB
        const interviewReport = await interviewReportModel.create({
            user: req.user.id || req.user._id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        // 7. Send response
        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        return handleAiError(res, error, "Failed to generate interview report.");
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Generate Resume PDF Error:", error);
        return res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: error.message
        });
    }
}

/**
 * @description Controller for context-aware Kaushal AI Coach chat
 */
async function askAiCoachController(req, res) {
    try {
        const { messages, context } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Messages array is required." });
        }

        const reply = await askAiCoach({ messages, context });
        return res.status(200).json({ reply });
    } catch (error) {
        return handleAiError(res, error, "AI Coach is currently unavailable.");
    }
}

/**
 * @description Controller to evaluate mock interview answer
 */
async function evaluateMockAnswerController(req, res) {
    try {
        const { question, answer, role, difficulty, interviewType } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and answer are required." });
        }

        const evaluation = await evaluateMockAnswer({ question, answer, role, difficulty, interviewType });
        return res.status(200).json({ evaluation });
    } catch (error) {
        return handleAiError(res, error, "Failed to evaluate answer.");
    }
}

/**
 * @description Controller to analyze resume for ATS readiness and actionable recommendations
 */
async function analyzeResumeController(req, res) {
    try {
        let resumeText = req.body.resumeText;

        if (req.file) {
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = parsed.text;
        }

        if (!resumeText) {
            return res.status(400).json({ message: "Resume file or resume text is required." });
        }

        const analysis = await analyzeResumeDetails({
            resumeText,
            targetRole: req.body.targetRole || "Software Engineer"
        });

        return res.status(200).json({ analysis, resumeText });
    } catch (error) {
        return handleAiError(res, error, "Failed to analyze resume.");
    }
}

/**
 * @description Controller to analyze job description and match skills
 */
async function analyzeJobDescriptionController(req, res) {
    try {
        const { jobDescription, resumeText } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." });
        }

        const analysis = await analyzeJobDescription({ jobDescription, resumeText });
        return res.status(200).json({ analysis });
    } catch (error) {
        return handleAiError(res, error, "Failed to analyze job description.");
    }
}

/**
 * @description Controller to get today's 3-question interview challenge
 */
async function getDailyChallengeController(req, res) {
    try {
        const targetRole = req.query.role || "Software Engineer";
        const challenge = await getDailyChallengeQuestions({ targetRole });
        return res.status(200).json({ challenge });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate daily challenge.");
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    askAiCoachController,
    evaluateMockAnswerController,
    analyzeResumeController,
    analyzeJobDescriptionController,
    getDailyChallengeController
}