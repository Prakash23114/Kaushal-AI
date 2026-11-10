const { GoogleGenAI } = require("@google/genai");

/**
 * Initialize Google GenAI client
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
    apiKey: apiKey || ""
});

/**
 * Fallback models for Gemini requests (prioritizes stable, official Google Gemini models)
 */
const configuredModel = process.env.GEMINI_MODEL?.trim();
const GEMINI_MODELS = [
    ...(configuredModel ? [configuredModel] : []),
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-3.8-flash",
    "gemini-3-flash-preview"
].filter((model, idx, self) => model && self.indexOf(model) === idx);

/**
 * Robust JSON parser that handles markdown code fences (```json ... ```)
 * and extracts valid JSON objects or arrays safely.
 *
 * @param {string} text
 * @param {any} [fallback=null]
 * @returns {any}
 */
function safeJsonParse(text, fallback = null) {
    if (!text || typeof text !== "string") return fallback;

    const trimmed = text.trim();

    try {
        return JSON.parse(trimmed);
    } catch {
        // 1. Strip markdown fences: ```json ... ``` or ``` ... ```
        const cleaned = trimmed
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        try {
            return JSON.parse(cleaned);
        } catch {
            // 2. Locate first '{' or '[' and last '}' or ']'
            const firstBrace = cleaned.indexOf("{");
            const firstBracket = cleaned.indexOf("[");
            let start = -1;
            if (firstBrace !== -1 && firstBracket !== -1) {
                start = Math.min(firstBrace, firstBracket);
            } else if (firstBrace !== -1) {
                start = firstBrace;
            } else if (firstBracket !== -1) {
                start = firstBracket;
            }

            const lastBrace = cleaned.lastIndexOf("}");
            const lastBracket = cleaned.lastIndexOf("]");
            const end = Math.max(lastBrace, lastBracket);

            if (start !== -1 && end !== -1 && end > start) {
                try {
                    return JSON.parse(cleaned.substring(start, end + 1));
                } catch {
                    // Fall through
                }
            }

            if (fallback !== null) return fallback;
            throw new Error(`Failed to parse AI JSON response: ${trimmed.slice(0, 150)}...`);
        }
    }
}

/**
 * Normalizes JSON schema for Google GenAI (removes incompatible $schema field)
 *
 * @param {Object} jsonSchema
 * @returns {Object}
 */
function sanitizeSchemaForGemini(jsonSchema) {
    if (!jsonSchema || typeof jsonSchema !== "object") return jsonSchema;
    const { $schema, ...clean } = jsonSchema;
    return clean;
}

/**
 * Calls Gemini with fallback models, exponential backoff on 503, and quota protection on 429.
 *
 * @param {Object} params - Generation parameters (contents, config, etc.)
 * @param {number} maxRetries - Max retry attempts per model for transient errors
 * @returns {Promise<any>}
 */
async function callGeminiWithRetry(params, maxRetries = 2) {
    let lastError = null;

    // Sanitize config.responseSchema if present
    const callParams = { ...params };
    if (callParams.config?.responseSchema) {
        callParams.config = {
            ...callParams.config,
            responseSchema: sanitizeSchemaForGemini(callParams.config.responseSchema)
        };
    }

    for (const model of GEMINI_MODELS) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await ai.models.generateContent({
                    model,
                    ...callParams
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
        const quotaErr = new Error("Gemini daily request quota has been reached. Please check your API quota or try again later.");
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

module.exports = {
    ai,
    GEMINI_MODELS,
    callGeminiWithRetry,
    safeJsonParse,
    sanitizeSchemaForGemini
};
