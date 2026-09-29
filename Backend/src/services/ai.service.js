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
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash"
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
    const contextPrompt = `You are "Kaushal AI Coach", an expert technical interviewer, mentor, and placement advisor for software engineering and tech careers.
Candidate Context:
${context.targetRole ? `- Target Role: ${context.targetRole}` : ''}
${context.matchScore ? `- Profile Match Score: ${context.matchScore}%` : ''}
${context.title ? `- Target Position: ${context.title}` : ''}
${context.skillGaps?.length ? `- Identified Skill Gaps: ${context.skillGaps.map(g => `${g.skill} (${g.severity})`).join(', ')}` : ''}
${context.resume ? `- Resume Highlights: ${context.resume.slice(0, 1000)}...` : ''}

Your Mission:
- Answer interview prep questions with structured, realistic, and senior-level insights.
- For technical questions: explain core engineering concepts, architecture trade-offs, scalability, and code examples.
- For behavioral questions: guide the candidate to structure their answer using the STAR method (Situation, Task, Action, Result).
- For project questions: train them to defend engineering choices, explain system flow, and handle scale (e.g. 10k users).
- Provide feedback without generic fluff: pinpoint missing details and show exactly how to elevate their answer.
- Format responses cleanly with Markdown, bullet points, and code blocks where applicable.`;

    const chatContents = [
        { role: "user", parts: [{ text: `${contextPrompt}\n\nPlease respond to the user based on the above background.` }] },
        { role: "model", parts: [{ text: "Understood. I am Kaushal AI Coach, ready to help you master technical, project, and behavioral interviews. What would you like to prepare or review?" }] },
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
        console.warn("[AI Coach] Gemini unavailable, generating intelligent mentor guidance fallback:", error.message);
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
    confidence: z.enum(["High", "Moderate", "Needs Improvement"]).describe("Perceived answer confidence"),
    missingPoints: z.array(z.string()).describe("Important points, edge cases, or trade-offs omitted"),
    improvementSuggestions: z.array(z.string()).describe("Direct actionable suggestions to improve"),
    betterAnswerApproach: z.string().describe("A professional breakdown of how an ideal candidate would answer"),
    followUpQuestion: z.string().describe("A realistic follow-up question the interviewer would ask next")
});

async function evaluateMockAnswer({ question, answer, role = "Software Engineer", difficulty = "Intermediate", interviewType = "Technical" }) {
    const prompt = `You are a tough, realistic senior interviewer assessing a candidate's live interview response.
Interview Details:
- Role: ${role}
- Difficulty: ${difficulty}
- Category: ${interviewType}

Question Asked:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer with realistic industry standards. Do not give fake praise.
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

async function getDailyChallengeQuestions({ targetRole = "Full Stack Developer" }) {
    const today = new Date().toISOString().slice(0, 10);
    const normalizedRole = (targetRole || "default").toLowerCase().trim();
    const cacheKey = `${today}_${normalizedRole}`;

    // 1. Check memory cache: if already generated today for this role, return immediately!
    if (dailyChallengeCache.has(cacheKey)) {
        return dailyChallengeCache.get(cacheKey);
    }

    // 2. Check in-flight promise: if another request is currently generating it, share the same promise
    if (dailyChallengeInFlight.has(cacheKey)) {
        return await dailyChallengeInFlight.get(cacheKey);
    }

    // 3. Initiate single generation task
    const generationPromise = (async () => {
        try {
            const prompt = `You are an expert interview coach generating today's Daily Interview Challenge for: "${targetRole}".
Generate:
1. One realistic technical engineering question.
2. One behavioral scenario question.
3. One project defense question (architecture, scaling, or technical decisions).
Return ONLY valid JSON.`;

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
            // Deterministically select curated challenge by day of year so all users get the same challenge today
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            const fallbackChallenge = CURATED_DAILY_CHALLENGES[dayOfYear % CURATED_DAILY_CHALLENGES.length];
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
    getDailyChallengeQuestions
}