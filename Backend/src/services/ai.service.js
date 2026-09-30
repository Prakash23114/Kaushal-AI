const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({

    matchScore: z.number().describe(
        "A professional profile-to-job match score from 0 to 100. " +
        "Evaluate the alignment between the candidate's demonstrated skills, " +
        "experience, projects, education, and the requirements of the job description. " +
        "Base the score only on evidence provided in the candidate information. " +
        "Do not assume skills or experience that are not mentioned."
    ),

    technicalQuestions: z.array(z.object({

        question: z.string().describe(
            "A realistic technical interview question specifically relevant to the " +
            "candidate's resume, projects, technical skills, and the target job. " +
            "Questions should test practical understanding rather than simple definitions."
        ),

        intention: z.string().describe(
            "The interviewer's purpose for asking the question. " +
            "Explain which technical competency, problem-solving ability, " +
            "engineering experience, or depth of understanding the interviewer is trying to evaluate."
        ),

        answer: z.string().describe(
            "A professional answer strategy for the candidate. " +
            "Explain the key concepts, technical points, examples, trade-offs, " +
            "and reasoning the candidate should cover. " +
            "The answer should help the candidate formulate their own response " +
            "rather than simply providing a memorized one-line answer."
        )

    })).describe(
        "A carefully selected set of realistic technical interview questions " +
        "tailored to the candidate's actual technical background and the target job. " +
        "Prioritize questions related to technologies, projects, architecture, " +
        "databases, APIs, system design, debugging, scalability, and practical engineering."
    ),

    behavioralQuestions: z.array(z.object({

        question: z.string().describe(
            "A realistic behavioral or situational interview question relevant to " +
            "the candidate's experience, projects, teamwork, leadership, challenges, " +
            "conflict resolution, ownership, communication, or career goals."
        ),

        intention: z.string().describe(
            "The behavioral competency the interviewer is attempting to evaluate, " +
            "such as communication, teamwork, leadership, ownership, adaptability, " +
            "problem-solving, decision-making, or handling failure."
        ),

        answer: z.string().describe(
            "A professional framework for answering the question. " +
            "Recommend relevant points and examples the candidate should discuss. " +
            "Where appropriate, use the STAR approach: Situation, Task, Action, and Result."
        )

    })).describe(
        "A set of realistic behavioral and situational interview questions " +
        "tailored to the candidate's background and the target role. " +
        "Questions should evaluate professional behavior, communication, teamwork, " +
        "leadership, ownership, adaptability, and problem-solving."
    ),

    skillGaps: z.array(z.object({

        skill: z.string().describe(
            "A specific technical or professional skill that is missing, " +
            "underdeveloped, or insufficiently demonstrated in the candidate's profile " +
            "when compared with the target job description."
        ),

        severity: z.enum([
            "low",
            "medium",
            "high"
        ]).describe(
            "The practical importance of the skill gap for the target role. " +
            "High means the skill is a major requirement of the role, " +
            "medium means it is useful or moderately important, and " +
            "low means it is beneficial but not essential."
        )

    })).describe(
        "A concise list of meaningful skill gaps identified by comparing " +
        "the candidate's demonstrated capabilities with the requirements of the target job. " +
        "Do not list technologies simply because they are absent from the resume; " +
        "include only gaps that are relevant to the target position."
    ),

    preparationPlan: z.array(z.object({

        day: z.number().describe(
            "The sequential day number of the interview preparation plan, starting from 1."
        ),

        focus: z.string().describe(
            "The primary topic or competency the candidate should focus on that day, " +
            "such as backend development, databases, system design, DSA, projects, " +
            "behavioral preparation, or mock interviews."
        ),

        tasks: z.array(z.string()).describe(
            "A practical list of specific preparation activities for the day. " +
            "Tasks should be actionable and achievable, such as revising a concept, " +
            "implementing a small feature, solving selected problems, reviewing a project, " +
            "or practicing interview questions."
        )

    })).describe(
        "A structured, realistic, day-by-day interview preparation roadmap. " +
        "The plan should prioritize the candidate's actual skill gaps and the most relevant " +
        "requirements of the target job. It should progress from knowledge revision " +
        "to practical application and finally interview simulation."
    ),

    title: z.string().describe(
        "The exact or most appropriate professional job title represented by the target job description, " +
        "such as Backend Developer, Full Stack Developer, Software Engineer, or AI Engineer."
    )

})


const GEMINI_MODELS = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.8-flash"
];

async function callGeminiWithRetry(params, maxRetries = 2) {
    let lastError = null;

    for (const model of GEMINI_MODELS) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await ai.models.generateContent({
                    model,
                    ...params
                });
            } catch (error) {
                lastError = error;
                const errMsg = error?.message || "";
                const status = error?.status || (errMsg.includes('"code":429') ? 429 : errMsg.includes('"code":503') ? 503 : 0);

                const isQuotaExhausted = status === 429 ||
                    errMsg.includes("RESOURCE_EXHAUSTED") ||
                    errMsg.includes("Quota exceeded") ||
                    errMsg.includes("free_tier_requests");

                const isUnavailable = status === 503 ||
                    errMsg.includes("high demand") ||
                    errMsg.includes("UNAVAILABLE");

                // If 429 Quota exhausted for this model:
                // NEVER retry on this model! Break immediately to the next fallback model.
                if (isQuotaExhausted) {
                    console.warn(`[Gemini API] Quota exhausted for model '${model}'. Switching to fallback model...`);
                    break;
                }

                // If 503 high demand spike:
                // Retry with exponential backoff on this model
                if (isUnavailable && attempt < maxRetries) {
                    const delayMs = (attempt + 1) * 1200 + Math.floor(Math.random() * 400);
                    console.warn(`[Gemini API] 503 high demand on model '${model}'. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})...`);
                    await new Promise(r => setTimeout(r, delayMs));
                    continue;
                }

                // For 404 (model deprecated/unavailable) or other errors, break to try next fallback model
                console.warn(`[Gemini API] Error on model '${model}' (status: ${status || 'unknown'}): ${errMsg.slice(0, 100)}. Trying fallback model...`);
                break;
            }
        }
    }

    // If all models in the fallback chain were exhausted or failed
    const errMsg = lastError?.message || "";
    const isQuotaExhausted = lastError?.status === 429 ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("Quota exceeded") ||
        errMsg.includes("free_tier_requests");

    const isUnavailable = lastError?.status === 503 ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE");

    if (isQuotaExhausted) {
        const quotaErr = new Error("Gemini free-tier daily request quota has been reached (20 requests limit). Please check your plan or try again later.");
        quotaErr.status = 429;
        quotaErr.code = "RESOURCE_EXHAUSTED";
        throw quotaErr;
    }

    if (isUnavailable) {
        const busyErr = new Error("Gemini AI service is currently experiencing high demand across all models. Please try again in a moment.");
        busyErr.status = 503;
        busyErr.code = "UNAVAILABLE";
        throw busyErr;
    }

    throw lastError;
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
You are a senior technical interviewer and recruitment specialist.

