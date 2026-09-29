import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}

/**
 * @description Service for Kaushal AI Coach chat
 */
export const askCoach = async ({ messages, context }) => {
    const response = await api.post("/api/interview/coach/chat", { messages, context });
    return response.data;
}

/**
 * @description Service to evaluate mock interview answer
 */
export const evaluateMockAnswer = async ({ question, answer, role, difficulty, interviewType }) => {
    const response = await api.post("/api/interview/mock/evaluate", { question, answer, role, difficulty, interviewType });
    return response.data;
}

/**
 * @description Service to analyze resume
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
}

/**
 * @description Service to analyze job description
 */
export const analyzeJobDescription = async ({ jobDescription, resumeText }) => {
    const response = await api.post("/api/interview/analyze-jd", { jobDescription, resumeText });
    return response.data;
}

/**
 * @description Service to get daily challenge
 */
export const getDailyChallenge = async (role) => {
    const response = await api.get(`/api/interview/daily-challenge${role ? `?role=${encodeURIComponent(role)}` : ''}`);
    return response.data;
}