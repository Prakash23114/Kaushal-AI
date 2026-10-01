const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { callGeminiWithRetry } = require("./gemini.client");

/**
 * Zod validation schema for daily challenge
 */
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

/**
 * Generate or retrieve cached Daily Challenge questions
 */
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
    dailyChallengeSchema,
    getDailyChallengeQuestions,
    CURATED_DAILY_CHALLENGES
};