Your task is to generate a professional interview preparation report for a candidate
based strictly on the candidate's resume, self-description, and the target job description.

========================
CANDIDATE RESUME
========================

${resume}

========================
CANDIDATE SELF DESCRIPTION
========================

${selfDescription}

========================
TARGET JOB DESCRIPTION
========================

${jobDescription}

========================
YOUR OBJECTIVE
========================

Analyze the candidate's profile against the target role and generate a realistic,
professional, and actionable interview preparation report.

The report should help the candidate understand:

1. How closely their current profile aligns with the target role.
2. Which technical areas are likely to be tested.
3. Which projects and experiences the interviewer may ask about.
4. Which behavioral areas may be evaluated.
5. Which important skills or requirements are currently missing or weak.
6. What the candidate should study and practice before the interview.

========================
IMPORTANT INSTRUCTIONS
========================

1. Use ONLY information supported by the resume, self-description,
   and job description.

2. Do NOT invent companies, internships, projects, technologies,
   achievements, certifications, responsibilities, or work experience.

3. Questions should be realistic for an actual interview and should be
   appropriate for the candidate's experience level.

4. Prioritize questions based on the candidate's actual projects and technologies.
   For example, if the candidate has worked with Node.js, MongoDB, FastAPI,
   Kafka, WebSockets, microservices, or system design, create practical questions
   around those areas when relevant to the job.

5. Avoid generic questions unless they are genuinely relevant to the target role.

6. Technical questions should test understanding, implementation ability,
   architecture, debugging, scalability, databases, APIs, and engineering decisions
   where appropriate.

7. Behavioral questions should focus on communication, teamwork, leadership,
   ownership, challenges, failures, decision-making, adaptability, and project experience.

8. Skill gaps must be based on an actual comparison between the candidate profile
   and the job requirements. Do not treat every missing technology as a skill gap.

9. The preparation plan should prioritize the most important areas first
   and should be practical for interview preparation.

10. The candidate's project experience should be treated as a major source of
    potential interview questions.

11. For every suggested answer, provide an answer strategy and important points
    to mention rather than encouraging the candidate to memorize a fixed response.

12. Maintain a professional tone suitable for a software engineering interview report.

13. Keep the output concise enough to be useful while still providing meaningful detail.

14. Return ONLY valid JSON matching the provided schema.
`

    const response = await callGeminiWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    return JSON.parse(response.text)
}


async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch()

    const page = await browser.newPage()

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}


async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = z.object({

        html: z.string().describe(
            "Complete, self-contained HTML document for a professional, ATS-friendly resume. " +
            "The HTML must contain only the resume content and styling required to render " +
            "a polished 1-2 page PDF."
        )

    })

    const prompt = `
You are an expert technical resume writer and ATS resume specialist.

Create a professional, ATS-friendly resume tailored specifically to the target
job description using the candidate information provided below.

========================
CANDIDATE RESUME
========================

${resume}

========================
CANDIDATE SELF DESCRIPTION
========================

${selfDescription}

========================
TARGET JOB DESCRIPTION
========================

${jobDescription}

========================
RESUME REQUIREMENTS
========================

1. Preserve the candidate's factual information.

2. Do NOT invent:
   - Skills
   - Companies
   - Job titles
   - Experience
   - Projects
   - Achievements
   - Certifications
   - Technologies
   - Metrics
   - Responsibilities

3. Tailor the resume toward the target job by emphasizing the candidate's
   most relevant existing skills, projects, experience, and achievements.

4. Use professional software-engineering resume language.

5. Make the content sound naturally written by an experienced professional,
   not AI-generated.

6. Prioritize measurable achievements and technical impact where the candidate
   has already provided them.

7. Keep the resume concise and ideally within 1-2 A4 pages.

8. Use standard ATS-friendly section headings such as:
   - Summary
   - Technical Skills
   - Experience
   - Projects
   - Education
   - Leadership
   - Achievements
   - Certifications

9. Use relevant keywords from the job description only when they are supported
   by the candidate's actual background.

10. Do not use excessive graphics, icons, tables, multiple columns,
    progress bars, skill ratings, or decorative elements that could interfere
    with ATS parsing.

11. Use clean typography, consistent spacing, clear hierarchy,
    and subtle professional styling.

12. The resume should be easy for both ATS systems and human recruiters to read.

13. Focus on relevance rather than including unnecessary information.

14. The final HTML must be complete and directly renderable by Puppeteer.

15. Return ONLY a JSON object containing a single "html" field.

The HTML should contain:
- Proper HTML structure
- Embedded CSS
- Professional typography
- Clear section hierarchy
- Print-friendly A4 layout
- No external dependencies
- No JavaScript
`

    const response = await callGeminiWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

// ─────────────────────────────────────────────────────────────────────────────
// KAUSHAL AI COACH SERVICE
// ─────────────────────────────────────────────────────────────────────────────
async function askAiCoach({ messages, context = {} }) {
    const profile = context.candidateProfile || {};
    const role = context.targetRole || profile.targetRoles?.[0] || context.title || "Software Engineer";
    const projectsList = profile.projects?.map(p => `- ${p.title}: Technologies: ${p.techStack?.join(', ') || 'N/A'}. Description: ${p.description || ''}`).join('\n') || '';
    const weakAreasList = profile.weakAreas?.map(w => `- ${w.name} (${w.severity}): ${w.recommendation || ''}`).join('\n') || '';
    const skillsList = profile.extractedSkills?.join(', ') || '';

    const contextPrompt = `You are "Kaushal AI Coach", an expert technical interviewer, mentor, and placement advisor for software engineering careers.

CANDIDATE PROFILE CONTEXT:
- Target Role: ${role}
${profile.atsScore ? `- ATS Resume Score: ${profile.atsScore}%` : ''}
${skillsList ? `- Candidate Skills: ${skillsList}` : ''}
${projectsList ? `- Candidate Resume Projects:\n${projectsList}` : ''}
${weakAreasList ? `- Candidate Weak Areas to target:\n${weakAreasList}` : ''}
${context.matchScore ? `- Profile Match Score: ${context.matchScore}%` : ''}
${context.title ? `- Target Position: ${context.title}` : ''}
${context.skillGaps?.length ? `- Strategy Skill Gaps: ${context.skillGaps.map(g => `${g.skill} (${g.severity})`).join(', ')}` : ''}
${context.resume ? `- Resume Excerpt: ${context.resume.slice(0, 800)}...` : ''}

