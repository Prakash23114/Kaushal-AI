import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
});

/**
 * =========================================================================
 * PROFILE & ONBOARDING APIS
 * =========================================================================
 */

export const getProfileMe = async () => {
    const response = await api.get("/api/profile/me");
    return response.data;
};

export const submitResumeOnboarding = async ({ resumeFile, resumeText, targetRole }) => {
    if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        if (targetRole) formData.append("targetRole", targetRole);
        const response = await api.post("/api/profile/onboarding", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } else {
        const response = await api.post("/api/profile/onboarding", { resumeText, targetRole });
        return response.data;
    }
};

export const updateCandidateResume = async ({ resumeFile, resumeText, targetRole }) => {
    if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        if (targetRole) formData.append("targetRole", targetRole);
        const response = await api.put("/api/profile/update-resume", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } else {
        const response = await api.put("/api/profile/update-resume", { resumeText, targetRole });
        return response.data;
    }
};

export const getDashboardData = async () => {
    const response = await api.get("/api/profile/dashboard");
    return response.data;
};

/**
 * =========================================================================
 * STRATEGY REPORT APIS
 * =========================================================================
 */

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    if (selfDescription) formData.append("selfDescription", selfDescription);
    if (resumeFile) formData.append("resume", resumeFile);

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });
    return response.data;
};

/**
 * =========================================================================
 * AI COACH API
 * =========================================================================
 */

export const askCoach = async ({ messages, context }) => {
    const response = await api.post("/api/interview/coach/chat", { messages, context });
    return response.data;
};

/**
 * =========================================================================
 * MOCK INTERVIEW APIS
 * =========================================================================
 */

export const getMockQuestions = async ({ role, difficulty, interviewType, strategyId }) => {
    const response = await api.post("/api/interview/mock/questions", { role, difficulty, interviewType, strategyId });
    return response.data;
};

export const evaluateMockAnswer = async ({ question, answer, role, difficulty, interviewType, strategyId }) => {
    const response = await api.post("/api/interview/mock/evaluate", { question, answer, role, difficulty, interviewType, strategyId });
    return response.data;
};

export const saveMockSession = async (sessionData) => {
    const response = await api.post("/api/interview/mock/save-session", sessionData);
    return response.data;
};

export const getAllMockSessions = async () => {
    const response = await api.get("/api/interview/mock/sessions");
    return response.data;
};

/**
 * =========================================================================
 * PROJECT DEFENSE APIS
 * =========================================================================
 */

export const getProjectDefenseQuestions = async ({ projectName, techStack, projectSummary }) => {
    const response = await api.post("/api/interview/project-defense/questions", { projectName, techStack, projectSummary });
    return response.data;
};

/**
 * =========================================================================
 * PREPARATION ROADMAP API
 * =========================================================================
 */

export const getPersonalizedRoadmap = async (role) => {
    const response = await api.get(`/api/interview/roadmap${role ? `?role=${encodeURIComponent(role)}` : ''}`);
    return response.data;
};

/**
 * =========================================================================
 * DAILY CHALLENGE APIS
 * =========================================================================
 */

export const getDailyChallenge = async (role) => {
    const response = await api.get(`/api/interview/daily-challenge${role ? `?role=${encodeURIComponent(role)}` : ''}`);
    return response.data;
};

export const submitDailyChallenge = async ({ evaluations }) => {
    const response = await api.post("/api/interview/daily-challenge/submit", { evaluations });
    return response.data;
};

/**
 * =========================================================================
 * PROGRESS ANALYTICS API
 * =========================================================================
 */

export const getAnalyticsData = async () => {
    const response = await api.get("/api/interview/analytics");
    return response.data;
};

/**
 * =========================================================================
 * QUESTION BANK APIS
 * =========================================================================
 */

export const getQuestionBankData = async () => {
    const response = await api.get("/api/interview/question-bank");
    return response.data;
};

export const toggleQuestionPracticed = async (questionData) => {
    const response = await api.post("/api/interview/question-bank/toggle-practiced", questionData);
    return response.data;
};

export const toggleQuestionBookmarked = async (questionData) => {
    const response = await api.post("/api/interview/question-bank/toggle-bookmark", questionData);
    return response.data;
};

/**
 * =========================================================================
 * RESUME & JOB DESCRIPTION ANALYZER APIS
 * =========================================================================
 */

export const analyzeResume = async ({ resumeFile, resumeText, targetRole }) => {
    if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        if (targetRole) formData.append("targetRole", targetRole);
        const response = await api.post("/api/interview/analyze-resume", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } else {
        const response = await api.post("/api/interview/analyze-resume", { resumeText, targetRole });
        return response.data;
    }
};

export const analyzeJobDescription = async ({ jobDescription, resumeText }) => {
    const response = await api.post("/api/interview/analyze-jd", { jobDescription, resumeText });
    return response.data;
};