const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/backList.model.js")
const userModel = require("../models/user.model.js")

/**
 * @name authMiddleware
 * @description authenticate the user, verifies the JWT token and attaches the verified user to the request object
 * @access Private
 */

async function authUser(req, res, next) {
    const authHeader = req.headers.authorization
    const token = req.cookies?.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null)

    if (!token) {
        return res.status(401).json({
            message: "Authentication token required. Please login."
        })
    }

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

        if (isTokenBlacklisted) {
            res.clearCookie("token", { path: "/" })
            return res.status(401).json({
                message: "Session expired or logged out. Please login again."
            })
        }

        let decode;
        try {
            decode = jwt.verify(token, process.env.JWT_SECRET)
        } catch (jwtErr) {
            res.clearCookie("token", { path: "/" })
            return res.status(401).json({
                message: "Token is invalid or expired. Please login again."
            })
        }

        const userId = decode?.id || decode?._id
        if (!userId) {
            res.clearCookie("token", { path: "/" })
            return res.status(401).json({
                message: "Malformed token. Please login again."
            })
        }

        // Verify the user actually exists in the database
        const user = await userModel.findById(userId).select("-password")

        if (!user) {
            // Token was cryptographically valid, but user document no longer exists in DB.
            // Clear the stale cookie so the browser stops looping with invalid credentials.
            res.clearCookie("token", { path: "/" })
            return res.status(401).json({
                message: "User session invalid or user no longer exists. Please login again."
            })
        }

        // Attach verified user and normalize id/_id for controllers
        req.user = user
        req.user.id = user._id.toString()
        next()
    } catch (err) {
        console.error("Auth middleware error:", err)
        return res.status(500).json({
            message: "Authentication error occurred"
        })
    }
}

module.exports = { authUser }