Your Mission:
- Provide deeply personalized interview advice based directly on THIS candidate's projects, skills, and weak areas.
- For technical questions: reference their tech stack (e.g. React, Node, MongoDB, Docker) and explain core concepts, architecture trade-offs, and scalability.
- For behavioral questions: guide them using the STAR framework (Situation, Task, Action, Result) drawing from their actual project background.
- For project defense: simulate real interviewer scrutiny on why they picked specific databases, frameworks, and how they handled bugs or scale.
- Point out concrete ways to address their specific weak areas.
- If the candidate asks "What should I improve?" or "Help me prepare", give tailored recommendations based on their weak areas, ATS score, and target role.
- Never give generic boilerplates when personalized candidate information is provided. Format cleanly with Markdown.`;

    const chatContents = [
        { role: "user", parts: [{ text: `${contextPrompt}\n\nPlease respond to the candidate.` }] },
        { role: "model", parts: [{ text: `Understood. I am your Kaushal AI Coach. I have your resume background, projects, and target role (${role}) in mind. How can I help you prepare today?` }] },
        ...messages.map(m => ({
            role: m.role === "assistant" || m.role === "model" ? "model" : "user",
            parts: [{ text: m.content }]
        }))
    ];

    try {
        const response = await callGeminiWithRetry({
            contents: chatContents
        });
        return response.text;
    } catch (error) {
        console.warn("[AI Coach] Gemini unavailable, generating personalized mentor guidance fallback:", error.message);
        const lastMsg = messages[messages.length - 1]?.content || "how to prepare for technical interview";
        return generateAiCoachFallback(lastMsg, context);
    }
}

function generateAiCoachFallback(prompt, context) {
    const role = context.targetRole || context.title || "Software Engineer";
    const lower = prompt.toLowerCase();

    if (lower.includes("behavioral") || lower.includes("tell me about") || lower.includes("conflict") || lower.includes("star")) {
        return `### 💡 Kaushal AI Coach: Behavioral Interview Framework (STAR)

For behavioral interviews targeting **${role}**, interviewers look for structured storytelling and measurable impact:

1. **Situation (15%)**: Set the context concisely. Mention the project, team size, and business stakes.
2. **Task (15%)**: Clearly define *your* responsibility and the specific roadblock or goal.
3. **Action (50%)**: Detail the technical and collaborative steps **you** took. Explain *why* you chose this approach over alternatives.
4. **Result (20%)**: Conclude with quantified impact (e.g., latency dropped by 35%, zero production incidents, shipped 2 days early).

> **Pro Tip**: Keep each answer under 2.5 minutes and focus on ownership rather than "we did this".`;
    }

    if (lower.includes("system design") || lower.includes("architecture") || lower.includes("scale") || lower.includes("database")) {
        return `### ⚙️ Kaushal AI Coach: System Design Blueprint for ${role}

When answering architectural and scalability questions:

- **Requirements Clarification**: Establish Functional Requirements vs Non-Functional Requirements (e.g. 100k DAU, p99 latency < 200ms, consistency vs availability).
- **Core Entities & API Design**: Define the schema, REST/gRPC endpoints, and payload formats.
- **High-Level Diagram**: Client ➔ CDN / Cloudflare ➔ API Gateway ➔ Load Balancer ➔ Application Instances ➔ Caching Layer (Redis) ➔ Database (Primary/Replica) ➔ Message Queue (Kafka/RabbitMQ) for asynchronous workers.
- **Deep Dive & Bottlenecks**: Discuss database indexing, partitioning/sharding, cache invalidation strategies, and failure isolation.`;
    }

    return `### 🎯 Kaushal AI Coach Strategy for ${role}

Here is a focused checklist for your current preparation:

1. **Core Fundamentals**: Review data structures, concurrency, asynchronous patterns, and API contract design.
2. **Project Defense**: Be prepared to explain:
   - Why you selected your database (SQL vs NoSQL trade-offs).
   - How you handle authentication, session security, and authorization.
   - What happens when a downstream service or network call fails (circuit breakers, retries, dead-letter queues).
3. **Mock Practice**: Complete today's **Daily Challenge** in the dashboard to practice articulating concise answers.

What specific question or technical topic would you like to drill down next?`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK INTERVIEW EVALUATOR SERVICE
// ─────────────────────────────────────────────────────────────────────────────
const mockEvaluationSchema = z.object({
    score: z.number().min(0).max(100).describe("Overall score (0-100) based strictly on candidate's answer quality"),
    technicalAccuracy: z.number().min(0).max(100).describe("Technical depth, correctness, and accuracy (0-100)"),
    communication: z.number().min(0).max(100).describe("Clarity, structure, and articulation (0-100)"),
    answerStructure: z.string().describe("Evaluation of structure (e.g., STAR framework for behavioral, systematic approach for technical)"),
    confidence: z.enum(["High", "Moderate", "Needs Improvement", "Low"]).describe("Perceived answer confidence"),
    missingPoints: z.array(z.string()).describe("Important points, edge cases, or trade-offs omitted"),
    improvementSuggestions: z.array(z.string()).describe("Direct actionable suggestions to improve"),
    betterAnswerApproach: z.string().describe("A professional breakdown of how an ideal candidate would answer"),
    followUpQuestion: z.string().describe("A realistic follow-up question the interviewer would ask next")
});

async function evaluateMockAnswer({ question, answer, role = "Software Engineer", difficulty = "Intermediate", interviewType = "Technical", jobDescription = "" }) {
    const prompt = `You are a tough, realistic senior interviewer assessing a candidate's live interview response.
Interview Details:
- Role: ${role}
- Difficulty: ${difficulty}
- Category: ${interviewType}
${jobDescription ? `- Target Job Context: ${jobDescription.slice(0, 300)}` : ''}

