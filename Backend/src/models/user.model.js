const mongoose = require("mongoose")


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
        required: false
    },

    googleId: {
        type: String,
        default: null
    },

    avatar: {
        type: String,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema)

module.exports = userModel

