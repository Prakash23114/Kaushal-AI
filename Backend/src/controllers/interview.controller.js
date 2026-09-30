const pdfParse = require("pdf-parse");
const {
    generateInterviewReport,
    generateResumePdf,
    askAiCoach,
    evaluateMockAnswer,
    analyzeResumeDetails,
    analyzeJobDescription,
    getDailyChallengeQuestions,
    parseResumeComprehensive,
    generateResumeSpecificMockQuestions,
    generateProjectDefenseQuestions,
    generatePersonalizedRoadmap
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const candidateProfileModel = require("../models/candidateProfile.model");
const interviewSessionModel = require("../models/interviewSession.model");
const userActivityModel = require("../models/userActivity.model");
const jobAnalysisModel = require("../models/jobAnalysis.model");
const questionPracticeModel = require("../models/questionPractice.model");

function handleAiError(res, error, fallbackMessage) {
    console.error("AI Controller Error:", error?.message || error);

    const isQuota = error?.status === 429 ||
        error?.code === "RESOURCE_EXHAUSTED" ||
        error?.message?.includes("RESOURCE_EXHAUSTED") ||
        error?.message?.includes("quota") ||
        error?.message?.includes("free_tier_requests");

    if (isQuota) {
        return res.status(429).json({
            message: "Gemini AI daily request quota limit reached. Please check your plan or try again later.",
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

/**
 * @name askAiCoachController
 * @description Context-aware AI Coach grounded in user's CandidateProfile
 */
async function askAiCoachController(req, res) {
    try {
        const { messages, context = {} } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Messages array is required." });
        }

        // Fetch candidate profile and latest active strategy for authenticated user
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const latestStrategy = await interviewReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        const enrichedContext = {
            ...context,
            candidateProfile: candidateProfile || null,
            latestStrategy: latestStrategy || null
        };

        const reply = await askAiCoach({ messages, context: enrichedContext });
        return res.status(200).json({ reply });
    } catch (error) {
        return handleAiError(res, error, "AI Coach is currently unavailable.");
    }
}

/**
 * @name generateMockQuestionsController
 * @description Generate mock interview questions grounded in candidate's strategy, resume projects, and skills
 */
async function generateMockQuestionsController(req, res) {
    try {
        const { strategyId, role, difficulty = "Intermediate", interviewType = "Technical" } = req.body;

        let strategy = null;
        if (strategyId) {
            strategy = await interviewReportModel.findOne({ _id: strategyId, user: req.user.id });
        }
        if (!strategy) {
            // Pick latest strategy for user to ensure zero stale data from past strategies
            strategy = await interviewReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        }

        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const targetRole = role || strategy?.title || candidateProfile?.targetRoles?.[0] || "Software Engineer";

        const questions = await generateResumeSpecificMockQuestions({
            candidateProfile: candidateProfile || {},
            strategy,
            role: targetRole,
            difficulty,
            interviewType
        });

        return res.status(200).json({ questions, strategyId: strategy?._id || null, role: targetRole });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate interview questions.");
    }
}

/**
 * @name evaluateMockAnswerController
 */
async function evaluateMockAnswerController(req, res) {
    try {
        const { question, answer, role, difficulty, interviewType, strategyId } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and answer are required." });
        }

        let jobDescription = "";
        if (strategyId) {
            const strategy = await interviewReportModel.findOne({ _id: strategyId, user: req.user.id });
            if (strategy) jobDescription = strategy.jobDescription || "";
        }

        const evaluation = await evaluateMockAnswer({ question, answer, role, difficulty, interviewType, jobDescription });
        return res.status(200).json({ evaluation });
    } catch (error) {
        return handleAiError(res, error, "Failed to evaluate answer.");
    }
}

/**
 * @name saveMockSessionController
 * @description Save complete mock interview session to database
 */
async function saveMockSessionController(req, res) {
    try {
        const {
            strategyId,
            role,
            interviewType,
            difficulty,
            questions = [],
            answers = [],
            score = 0,
            technicalScore = 0,
            communicationScore = 0,
            behavioralScore = 0,
            projectScore = 0,
            evaluations = [],
            feedback = "",
            duration = 0
        } = req.body;

        const allowedConfidence = ["Low", "Moderate", "High", "Needs Improvement"];
        const sanitizedEvaluations = (evaluations || []).map(item => {
            let conf = item.confidence || "Moderate";
            if (!allowedConfidence.includes(conf)) {
                if (String(conf).toLowerCase().includes("need") || String(conf).toLowerCase().includes("low")) {
                    conf = "Needs Improvement";
                } else if (String(conf).toLowerCase().includes("high")) {
                    conf = "High";
                } else {
                    conf = "Moderate";
                }
            }
            return {
                ...item,
                confidence: conf
            };
        });

        const session = await interviewSessionModel.create({
            user: req.user.id,
            strategy: strategyId || undefined,
            role: role || "Software Engineer",
            interviewType: interviewType || "Technical",
            difficulty: difficulty || "Intermediate",
            questions,
            answers,
            score,
            technicalScore: technicalScore || score,
            communicationScore: communicationScore || score,
            behavioralScore: behavioralScore || score,
            projectScore: projectScore || score,
            evaluations: sanitizedEvaluations,
            feedback,
            duration
        });

        // Record user practice activity
        const today = new Date().toISOString().slice(0, 10);
        await userActivityModel.create({
            user: req.user.id,
            date: today,
            activityType: "mock_interview",
            metadata: { sessionId: session._id, questionsCount: questions.length, score }
        });

        return res.status(201).json({
            message: "Interview session recorded successfully.",
            session
        });
    } catch (error) {
        console.error("Save Mock Session Error:", error);
        return res.status(500).json({ message: "Failed to save interview session.", error: error.message });
    }
}

/**
 * @name getAllInterviewSessionsController
 */
async function getAllInterviewSessionsController(req, res) {
    try {
        const sessions = await interviewSessionModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({ sessions });
    } catch (error) {
        console.error("Get Sessions Error:", error);
        return res.status(500).json({ message: "Failed to fetch interview history.", error: error.message });
    }
}

/**
 * @name getProjectDefenseQuestionsController
 * @description Generate project defense questions based on candidate's detected projects
 */
async function getProjectDefenseQuestionsController(req, res) {
    try {
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });

        let { projectName, techStack, projectSummary } = req.body;

        // If not specified by user, auto-select their first detected resume project!
        if (!projectName && candidateProfile?.projects?.length > 0) {
            const firstProj = candidateProfile.projects[0];
            projectName = firstProj.title;
            techStack = firstProj.techStack?.join(", ") || "";
            projectSummary = firstProj.description || "";
        }

        projectName = projectName || "Main Web Application";

        const questions = await generateProjectDefenseQuestions({
            projectName,
            techStack,
            projectSummary,
            candidateProfile: candidateProfile || {}
        });

        return res.status(200).json({
            projectName,
            techStack,
            projectSummary,
            detectedProjects: candidateProfile?.projects || [],
            questions
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate project defense questions.");
    }
}

/**
 * @name getPersonalizedRoadmapController
 * @description Generate personalized preparation roadmap targeting candidate's weak areas
 */
async function getPersonalizedRoadmapController(req, res) {
    try {
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const latestReport = await interviewReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });

        if (!candidateProfile && !latestReport) {
            return res.status(200).json({
                hasRoadmap: false,
                message: "No personalized roadmap yet. Create a strategy to generate your roadmap."
            });
        }

        const targetRole = req.query.role || latestReport?.title || candidateProfile?.targetRoles?.[0] || "Software Engineer";

        const roadmap = await generatePersonalizedRoadmap({
            candidateProfile: candidateProfile || {},
            targetRole
        });

        return res.status(200).json({
            hasRoadmap: true,
            roadmap
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate preparation roadmap.");
    }
}

/**
 * @name getDailyChallengeController
 * @description Get daily challenge grounded in candidate's weak areas
 */
async function getDailyChallengeController(req, res) {
    try {
        const candidateProfile = await candidateProfileModel.findOne({ user: req.user.id });
        const targetRole = req.query.role || candidateProfile?.targetRoles?.[0] || "Full Stack Developer";

        const challenge = await getDailyChallengeQuestions({
            targetRole,
            weakAreas: candidateProfile?.weakAreas || [],
            skills: candidateProfile?.extractedSkills || []
        });

        // Check if user completed challenge today
        const today = new Date().toISOString().slice(0, 10);
        const completion = await userActivityModel.findOne({
            user: req.user.id,
            date: today,
            activityType: "daily_challenge"
        });

        return res.status(200).json({
            challenge,
            completedToday: !!completion,
            weakAreaGrounding: candidateProfile?.weakAreas?.[0]?.name || null
        });
    } catch (error) {
        return handleAiError(res, error, "Failed to generate daily challenge.");
    }
}

/**
 * @name submitDailyChallengeController
 * @description Record daily challenge completion and update streak
 */
async function submitDailyChallengeController(req, res) {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const { evaluations = {} } = req.body;

        await userActivityModel.findOneAndUpdate(
            { user: req.user.id, date: today, activityType: "daily_challenge" },
            {
                user: req.user.id,
                date: today,
                activityType: "daily_challenge",
                metadata: { evaluations }
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Daily challenge completed! Streak updated.",
            completedToday: true
        });
    } catch (error) {
        console.error("Submit Daily Challenge Error:", error);
        return res.status(500).json({ message: "Failed to record daily challenge.", error: error.message });
    }
}

/**
 * @name getAnalyticsController
 * @description Generate analytics charts based strictly on real DB records
 */
async function getAnalyticsController(req, res) {
    try {
        const userId = req.user.id;

        const sessions = await interviewSessionModel.find({ user: userId }).sort({ createdAt: 1 });
        const reports = await interviewReportModel.find({ user: userId });
        const profile = await candidateProfileModel.findOne({ user: userId });
        const userActivity = await userActivityModel.findOne({ user: userId });
        const questionsPracticedCount = await questionPracticeModel.countDocuments({ user: userId, isPracticed: true });

        // Calculate actual streak
        let streak = 0;
        if (userActivity?.lastActiveDate) {
            const today = new Date().toDateString();
            const lastActive = new Date(userActivity.lastActiveDate).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastActive === today || lastActive === yesterday) {
                streak = userActivity.streak || 1;
            }
        }

        const sessionQuestionsCount = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
        const totalQuestions = questionsPracticedCount + sessionQuestionsCount;

        if (sessions.length === 0 && reports.length === 0) {
            return res.status(200).json({
                hasData: false,
                message: "No performance history yet. Complete your first mock interview to see analytics.",
                streak,
                totalQuestions,
                strategiesCount: 0,
                readinessScore: 0
            });
        }

        // 1. Weekly Progress Chart Data
        const weeklyDataMap = new Map();
        sessions.forEach((s, idx) => {
            const date = new Date(s.createdAt);
            const weekLabel = `Session ${idx + 1} (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
            weeklyDataMap.set(weekLabel, {
                week: weekLabel,
                score: s.score || 0,
                technical: s.technicalScore || s.score || 0,
                behavioral: s.behavioralScore || s.score || 0
            });
        });

        const weeklyProgressData = Array.from(weeklyDataMap.values());

        // 2. Category Practice Data
        const categoryCounts = {
            "Technical": 0,
            "Behavioral": 0,
            "Project Defense": 0,
            "System Design": 0
        };

        sessions.forEach(s => {
            const type = s.interviewType === "project" ? "Project Defense" : (s.interviewType || "Technical");
            categoryCounts[type] = (categoryCounts[type] || 0) + (s.questions?.length || 1);
        });

        const categoryPracticeData = Object.keys(categoryCounts).map(cat => ({
            category: cat,
            practiced: categoryCounts[cat]
        }));

        // 3. Competency Radar Data
        const avgTech = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.technicalScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.technicalSkills || 0;
        const avgComm = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.communicationScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.communication || 0;
        const avgBeh = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.behavioralScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.behavioral || 0;
        const avgProj = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.projectScore || s.score || 0), 0) / sessions.length) : profile?.competencyScores?.projectArchitecture || 0;
        const avgProblem = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length) : profile?.competencyScores?.problemSolving || 0;

        const skillRadarData = [
            { subject: "Technical Accuracy", score: avgTech },
            { subject: "STAR Communication", score: avgComm },
            { subject: "Project Architecture", score: avgProj },
            { subject: "Problem Solving", score: avgProblem },
            { subject: "Behavioral", score: avgBeh }
        ];

        // Calculated dynamic readiness
        const avgInterviewScore = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + (s.score || 0), 0) / sessions.length) : 0;
        const ats = profile?.atsScore || 0;
        let readinessScore = 0;
        if (sessions.length > 0) {
            readinessScore = Math.min(100, Math.round(
                (ats * 0.3) +
                (avgInterviewScore * 0.45) +
                (Math.min(streak * 3, 15)) +
                (Math.min(totalQuestions, 10))
            ));
        }

        return res.status(200).json({
            hasData: sessions.length > 0,
            hasStrategies: reports.length > 0,
            weeklyProgressData,
            categoryPracticeData,
            skillRadarData,
            totalInterviews: sessions.length,
            averageScore: avgInterviewScore,
            streak,
            totalQuestions,
            strategiesCount: reports.length,
            readinessScore,
            hasEnoughDataForReadiness: sessions.length > 0
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ message: "Failed to generate analytics.", error: error.message });
    }
}

/**
 * @name getQuestionBankController
 */
async function getQuestionBankController(req, res) {
    try {
        const userId = req.user.id;
        const candidateProfile = await candidateProfileModel.findOne({ user: userId });

        // Retrieve user's practice and bookmark status from DB
        const userPracticeRecords = await questionPracticeModel.find({ user: userId });
        const practicedMap = new Map();
        const bookmarkedMap = new Map();

        userPracticeRecords.forEach(r => {
            practicedMap.set(r.questionId, r.isPracticed);
            bookmarkedMap.set(r.questionId, r.isBookmarked);
        });

        return res.status(200).json({
            candidateSkills: candidateProfile?.extractedSkills || [],
            weakAreas: candidateProfile?.weakAreas || [],
            practicedMap: Object.fromEntries(practicedMap),
            bookmarkedMap: Object.fromEntries(bookmarkedMap)
        });
    } catch (error) {
        console.error("Question Bank Error:", error);
        return res.status(500).json({ message: "Failed to fetch question bank data.", error: error.message });
    }
}

/**
 * @name toggleQuestionPracticedController
 */
async function toggleQuestionPracticedController(req, res) {
    try {
        const userId = req.user.id;
        const { questionId, question, category, topic, difficulty } = req.body;

        let record = await questionPracticeModel.findOne({ user: userId, questionId });
        const newStatus = record ? !record.isPracticed : true;

        record = await questionPracticeModel.findOneAndUpdate(
            { user: userId, questionId },
            {
                user: userId,
                questionId,
                question: question || "Interview Question",
                category: category || "General",
                topic: topic || "",
                difficulty: difficulty || "Intermediate",
                isPracticed: newStatus,
                lastPracticedAt: newStatus ? new Date() : undefined
            },
            { upsert: true, new: true }
        );

        if (newStatus) {
            const today = new Date().toISOString().slice(0, 10);
            await userActivityModel.create({
                user: userId,
                date: today,
                activityType: "question_practiced",
                metadata: { questionId }
            });
        }

        const totalPracticed = await questionPracticeModel.countDocuments({ user: userId, isPracticed: true });

        return res.status(200).json({
            questionId,
            isPracticed: newStatus,
            totalPracticed
        });
    } catch (error) {
        console.error("Toggle Question Error:", error);
        return res.status(500).json({ message: "Failed to update practice status.", error: error.message });
    }
}

/**
 * @name toggleQuestionBookmarkedController
 */
async function toggleQuestionBookmarkedController(req, res) {
    try {
        const userId = req.user.id;
        const { questionId, question, category } = req.body;

        let record = await questionPracticeModel.findOne({ user: userId, questionId });
        const newStatus = record ? !record.isBookmarked : true;

        record = await questionPracticeModel.findOneAndUpdate(
            { user: userId, questionId },
            {
                user: userId,
                questionId,
                question: question || "Interview Question",
                category: category || "General",
                isBookmarked: newStatus
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            questionId,
            isBookmarked: newStatus
        });
    } catch (error) {
        console.error("Toggle Bookmark Error:", error);
        return res.status(500).json({ message: "Failed to update bookmark.", error: error.message });
    }
}

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
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    askAiCoachController,
    generateMockQuestionsController,
    evaluateMockAnswerController,
    saveMockSessionController,
    getAllInterviewSessionsController,
    getProjectDefenseQuestionsController,
    getPersonalizedRoadmapController,
    getDailyChallengeController,
    submitDailyChallengeController,
    getAnalyticsController,
    getQuestionBankController,
    toggleQuestionPracticedController,
    toggleQuestionBookmarkedController,
    analyzeResumeController,
    analyzeJobDescriptionController
};