Question Asked:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer with realistic industry standards. Assess whether the answer covers algorithmic complexity, trade-offs, architecture, and edge cases where applicable. Do not give fake praise.
Return ONLY valid JSON matching the schema.`;

    try {
        const response = await callGeminiWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(mockEvaluationSchema)
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.warn("[Mock Evaluation] Gemini unavailable, generating heuristic evaluation fallback:", error.message);
        return generateHeuristicMockEvaluation(question, answer, role, difficulty, interviewType);
    }
}

function generateHeuristicMockEvaluation(question, answer, role, difficulty, interviewType) {
    const words = answer.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let score = 70;
    let technicalAccuracy = 72;
    let communication = 70;
    let confidence = "Moderate";

    if (wordCount < 20) {
        score = 45;
        technicalAccuracy = 50;
        communication = 48;
        confidence = "Needs Improvement";
    } else if (wordCount > 60) {
        score = 82;
        technicalAccuracy = 84;
        communication = 82;
        confidence = "High";
    }

    return {
        score,
        technicalAccuracy,
        communication,
        answerStructure: interviewType === "Behavioral"
            ? "Follows general situation context, but should more explicitly emphasize quantified results."
            : "Addresses core logic; would benefit from stating edge cases and performance complexity.",
        confidence,
        missingPoints: [
            "Discussion of trade-offs and alternative implementation approaches.",
            "Specific real-world error handling, failure scenarios, and latency considerations."
        ],
        improvementSuggestions: [
            "Lead with a concise summary sentence before diving into deeper architectural details.",
            "Reference concrete metrics (e.g. latency, memory impact, throughput) to validate engineering choices."
        ],
        betterAnswerApproach: `An exemplary response should first state the high-level concept clearly, explain the underlying mechanism, and then discuss concrete production implications and trade-offs.`,
        followUpQuestion: `How would your solution behave under heavy concurrency or unexpected database latency?`
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUME ANALYZER SERVICE
// ─────────────────────────────────────────────────────────────────────────────
const resumeAnalysisSchema = z.object({
    atsScore: z.number().min(0).max(100).describe("ATS compatibility score 0-100"),
    technicalStrength: z.number().min(0).max(100).describe("Demonstration of technical depth 0-100"),
    projectStrength: z.number().min(0).max(100).describe("Impact, metrics, and architecture of projects 0-100"),
    roleRelevance: z.number().min(0).max(100).describe("Suitability for target role 0-100"),
    extractedSkills: z.array(z.string()).describe("Key skills found in the resume"),
    missingKeywords: z.array(z.string()).describe("High-impact keywords missing for the target role"),
    weakSections: z.array(z.object({
        section: z.string(),
        issue: z.string(),
        recommendation: z.string()
    })).describe("Sections needing revision with specific fixes"),
    actionableSuggestions: z.array(z.string()).describe("Specific actionable suggestions to elevate the resume")
});

async function analyzeResumeDetails({ resumeText, targetRole = "Software Engineer" }) {
    const prompt = `You are a senior technical recruiter and ATS specialist.
Analyze this resume for the target role: "${targetRole}".

Resume Content:
${resumeText}

