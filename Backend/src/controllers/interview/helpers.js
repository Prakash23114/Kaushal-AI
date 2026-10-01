/**
 * Centralized error handler for AI-related operations
 *
 * @param {import("express").Response} res
 * @param {Error|any} error
 * @param {string} [fallbackMessage]
 */
function handleAiError(res, error, fallbackMessage) {
    console.error("AI Controller Error:", error?.message || error);

    const isQuota = error?.status === 429 ||
        error?.code === "RESOURCE_EXHAUSTED" ||
        error?.message?.includes("RESOURCE_EXHAUSTED") ||
        error?.message?.includes("quota") ||
        error?.message?.includes("free_tier_requests");

    if (isQuota) {
        return res.status(429).json({
            message: "Gemini AI daily request quota limit reached. Please check your plan or try again later.",
            code: "RESOURCE_EXHAUSTED"
        });
    }

    const isUnavailable = error?.status === 503 ||
        error?.code === "UNAVAILABLE" ||
        error?.message?.includes("high demand") ||
        error?.message?.includes("UNAVAILABLE");

    if (isUnavailable) {
        return res.status(503).json({
            message: "AI service is temporarily busy due to high demand. Please try again shortly.",
            code: "UNAVAILABLE"
        });
    }

    return res.status(500).json({
        message: fallbackMessage || "AI service encountered an unexpected error.",
        error: error.message
    });
}

module.exports = {
    handleAiError
};
