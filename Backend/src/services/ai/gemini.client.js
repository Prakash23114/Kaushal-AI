const { GoogleGenAI } = require("@google/genai");

/**
 * Initialize Google GenAI client
 */
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

/**
 * Fallback models for Gemini requests
 */
const GEMINI_MODELS = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.8-flash"
];

/**
 * Calls Gemini with fallback models, exponential backoff on 503, and quota protection on 429.
 *
 * @param {Object} params - Generation parameters (contents, config, etc.)
 * @param {number} maxRetries - Max retry attempts per model for transient errors
 * @returns {Promise<any>}
 */
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

module.exports = {
    ai,
    GEMINI_MODELS,
    callGeminiWithRetry
};