Evaluate ATS compatibility, technical depth, project impact, missing keywords, weak sections, and actionable improvement steps.
Return ONLY valid JSON.`;

    const response = await callGeminiWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeAnalysisSchema)
        }
    });

    return JSON.parse(response.text);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE RESUME PARSER (CANDIDATE PROFILE EXTRACTION)
// ─────────────────────────────────────────────────────────────────────────────
const comprehensiveResumeSchema = z.object({
    atsScore: z.number().min(0).max(100).describe("Strict ATS score 0-100 based on keyword match, structure, and depth"),
    technicalStrength: z.number().min(0).max(100).describe("Demonstration of technical depth 0-100"),
    projectStrength: z.number().min(0).max(100).describe("Impact, metrics, and architecture of projects 0-100"),
    roleRelevance: z.number().min(0).max(100).describe("Suitability for target role 0-100"),
    formattingScore: z.number().min(0).max(100).describe("Layout clarity, readability, and ATS machine parseability 0-100"),
    extractedSkills: z.array(z.string()).describe("All actual technical skills, tools, languages, and frameworks explicitly found in the resume"),
    projects: z.array(z.object({
        title: z.string().describe("Real project name found on the resume"),
        techStack: z.array(z.string()).describe("Technologies used in this project"),
        description: z.string().describe("Clear summary of what this project does and problems it solves"),
        keyHighlights: z.array(z.string()).describe("Key accomplishments, metrics, or technical highlights")
    })).describe("All distinct projects detected in the candidate's resume"),
    experience: z.array(z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        duration: z.string().default(""),
        summary: z.string().default("")
    })).default([]),
    education: z.array(z.object({
        institution: z.string().default(""),
        degree: z.string().default(""),
        year: z.string().default("")
    })).default([]),
    certifications: z.array(z.string()).default([]),
    missingSkills: z.array(z.string()).describe("Important skills missing from this resume for the candidate's target roles"),
    missingKeywords: z.array(z.string()).describe("ATS keywords missing for standard hiring filters"),
    weakAreas: z.array(z.object({
        name: z.string().describe("Specific skill or concept where candidate demonstrates limited evidence or gaps"),
        severity: z.enum(["high", "medium", "low"]).describe("Importance of this gap for engineering placement"),
        recommendation: z.string().describe("Actionable advice on what to study or build")
    })).describe("3 to 6 actual weaknesses or gaps detected from this specific resume"),
    strengths: z.array(z.string()).describe("3 to 5 real strengths demonstrated by this candidate"),
    recommendations: z.array(z.string()).describe("Specific recommendations to elevate the resume"),
    targetRoles: z.array(z.string()).describe("2 to 4 recommended job titles best suited for this candidate"),
    competencyScores: z.object({
        technicalSkills: z.number().min(0).max(100),
        behavioral: z.number().min(0).max(100),
        communication: z.number().min(0).max(100),
        projectArchitecture: z.number().min(0).max(100),
        problemSolving: z.number().min(0).max(100)
    })
});

function extractResumeHeuristics(resumeText, targetRole = "Software Engineer") {
    const text = resumeText.toLowerCase();

    // Known tech skills vocabulary
    const KNOWN_SKILLS = [
        "react", "node.js", "nodejs", "javascript", "typescript", "express", "mongodb", "python",
        "java", "c++", "c#", "go", "rust", "sql", "postgresql", "mysql", "redis", "docker", "kubernetes",
        "aws", "gcp", "azure", "graphql", "rest api", "html", "css", "sass", "scss", "tailwind",
        "redux", "zustand", "next.js", "nextjs", "vue", "angular", "git", "github", "linux",
        "ci/cd", "microservices", "system design", "dsa", "data structures", "algorithms",
        "jest", "puppeteer", "flutter", "react native", "django", "flask", "spring boot", "jwt"
    ];

    const extractedSkills = [];
    for (const skill of KNOWN_SKILLS) {
        if (text.includes(skill)) {
            // Capitalize appropriately
            const formatted = skill.length <= 4 ? skill.toUpperCase() : skill.charAt(0).toUpperCase() + skill.slice(1);
            extractedSkills.push(formatted);
        }
    }

    // Detect projects heuristically
    const projects = [];
    const lines = resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let inProjects = false;
    let currentProj = null;

    for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes("project") || lower.includes("personal projects") || lower.includes("key projects")) {
            inProjects = true;
            continue;
        }
        if (inProjects && (lower.includes("experience") || lower.includes("education") || lower.includes("skills") || lower.includes("certifications"))) {
            if (currentProj) projects.push(currentProj);
            inProjects = false;
            break;
        }

        if (inProjects) {
            // Check if line looks like a project title (short, contains words, not a bullet)
            if (line.length > 3 && line.length < 60 && !line.startsWith("•") && !line.startsWith("-") && !line.startsWith("*")) {
                if (currentProj) projects.push(currentProj);
                currentProj = {
                    title: line.replace(/[:|].*$/, "").trim(),
                    techStack: [],
                    description: line,
                    keyHighlights: []
                };
            } else if (currentProj) {
                if (line.toLowerCase().includes("tech") || line.toLowerCase().includes("tools")) {
                    const stack = line.replace(/^(tech(nologies)?|tools)?:?/i, "").split(/[,|•]/).map(s => s.trim()).filter(Boolean);
                    currentProj.techStack.push(...stack);
                } else {
                    currentProj.keyHighlights.push(line.replace(/^[•\-*]\s*/, ""));
                }
            }
        }
    }
    if (currentProj) projects.push(currentProj);

    // If no projects parsed from headings, create a detected project from resume context
    if (projects.length === 0) {
        const titleMatch = resumeText.match(/(?:Project|Application|System):\s*([^\n\r]+)/i);
        const title = titleMatch ? titleMatch[1].trim() : "Main Portfolio Project";
        projects.push({
            title: title.slice(0, 40),
            techStack: extractedSkills.slice(0, 4),
            description: `Core project utilizing ${extractedSkills.slice(0, 3).join(", ") || "full stack technologies"}.`,
            keyHighlights: ["Engineered responsive client architecture and integrated REST APIs.", "Designed database schema and secured endpoints."]
        });
    }

    // Determine missing skills based on modern expectations
    const CORE_BENCHMARKS = [
        { name: "Docker & Containerization", key: "docker", recommendation: "Learn containerizing applications with Docker and multi-stage builds." },
        { name: "Cloud Platforms (AWS / GCP)", key: "aws", recommendation: "Deploy full-stack services using AWS EC2, S3, and serverless lambdas." },
        { name: "System Design & Scalability", key: "system design", recommendation: "Study caching strategies with Redis, database sharding, and load balancing." },
        { name: "Unit & Integration Testing (Jest/Cypress)", key: "jest", recommendation: "Write comprehensive unit tests covering API edge cases and components." },
        { name: "CI/CD Pipelines (GitHub Actions)", key: "ci/cd", recommendation: "Automate build, linting, and automated test runners on pull requests." }
    ];

    const weakAreas = [];
    const missingSkills = [];
    for (const b of CORE_BENCHMARKS) {
        if (!text.includes(b.key)) {
            missingSkills.push(b.name);
            weakAreas.push({
                name: b.name,
                severity: weakAreas.length === 0 ? "high" : weakAreas.length === 1 ? "high" : "medium",
                recommendation: b.recommendation
            });
        }
    }

    // ATS score calculation: real score between 45 and 88 based on real evidence
    let ats = 50;
    if (extractedSkills.length >= 8) ats += 15;
    else if (extractedSkills.length >= 4) ats += 10;

    if (projects.length >= 2) ats += 15;
    else if (projects.length >= 1) ats += 10;

    if (text.includes("bachelor") || text.includes("b.tech") || text.includes("degree") || text.includes("computer science")) ats += 10;
    if (resumeText.length > 1200) ats += 5;
    ats = Math.min(Math.max(ats, 45), 88);

    return {
        atsScore: ats,
        technicalStrength: Math.min(ats + 4, 90),
        projectStrength: Math.min(ats + 2, 88),
        roleRelevance: Math.min(ats + 5, 92),
        formattingScore: 80,
        extractedSkills: extractedSkills.length > 0 ? extractedSkills : ["JavaScript", "HTML5", "CSS3", "Git"],
        projects,
        experience: [],
        education: [{ institution: "University / Institute", degree: "Computer Science / Engineering", year: "2024" }],
        certifications: [],
        missingSkills: missingSkills.slice(0, 4),
        missingKeywords: missingSkills.slice(0, 4),
        weakAreas: weakAreas.slice(0, 4),
        strengths: [
            `Demonstrated practical implementation with ${extractedSkills.slice(0, 3).join(", ") || "web technologies"}.`,
            "Hands-on project development experience evidenced in resume portfolio.",
            "Foundation in software development principles and modern workflows."
        ],
        recommendations: [
            "Quantify project impact with measurable metrics (e.g. latency, concurrent users, test coverage).",
            "Incorporate automated testing (Jest) and containerized deployment (Docker).",
            "Deepen system design articulation for scalable high-throughput architectures."
        ],
        targetRoles: ["Full Stack Developer", "Software Engineer", "Backend Developer"],
        competencyScores: {
            technicalSkills: Math.min(ats + 2, 88),
            behavioral: 70,
            communication: 72,
            projectArchitecture: Math.min(ats + 4, 86),
            problemSolving: 68
        }
    };
}

async function parseResumeComprehensive({ resumeText, targetRole = "Software Engineer" }) {
    const prompt = `You are a world-class technical recruiter and ATS parsing specialist.
Analyze this resume text comprehensively for the target role: "${targetRole}".

Extract:
1. All real technical skills.
2. All distinct projects with their tech stacks, descriptions, and achievements.
3. Experience, education, and certifications.
4. Genuine weak areas (e.g. Docker, AWS, testing, microservices, system design if missing or shallow).
5. ATS score and competency breakdown (0-100) based strictly on evidence provided. Do not invent fake skills.

Resume Text:
${resumeText}

Return ONLY valid JSON matching the schema.`;

    try {
        const response = await callGeminiWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(comprehensiveResumeSchema)
            }
        });

        const parsed = JSON.parse(response.text);
        // Ensure projects have title
        if (!parsed.projects || parsed.projects.length === 0) {
            const fallback = extractResumeHeuristics(resumeText, targetRole);
            parsed.projects = fallback.projects;
        }
        return parsed;
    } catch (error) {
        console.warn("[Resume Comprehensive Parse] Gemini unavailable, using intelligent heuristic parser:", error.message);
        return extractResumeHeuristics(resumeText, targetRole);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUME-GROUNDED MOCK INTERVIEW QUESTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
const mockQuestionsSchema = z.object({
    questions: z.array(z.string()).describe("A list of 3-5 challenging, realistic interview questions tailored specifically to candidate's projects, skills, and weak areas")
});

async function generateResumeSpecificMockQuestions({ candidateProfile = {}, strategy = null, role = "Software Engineer", difficulty = "Intermediate", interviewType = "Technical" }) {
    const targetRole = (strategy?.title) || role || "Software Engineer";
    const skills = candidateProfile.extractedSkills?.slice(0, 12).join(", ") || "JavaScript, React, Node.js, Python, SQL";
    const projects = candidateProfile.projects?.map(p => `Project: ${p.title} (Tech: ${p.techStack?.join(", ") || "Full Stack"})`).join("; ") || "Primary full stack application";
    const weakAreas = candidateProfile.weakAreas?.map(w => w.name).join(", ") || "System Design, Scalability, DSA";
    const jobDescSnippet = strategy?.jobDescription ? strategy.jobDescription.slice(0, 500) : "";
    const skillGaps = strategy?.skillGaps?.map(g => `${g.skill} (${g.severity})`).join(", ") || "";

    const prompt = `You are a tough, realistic senior engineering interviewer conducting a ${difficulty} ${interviewType} interview for the target role: "${targetRole}".

