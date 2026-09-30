const pdfParse = require("pdf-parse");
const candidateProfileModel = require("../models/candidateProfile.model");
const interviewReportModel = require("../models/interviewReport.model");
const interviewSessionModel = require("../models/interviewSession.model");
const userActivityModel = require("../models/userActivity.model");
const questionPracticeModel = require("../models/questionPractice.model");
const { parseResumeComprehensive } = require("../services/ai.service");

/**
 * Helper to calculate dynamic consecutive day streak for a user
 */
async function calculateUserStreak(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Get all distinct practice activity dates for the user
    const activities = await userActivityModel.find({
        user: userId,
        activityType: { $in: ["daily_challenge", "mock_interview", "practice_question"] }
    }).sort({ date: -1 }).select("date -_id");
    if (!activities || activities.length === 0) return 0;

    const uniqueDates = [...new Set(activities.map(a => a.date))].sort().reverse();
    if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
        return 0; // Streak broken
    }

    let streak = 0;
    let expectedDate = new Date(uniqueDates[0]);

    for (const dStr of uniqueDates) {
        const currentDate = new Date(dStr);
        const diffDays = Math.round((expectedDate - currentDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
            streak++;
            expectedDate = currentDate;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Helper to compute dynamic readiness score from user's real data
 */
function calculateDynamicReadiness(profile, sessions, reports, totalQuestions) {
    if (!profile) return { score: 0, hasEnoughData: false, message: "Upload your resume to calculate readiness" };

    const ats = profile.atsScore || 0;
    const interviewCount = sessions.length;

    if (interviewCount === 0) {
        return {
            score: Math.round(ats * 0.75),
            hasEnoughData: false,
            message: "Complete your first interview to calculate full readiness"
        };
    }

    // Average interview score
    const avgInterview = Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / interviewCount);
    // Practice contribution: max 15 points (1 point per 2 questions up to 30)
    const practiceBonus = Math.min(Math.round(totalQuestions * 0.5), 15);

    // Weighted: 40% ATS, 45% Actual Interview Performance, 15% Practice consistency
    const totalScore = Math.min(Math.round((ats * 0.4) + (avgInterview * 0.45) + practiceBonus), 100);

    return {
        score: totalScore,
        hasEnoughData: true,
        message: `${sessions.length} interview session${sessions.length > 1 ? 's' : ''} evaluated`
    };
}

/**
 * Helper to compute dynamic competency analysis
 */
function calculateDynamicCompetencies(profile, sessions) {
    if (!profile) {
        return [
            { skill: 'Technical Skills', level: 0, color: 'var(--primary)' },
            { skill: 'Behavioral & STAR', level: 0, color: 'var(--accent-cyan)' },
            { skill: 'Communication Clarity', level: 0, color: 'var(--success)' },
            { skill: 'Project Architecture', level: 0, color: 'var(--secondary)' },
            { skill: 'Problem Solving & DSA', level: 0, color: 'var(--warning)' }
        ];
    }

    const baseScores = profile.competencyScores || {
        technicalSkills: 75,
        behavioral: 70,
        communication: 72,
        projectArchitecture: 76,
        problemSolving: 65
    };

    if (!sessions || sessions.length === 0) {
        return [
            { skill: 'Technical Skills', level: baseScores.technicalSkills || 0, color: 'var(--primary)' },
            { skill: 'Behavioral & STAR', level: baseScores.behavioral || 0, color: 'var(--accent-cyan)' },
            { skill: 'Communication Clarity', level: baseScores.communication || 0, color: 'var(--success)' },
            { skill: 'Project Architecture', level: baseScores.projectArchitecture || 0, color: 'var(--secondary)' },
            { skill: 'Problem Solving & DSA', level: baseScores.problemSolving || 0, color: 'var(--warning)' }
        ];
    }

    // Blend resume baseline (40%) with actual interview session evaluations (60%)
    const avgTech = Math.round(sessions.reduce((acc, s) => acc + (s.technicalScore || s.score || 0), 0) / sessions.length);
    const avgComm = Math.round(sessions.reduce((acc, s) => acc + (s.communicationScore || s.score || 0), 0) / sessions.length);
    const avgBeh = Math.round(sessions.reduce((acc, s) => acc + (s.behavioralScore || s.score || 0), 0) / sessions.length);
    const avgProj = Math.round(sessions.reduce((acc, s) => acc + (s.projectScore || s.score || 0), 0) / sessions.length);
    const avgProblem = Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length);

    return [
        {
            skill: 'Technical Skills',
            level: Math.round(((baseScores.technicalSkills || 70) * 0.4) + (avgTech * 0.6)),
            color: 'var(--primary)'
        },
        {
            skill: 'Behavioral & STAR',
            level: Math.round(((baseScores.behavioral || 70) * 0.4) + (avgBeh * 0.6)),
            color: 'var(--accent-cyan)'
        },
        {
            skill: 'Communication Clarity',
            level: Math.round(((baseScores.communication || 70) * 0.4) + (avgComm * 0.6)),
            color: 'var(--success)'
        },
        {
            skill: 'Project Architecture',
            level: Math.round(((baseScores.projectArchitecture || 70) * 0.4) + (avgProj * 0.6)),
            color: 'var(--secondary)'
        },
        {
            skill: 'Problem Solving & DSA',
            level: Math.round(((baseScores.problemSolving || 65) * 0.4) + (avgProblem * 0.6)),
            color: 'var(--warning)'
        }
    ];
}

/**
 * @name getMyProfileController
 * @description Get candidate profile for logged-in user
 */
async function getMyProfileController(req, res) {
    try {
        const profile = await candidateProfileModel.findOne({ user: req.user.id });
        return res.status(200).json({
            hasProfile: !!profile,
            profile: profile || null
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: "Failed to fetch candidate profile", error: error.message });
    }
}

/**
 * @name onboardingResumeController
 * @description Mandatory onboarding: upload resume PDF, extract text, run Gemini analysis, save CandidateProfile
 */
async function onboardingResumeController(req, res) {
    try {
        let resumeText = req.body.resumeText;
        let resumeFileName = "Resume.pdf";

        if (req.file) {
            resumeFileName = req.file.originalname || "Resume.pdf";
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = parsed.text;
        }

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({ message: "Resume PDF file or resume text is required." });
        }

        const targetRole = req.body.targetRole || "Software Engineer";

        // Perform Gemini analysis
        const analysis = await parseResumeComprehensive({
            resumeText: resumeText.trim(),
            targetRole
        });

        // Upsert CandidateProfile strictly for authenticated user
        const profile = await candidateProfileModel.findOneAndUpdate(
            { user: req.user.id },
            {
                user: req.user.id,
                resumeText: resumeText.trim(),
                resumeFileName,
                resumeUploadedAt: new Date(),
                atsScore: analysis.atsScore || 70,
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
                targetRoles: analysis.targetRoles || [targetRole],
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

        return res.status(201).json({
            message: "Candidate profile analyzed and saved successfully.",
            profile
        });
    } catch (error) {
        console.error("Resume Onboarding Error:", error);
        return res.status(500).json({ message: "Failed to analyze and save resume.", error: error.message });
    }
}

/**
 * @name getDashboardDataController
 * @description Real-time personalized dashboard metrics
 */
async function getDashboardDataController(req, res) {
    try {
        const userId = req.user.id;

        // 1. Fetch Candidate Profile
        const profile = await candidateProfileModel.findOne({ user: userId });

        // 2. Fetch Interview Strategies (InterviewReports)
        const reports = await interviewReportModel.find({ user: userId }).sort({ createdAt: -1 });

        // 3. Fetch Mock Interview Sessions
        const sessions = await interviewSessionModel.find({ user: userId }).sort({ createdAt: -1 });

        // 4. Calculate Questions Practiced
        const questionBankCount = await questionPracticeModel.countDocuments({ user: userId, isPracticed: true });
        const sessionQuestionCount = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
        const dailyChallengesCompleted = await userActivityModel.countDocuments({ user: userId, activityType: "daily_challenge" });
        const totalQuestionsPracticed = questionBankCount + sessionQuestionCount + (dailyChallengesCompleted * 3);

        // 5. Calculate Real Streak
        const streak = await calculateUserStreak(userId);

        // 6. Calculate Readiness Score
        const readiness = calculateDynamicReadiness(profile, sessions, reports, totalQuestionsPracticed);

        // 7. Calculate Competency Analysis
        const competencyAnalysis = calculateDynamicCompetencies(profile, sessions);

        return res.status(200).json({
            hasProfile: !!profile,
            profile: profile || null,
            readinessScore: readiness.score,
            readinessMessage: readiness.message,
            hasSufficientData: readiness.hasEnoughData,
            strategiesCount: reports.length,
            sessionsCount: sessions.length,
            questionsPracticed: totalQuestionsPracticed,
            streak,
            weakAreas: profile?.weakAreas || [],
            competencyAnalysis,
            recentStrategies: reports.slice(0, 3).map(r => ({
                _id: r._id,
                title: r.title,
                matchScore: r.matchScore,
                createdAt: r.createdAt
            })),
            recentSessions: sessions.slice(0, 3)
        });
    } catch (error) {
        console.error("Dashboard Data Error:", error);
        return res.status(500).json({ message: "Failed to load dashboard data", error: error.message });
    }
}

module.exports = {
    getMyProfileController,
    onboardingResumeController,
    getDashboardDataController
};
