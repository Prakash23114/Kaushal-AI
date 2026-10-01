const { callGeminiWithRetry } = require("./gemini.client");

/**
 * Generate heuristic mentor advice when AI is unreachable
 */
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

/**
 * Ask Kaushal AI Coach with full context grounding
 */
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

module.exports = {
    askAiCoach,
    generateAiCoachFallback
};
