const mongoose = require("mongoose");

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("❌ MONGO_URI environment variable is missing!");
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB Connected successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message || err);
    }
}

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB connection disconnected. Attempting reconnect...");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection runtime error:", err.message || err);
});

module.exports = connectToDB;