Target Role & Context:
- Target Role: ${targetRole}
${jobDescSnippet ? `- Target Job Description: ${jobDescSnippet}` : ''}
${skillGaps ? `- Strategy Skill Gaps: ${skillGaps}` : ''}
Candidate Background (from their verified resume):
- Technologies/Skills: ${skills}
- Actual Resume Projects: ${projects}
- Known Weak Areas: ${weakAreas}

Generate 4 to 5 realistic, high-signal interview questions that form a well-balanced interview:
1. DSA Conceptual Question: A conceptual Data Structures & Algorithms question relevant to ${targetRole} (e.g. comparing time/space complexity trade-offs, choosing optimal data structures like Hash Tables vs Balanced BSTs, queue vs stack semantics, graph/tree traversal choices, or memory/cache overhead).
2. DSA Problem-Solving Question: A practical problem-solving algorithmic question relevant to ${targetRole} (e.g. array/string manipulation, sliding window, searching, dynamic programming, or optimal algorithm design with time/space complexity expectations).
3. Technical & System Architecture: A technical depth question testing practical architecture, concurrency, caching, or backend/frontend trade-offs relevant to ${targetRole} and their listed skills (${skills}).
4. Project Defense: Directly interrogate the candidate's actual projects (${projects}), asking why specific technologies were chosen, how data flows, or how the system behaves under 10k concurrent users.
5. Behavioral / Scenario (or production incident): A STAR-method behavioral question or production troubleshooting challenge.

Ensure the questions are strictly relevant to "${targetRole}" and the candidate's profile. Do not make every question DSA; keep a balanced interview.
Return ONLY valid JSON matching the schema.`;

    try {
        const response = await callGeminiWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(mockQuestionsSchema)
            }
        });
        const parsed = JSON.parse(response.text);
        if (parsed?.questions?.length > 0) return parsed.questions;
    } catch (error) {
        console.warn("[Mock Questions] Gemini unavailable, using candidate-grounded fallback questions:", error.message);
    }

    // Intelligent role-aware candidate-grounded fallback
    const primaryProj = candidateProfile.projects?.[0]?.title || "Primary Application";
    const primaryTech = candidateProfile.extractedSkills?.[0] || "JavaScript";
    const secondaryTech = candidateProfile.extractedSkills?.[1] || "Node.js";
    const isDevOps = /devops|cloud|sre|infrastructure|platform/i.test(targetRole);
    const isAiMl = /ai|ml|machine learning|data science|nlp|deep learning/i.test(targetRole);
    const isFrontend = /frontend|ui|web developer|react|angular/i.test(targetRole);

    let dsaConceptual = `Explain the time and space complexity trade-offs between a Hash Table (O(1) average lookup) and a Self-Balancing Binary Search Tree (O(log n)). Under what memory constraints or worst-case scenarios would you prefer one over the other?`;
    let dsaProblem = `Given an unsorted array of request latencies, how would you design an algorithm to find the Kth largest latency in O(n) average time complexity without sorting the entire array?`;

    if (isDevOps) {
        dsaConceptual = `In build dependency graphs or task execution pipelines, how does Topological Sorting (Kahn's algorithm / DFS) work to detect circular dependencies? What is its time and space complexity?`;
        dsaProblem = `Design an algorithm using a Min-Heap or Sliding Window to calculate rolling 99th percentile response latencies over continuous streaming log events.`;
    } else if (isAiMl) {
        dsaConceptual = `Explain the time complexity and memory overhead of dense matrix multiplication vs sparse matrix representations. How does cache locality and memory layout impact performance?`;
        dsaProblem = `Design an efficient algorithm to perform K-nearest neighbor search across 100,000 high-dimensional embedding vectors using K-D trees or Approximate Nearest Neighbor graph techniques.`;
    } else if (isFrontend) {
        dsaConceptual = `How does the Virtual DOM tree diffing algorithm achieve O(n) heuristic time complexity instead of general tree edit distance O(n^3)? What are the core assumptions?`;
        dsaProblem = `Given a deeply nested UI component/state object with potential circular references, design an iterative or recursive algorithm to traverse and serialize it without exceeding call stack limits.`;
    }

    if (interviewType === "Behavioral") {
        return [
            `Tell me about a challenging technical roadblock you hit while developing ${primaryProj}. How did you isolate and resolve it?`,
            dsaConceptual,
            `Describe a situation where project requirements changed late in a development cycle for ${targetRole}. How did you adapt your architecture?`,
            `Tell me about a time you had to push back on a feature or deadline due to engineering constraints.`
        ];
    }

    if (interviewType === "Project Based") {
        return [
            `Walk me through the high-level architecture of ${primaryProj} and how data flows from the client to the database.`,
            `Why did you choose ${secondaryTech} and ${primaryTech} for ${primaryProj} instead of other frameworks or databases?`,
            dsaProblem,
            `What would happen if 10,000 concurrent users suddenly accessed ${primaryProj}? Where are your bottlenecks and how would you scale it?`,
            `If you had to rebuild ${primaryProj} from scratch today for ${targetRole}, what architectural trade-offs would you change?`
        ];
    }

    return [
        `In ${targetRole}, explain how you handle asynchronous operations, error boundaries, and state lifecycle in ${primaryTech}.`,
        dsaConceptual,
        dsaProblem,
        `In your project ${primaryProj}, how did you ensure data consistency, caching, and secure authentication under heavy load?`,
        `Describe a scenario where a downstream service fails in production. How would you architect circuit breaking and retry backoff?`
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT DEFENSE QUESTIONS GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
const projectDefenseSchema = z.object({
    questions: z.array(z.string()).describe("5 deep architectural and engineering defense questions specifically targeting this project")
});

async function generateProjectDefenseQuestions({ projectName, techStack, projectSummary, candidateProfile = {} }) {
    const prompt = `You are a principal software engineer interviewing a candidate about their core project: "${projectName}".
Project Details:
- Technologies: ${techStack || candidateProfile.extractedSkills?.join(", ") || "Full Stack"}
- Summary/Elevator Pitch: ${projectSummary || "Full stack web application"}

Generate 5 rigorous project defense questions covering:
1. Architectural decisions and why these specific technologies were chosen over alternatives.
2. Data flow, authentication, and state management.
3. Scaling to 10k+ concurrent users, bottlenecks, and caching.
4. The most complex bug or technical roadblock and how it was diagnosed.
5. What architectural choices they would change if rebuilding today.

Return ONLY valid JSON.`;

    try {
        const response = await callGeminiWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(projectDefenseSchema)
            }
        });
        const parsed = JSON.parse(response.text);
        if (parsed?.questions?.length > 0) return parsed.questions;
    } catch (error) {
        console.warn("[Project Defense] Gemini unavailable, using project-grounded fallback:", error.message);
    }

    return [
        `Walk me through the high-level architecture of ${projectName} and how data flows from client to database.`,
        `Why did you choose ${techStack || "your tech stack"} for ${projectName} over alternative databases and frameworks?`,
        `What happens if 10,000 concurrent users suddenly start interacting with ${projectName}? Where are the bottlenecks?`,
        `What was the single most difficult technical roadblock or production bug you encountered in ${projectName}, and how did you debug it?`,
        `If you had to rebuild ${projectName} from scratch today, what architectural decisions would you change and why?`
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSONALIZED ROADMAP GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
const personalizedRoadmapSchema = z.object({
    roleTitle: z.string(),
    summary: z.string(),
    days: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        objectives: z.string(),
        tasks: z.array(z.string()),
        drillQuestion: z.string()
    }))
});

