const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const profileRouter = require("./routes/candidateProfile.routes");

const app = express();

// Trust reverse proxy (essential for Render / Heroku / HTTPS cookie handling)
app.set("trust proxy", 1);

// Allowed CORS origins
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    "https://kaushal-ai-phi.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
].filter(Boolean).map(url => url.replace(/\/$/, ""));

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        if (
            allowedOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith(".vercel.app") ||
            process.env.NODE_ENV !== "production"
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health Check & Root Endpoints
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        name: "Kaushal AI API Server",
        status: "healthy",
        version: "1.0.0"
    });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/profile", profileRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error("[Server Error]", err?.message || err);
    res.status(err.status || 500).json({
        message: err.message || "An unexpected server error occurred."
    });
});

module.exports = app;