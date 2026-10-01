const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { callGeminiWithRetry } = require("./gemini.client");

/**
 * Zod validation schema for mock interview answer evaluations
 */
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

/**
 * Heuristic evaluation fallback when Gemini is unavailable
 */
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

/**
 * Evaluate candidate's mock interview answer
 */
async function evaluateMockAnswer({
    question,
    answer,
    role = "Software Engineer",
    difficulty = "Intermediate",
    interviewType = "Technical",
    jobDescription = ""
}) {
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

/**
 * Schema for mock interview questions
 */
const mockQuestionsSchema = z.object({
    questions: z.array(z.string()).describe("A list of 3-5 challenging, realistic interview questions tailored specifically to candidate's projects, skills, and weak areas")
});

/**
 * Generate interview questions grounded in candidate's strategy and resume profile
 */
async function generateResumeSpecificMockQuestions({
    candidateProfile = {},
    strategy = null,
    role = "Software Engineer",
    difficulty = "Intermediate",
    interviewType = "Technical"
}) {
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

/**
 * Project defense schema
 */
const projectDefenseSchema = z.object({
    questions: z.array(z.string()).describe("5 deep architectural and engineering defense questions specifically targeting this project")
});

/**
 * Generate 5 rigorous project defense questions
 */
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

module.exports = {
    mockEvaluationSchema,
    evaluateMockAnswer,
    generateHeuristicMockEvaluation,
    mockQuestionsSchema,
    generateResumeSpecificMockQuestions,
    projectDefenseSchema,
    generateProjectDefenseQuestions
};