async function generatePersonalizedRoadmap({ candidateProfile = {}, targetRole = "Software Engineer" }) {
    const weakAreas = candidateProfile.weakAreas?.map(w => w.name).join(", ") || "System Design, Scalability, Docker";
    const skills = candidateProfile.extractedSkills?.join(", ") || "JavaScript, React, Node.js";
    const projects = candidateProfile.projects?.map(p => p.title).join(", ") || "Portfolio Projects";

    const prompt = `You are a technical career coach designing a customized 14-day interview preparation roadmap for a candidate.
Target Role: "${targetRole}"
Candidate Skills: ${skills}
Candidate Projects: ${projects}
Identified Weak Areas: ${weakAreas}

Generate a day-by-day 14-day preparation plan.
Prioritize the candidate's actual weak areas (${weakAreas}) in the first 7 days, followed by project architecture defense (${projects}), system design, and mock interview drills.
Return ONLY valid JSON.`;

    try {
        const response = await callGeminiWithRetry({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(personalizedRoadmapSchema)
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.warn("[Personalized Roadmap] Gemini unavailable, generating dynamic plan fallback:", error.message);
        const weakList = candidateProfile.weakAreas?.map(w => w.name) || ["System Design", "Docker", "Database Indexing"];
        const projName = candidateProfile.projects?.[0]?.title || "Primary Project";

        return {
            roleTitle: targetRole,
            summary: `Personalized roadmap targeting ${weakList.slice(0, 3).join(", ")} and defending ${projName}.`,
            days: [
                {
                    day: 1,
                    focus: `${weakList[0] || "System Design"} Fundamentals`,
                    objectives: `Deep dive into ${weakList[0] || "scalability patterns"} and core concepts.`,
                    tasks: [`Study architectural trade-offs in ${weakList[0] || "system design"}`, `Write a concrete design diagram covering client-server communication`, `Prepare a 2-minute verbal explanation`],
                    drillQuestion: `Explain how you would architect a high-throughput solution using ${weakList[0] || "distributed systems"}.`
                },
                {
                    day: 2,
                    focus: `${weakList[1] || "Containerization & Cloud"} Deep Dive`,
                    objectives: `Master hands-on implementation and common interview questions for ${weakList[1] || "cloud deployment"}.`,
                    tasks: [`Build a containerized prototype or deployment script`, `Analyze common production pitfalls and latency bottlenecks`, `Review configuration best practices`],
                    drillQuestion: `What are the trade-offs of deploying with ${weakList[1] || "containers vs serverless"}?`
                },
                {
                    day: 3,
                    focus: `${candidateProfile.extractedSkills?.[0] || "JavaScript"} Advanced Engineering`,
                    objectives: `Master concurrency, memory management, and asynchronous execution.`,
                    tasks: [`Trace event loop microtasks vs macrotasks`, `Audit code for memory leaks and closure scope retention`, `Practice 3 asynchronous patterns`],
                    drillQuestion: `How does single-threaded concurrency operate under heavy I/O?`
                },
                {
                    day: 4,
                    focus: `${projName} Architecture Defense`,
                    objectives: `Practice answering high-stakes interviewer questions on ${projName}.`,
                    tasks: [`Document client-to-database data flow`, `Formulate defense for why you chose your tech stack`, `Identify top 3 performance bottlenecks under 10k users`],
                    drillQuestion: `Why did you select your specific database and framework for ${projName}?`
                },
                {
                    day: 5,
                    focus: "Database Query Optimization & Indexing",
                    objectives: "Master B-tree indexing, ESR rule, and aggregation pipelines.",
                    tasks: ["Run explain() on slow queries", "Design compound indexes for multi-field filtering", "Review ACID transactions vs eventual consistency"],
                    drillQuestion: "When does an index degrade write performance, and how do you optimize it?"
                },
                {
                    day: 6,
                    focus: "RESTful API Security & Auth",
                    objectives: "Implement token validation, rate limiting, and defensive security.",
                    tasks: ["Review JWT session storage, CSRF, and XSS mitigations", "Implement rate limiters and helmet headers", "Design idempotent API endpoints"],
                    drillQuestion: "How do you securely handle authentication across distributed microservices?"
                },
                {
                    day: 7,
                    focus: "Mid-Point Mock Interview & Self Evaluation",
                    objectives: "Complete a full AI Mock Interview session in Kaushal AI.",
                    tasks: ["Complete a 15-minute Technical Mock Interview", "Review AI evaluation feedback and missing concepts", "Iterate on weak responses"],
                    drillQuestion: "Explain the architecture of your most challenging feature."
                }
            ]
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB DESCRIPTION ANALYZER SERVICE
// ─────────────────────────────────────────────────────────────────────────────
const jdAnalysisSchema = z.object({
    roleTitle: z.string().describe("Target role title extracted from the job description"),
    experienceLevel: z.string().describe("Expected experience level, e.g. Entry, Mid, Senior"),
    requiredSkills: z.array(z.string()).describe("Mandatory technical and professional skills"),
    preferredSkills: z.array(z.string()).describe("Bonus / nice-to-have skills"),
    responsibilities: z.array(z.string()).describe("Key day-to-day responsibilities"),
    matchedSkills: z.array(z.string()).describe("Skills present in candidate profile matching the JD"),
    missingSkills: z.array(z.string()).describe("Skills required by JD that candidate lacks"),
    partiallyMatchedSkills: z.array(z.string()).describe("Adjacent or related skills"),
    preparationRecommendations: z.array(z.string()).describe("Top priority study and practice areas for this job")
});

async function analyzeJobDescription({ jobDescription, resumeText = "" }) {
    const prompt = `You are an elite technical hiring manager.
Analyze this Job Description and compare it with the candidate's profile (if provided).

Target Job Description:
${jobDescription}

Candidate Profile / Resume:
${resumeText || "No resume provided yet. Analyze JD requirements comprehensively."}

Return ONLY valid JSON matching the schema.`;

    const response = await callGeminiWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(jdAnalysisSchema)
        }
    });

    return JSON.parse(response.text);
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY CHALLENGE GENERATOR SERVICE (WITH CACHING & DEDUPLICATION)
// ─────────────────────────────────────────────────────────────────────────────
const dailyChallengeSchema = z.object({
    technical: z.object({
        question: z.string(),
        topic: z.string(),
        difficulty: z.string(),
        hints: z.string()
    }),
    behavioral: z.object({
        question: z.string(),
        competency: z.string(),
        starGuidance: z.string()
    }),
    project: z.object({
        question: z.string(),
        scenario: z.string(),
        expectedDefense: z.string()
    })
});

// Cache map: 'YYYY-MM-DD_role' -> challenge object
const dailyChallengeCache = new Map();
// In-flight deduplication map: 'YYYY-MM-DD_role' -> Promise<challenge>
const dailyChallengeInFlight = new Map();

// Curated rotating challenge bank for fallback / offline
const CURATED_DAILY_CHALLENGES = [
    {
        technical: {
            question: "How does Node.js event loop handle asynchronous I/O and process.nextTick vs setImmediate?",
            topic: "Event Loop & Concurrency",
            difficulty: "Intermediate",
            hints: "Think about the microtask queue, macrotask phases (timers, poll, check), and starvation risks."
        },
        behavioral: {
            question: "Describe a situation where you had to push back on a manager or product requirement with technical justification.",
            competency: "Technical Communication & Leadership",
            starGuidance: "Use the STAR method: explain the technical risk, data presented, and the compromise achieved."
        },
        project: {
            question: "How did you structure error handling and database transaction rollbacks in your most complex project?",
            scenario: "System Stability & Robustness",
            expectedDefense: "Explain global middleware, database session transactions, and graceful recovery."
        }
    },
    {
        technical: {
            question: "What is the difference between SQL indexing with B-Trees vs Hash indexes, and when would indexing hurt query performance?",
            topic: "Database Indexing & Query Optimization",
            difficulty: "Intermediate",
            hints: "Consider range queries, write/insert overhead, memory consumption, and table fragmentation."
        },
        behavioral: {
            question: "Tell me about a high-pressure production bug or outage you resolved. How did you triage and prevent recurrence?",
            competency: "Crisis Management & Ownership",
            starGuidance: "Highlight rapid isolation, calm communication, post-mortem root cause analysis, and permanent guardrails."
        },
        project: {
            question: "How do you protect your API endpoints from abuse, credential stuffing, and Distributed Denial of Service (DDoS)?",
            scenario: "Security & API Hardening",
            expectedDefense: "Discuss token validation, rate limiters (token bucket / Redis), CORS, input sanitation, and CDN firewalls."
        }
    },
    {
        technical: {
            question: "Explain how Redis caching strategies (Cache-Aside, Write-Through, Write-Behind) work and how you prevent cache stampedes.",
            topic: "Distributed Caching & High Throughput",
            difficulty: "Advanced",
            hints: "Discuss TTL jitter, mutex locks on cache miss, read-heavy workloads, and eventual consistency."
        },
        behavioral: {
            question: "Describe a time when you collaborated with a difficult stakeholder or non-technical colleague to ship an essential feature.",
            competency: "Collaboration & Empathy",
            starGuidance: "Focus on active listening, converting technical jargon into business value, and shared success metrics."
        },
        project: {
            question: "How would you re-architect your project to handle 10x traffic growth without exploding cloud infrastructure costs?",
            scenario: "Scalability & Architectural Trade-offs",
            expectedDefense: "Detail horizontal scaling, database read replicas, static asset CDN offloading, and background task queues."
        }
    }
];

async function getDailyChallengeQuestions({ targetRole = "Full Stack Developer", weakAreas = [], skills = [] }) {
    const today = new Date().toISOString().slice(0, 10);
    const topWeakArea = weakAreas?.[0]?.name || (typeof weakAreas[0] === 'string' ? weakAreas[0] : "");
    const normalizedRole = (targetRole || "default").toLowerCase().trim();
    const cacheKey = `${today}_${normalizedRole}_${topWeakArea.replace(/\s+/g, '_')}`;

    // 1. Check memory cache: if already generated today for this role/weak area, return immediately!
    if (dailyChallengeCache.has(cacheKey)) {
        return dailyChallengeCache.get(cacheKey);
    }

    // 2. Check in-flight promise
    if (dailyChallengeInFlight.has(cacheKey)) {
        return await dailyChallengeInFlight.get(cacheKey);
    }

    // 3. Initiate single generation task
    const generationPromise = (async () => {
        try {
            const prompt = `You are an expert interview coach generating today's Daily Interview Challenge for: "${targetRole}".
Candidate Context:
${topWeakArea ? `- Primary Weak Area to prioritize in technical question: "${topWeakArea}"` : ''}
${skills?.length ? `- Candidate Skills: ${skills.slice(0, 5).join(', ')}` : ''}

Generate:
1. One realistic technical engineering question (prioritize their weak area: "${topWeakArea || 'System Design'}" to help them strengthen it).
2. One behavioral scenario question (STAR framework).
3. One project defense question (architecture, scaling, or technical decisions).
Return ONLY valid JSON matching the schema.`;

            const response = await callGeminiWithRetry({
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(dailyChallengeSchema)
                }
            });

            const parsed = JSON.parse(response.text);
            dailyChallengeCache.set(cacheKey, parsed);
            return parsed;
        } catch (error) {
            console.warn(`[Daily Challenge] Gemini call unavailable (${error.message}). Using curated fallback for ${today}.`);
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const fallbackChallenge = CURATED_DAILY_CHALLENGES[dayOfYear % CURATED_DAILY_CHALLENGES.length];
            if (topWeakArea) {
                fallbackChallenge.technical.topic = topWeakArea;
                fallbackChallenge.technical.question = `Explain the core concepts and trade-offs of ${topWeakArea}, and how you would apply it to prevent latency or failure in production.`;
            }
            dailyChallengeCache.set(cacheKey, fallbackChallenge);
            return fallbackChallenge;
        } finally {
            dailyChallengeInFlight.delete(cacheKey);
        }
    })();

    dailyChallengeInFlight.set(cacheKey, generationPromise);
    return await generationPromise;
}

module.exports = {
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
};