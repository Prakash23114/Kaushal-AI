const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { callGeminiWithRetry } = require("./gemini.client");

/**
 * Zod validation schema for personalized 14-day roadmaps
 */
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

/**
 * Generate personalized 14-day interview preparation roadmap targeting candidate's weak areas
 */
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

module.exports = {
    personalizedRoadmapSchema,
    generatePersonalizedRoadmap
};
