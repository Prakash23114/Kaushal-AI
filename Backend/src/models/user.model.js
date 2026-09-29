const mongoose = require("mongoose")
const authController = require("../controllers/auth.controller")
const { authMiddleware } = require("../middlewares/auth.middleware")
const { authRouter } = require("../routes/auth.routes")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
    },

    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true,
    },

    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel

