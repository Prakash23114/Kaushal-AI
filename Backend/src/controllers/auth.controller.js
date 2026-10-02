const userModel = require("../models/user.model.js")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/backList.model.js")
const { sendRegistrationEmail, sendOtpEmail, sendPasswordResetEmail } = require("../services/email.service.js")


/**
 * @name registerUserController
 * @description Register a new user and dispatch a 6-digit OTP verification email
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedUsername = username.trim()

    const existingUser = await userModel.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
    })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const hash = await bcrypt.hash(password, 10)

    if (existingUser) {
        if (existingUser.isVerified) {
            return res.status(400).json({
                message: "An account already exists with this email address or username"
            })
        }

        // User started registration earlier but did not complete OTP verification
        existingUser.username = normalizedUsername
        existingUser.password = hash
        existingUser.otp = otp
        existingUser.otpExpiry = otpExpiry
        await existingUser.save()

        // Send fresh OTP email
        sendOtpEmail(existingUser.email, existingUser.username, otp).catch((err) => {
            console.error("[Auth] Failed to send OTP email on re-register:", err.message || err)
        })

        return res.status(200).json({
            message: "A 6-digit verification code has been sent to your email.",
            requiresVerification: true,
            email: existingUser.email
        })
    }

    // Create new unverified user record
    const user = await userModel.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hash,
        isVerified: false,
        otp,
        otpExpiry
    })

    // Send 6-digit OTP email
    sendOtpEmail(user.email, user.username, otp).catch((err) => {
        console.error("[Auth] Failed to send OTP email:", err.message || err)
    })

    return res.status(201).json({
        message: "Registration initiated! Please verify your email with the 6-digit code.",
        requiresVerification: true,
        email: user.email
    })
}

/**
 * @name verifyOtpController
 * @description Verify the 6-digit email OTP, activate user account, and issue session JWT
 * @access Public
 */
async function verifyOtpController(req, res) {
    const { email, otp } = req.body

    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and 6-digit OTP code are required"
        })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await userModel.findOne({ email: normalizedEmail })

    if (!user) {
        return res.status(404).json({
            message: "No account found with this email address"
        })
    }

    if (user.isVerified) {
        // User is already verified, issue session token
        const token = jwt.sign(
            { id: user._id.toString(), _id: user._id.toString(), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "4d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        })

        return res.status(200).json({
            message: "Account already verified",
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            }
        })
    }

    if (!user.otp || user.otp !== otp.toString().trim()) {
        return res.status(400).json({
            message: "Invalid verification code. Please check and try again."
        })
    }

    if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
        return res.status(400).json({
            message: "Verification code has expired. Please request a new code."
        })
    }

    // Activate user account
    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    // Send Kaushal AI welcome guide email upon successful verification
    sendRegistrationEmail(user.email, user.username).catch((err) => {
        console.error("[Auth] Welcome email send error:", err.message || err)
    })

    const token = jwt.sign(
        { id: user._id.toString(), _id: user._id.toString(), username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "4d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })

    return res.status(200).json({
        message: "Email verified successfully! Welcome to Kaushal AI.",
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name resendOtpController
 * @description Resend a new 6-digit OTP code to the user's email
 * @access Public
 */
async function resendOtpController(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "Email address is required"
        })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await userModel.findOne({ email: normalizedEmail })

    if (!user) {
        return res.status(404).json({
            message: "No account found with this email address"
        })
    }

    if (user.isVerified) {
        return res.status(400).json({
            message: "Your email is already verified. Please sign in."
        })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    sendOtpEmail(user.email, user.username, otp).catch((err) => {
        console.error("[Auth] Failed to resend OTP email:", err.message || err)
    })

    return res.status(200).json({
        message: "A new 6-digit verification code has been sent to your email.",
        email: user.email
    })
}

/* 
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
*/
async function loginUserController(req, res) {
    const { email, username, password } = req.body;
    const identifier = (email || username || "").trim();

    if (!identifier || !password) {
        return res.status(400).json({
            message: "Please enter both email/username and password"
        })
    }

    const normalizedIdentifier = identifier.toLowerCase()
    const user = await userModel.findOne({
        $or: [
            { email: normalizedIdentifier },
            { username: identifier },
            { username: normalizedIdentifier }
        ]
    })

    if (!user) {
        return res.status(400).json({
            message: "Account does not exist with this email address or username"
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    // Check if account is verified
    if (user.isVerified === false) {
        // Dispatch fresh OTP so they can complete verification right away
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        user.otp = otp
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        await user.save()

        sendOtpEmail(user.email, user.username, otp).catch((err) => {
            console.error("[Auth] Login verification code dispatch failed:", err.message || err)
        })

        return res.status(403).json({
            message: "Please verify your email address before logging in. A new 6-digit code has been sent to your email.",
            requiresVerification: true,
            email: user.email
        })
    }

    const token = jwt.sign(
        { id: user._id.toString(), _id: user._id.toString(), username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description Logout a user by blacklisting the JWT token
 * @access Public
 */

async function logoutUserController(req, res) {
    const token = req.cookies?.token

    if (token) {
        try {
            await tokenBlacklistModel.create({ token })
        } catch (e) {
            console.warn("Token blacklist warning:", e.message)
        }
    }
    res.clearCookie("token", { path: "/" })

    return res.status(200).json({
        message: "User logged out successfully"
    })
}


/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    try {
        // req.user is guaranteed and verified by authUser middleware
        let user = req.user

        if (!user && req.user?.id) {
            user = await userModel.findById(req.user.id).select("-password")
        }

        if (!user) {
            res.clearCookie("token", { path: "/" })
            return res.status(401).json({
                message: "User session expired or user not found. Please login again."
            })
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: (user._id || user.id).toString(),
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("getMeController error:", error)
        return res.status(500).json({
            message: "Failed to fetch user details",
            error: error.message
        })
    }
}

/**
 * @name sendTestEmailController
 * @description Send a test welcome email to verify nodemailer configuration
 * @access Public
 */
async function sendTestEmailController(req, res) {
    try {
        const { email, username } = req.body || {};
        const targetEmail = email || process.env.EMAIL_USER;
        const targetName = username || "Kaushal Candidate";

        if (!targetEmail) {
            return res.status(400).json({
                message: "No recipient email provided or EMAIL_USER not set"
            });
        }

        const result = await sendRegistrationEmail(targetEmail, targetName);

        if (result && result.success) {
            return res.status(200).json({
                message: "Test registration email sent successfully!",
                recipient: targetEmail,
                messageId: result.messageId
            });
        }

        return res.status(500).json({
            message: "Failed to send test email",
            error: result?.error || "Unknown email sending error"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Exception occurred while sending test email",
            error: error.message
        });
    }
}

/**
 * @name initiateGoogleLogin
 * @description Redirect user to Google OAuth2 consent screen
 * @access Public
 */
async function initiateGoogleLogin(req, res) {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback";

    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email",
        access_type: "offline",
        prompt: "select_account"
    });

    res.redirect(`${rootUrl}?${params.toString()}`);
}

/**
 * @name googleCallbackController
 * @description Handle OAuth2 callback from Google, exchange code for tokens, login/create user, set cookie
 * @access Public
 */
async function googleCallbackController(req, res) {
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const { code, error, error_description } = req.query;

    console.log("[Google Auth Callback] Query received:", { hasCode: !!code, error, error_description });

    if (error || !code) {
        console.warn("[Google Auth] OAuth error or cancellation:", { error, error_description });
        let userFacingError = "Google sign-in was cancelled";
        if (error === "access_denied") {
            userFacingError = "Google sign-in was cancelled. Please select your Google account and grant permissions to continue.";
        } else if (error_description) {
            userFacingError = error_description;
        } else if (error) {
            userFacingError = `Google authentication error: ${error}`;
        }
        return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(userFacingError)}`);
    }

    try {
        const redirectUri = process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback";

        // 1. Exchange authorization code for access & ID tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: "authorization_code"
            }).toString()
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error("[Google Auth] Token exchange failed:", tokenData);
            return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Failed to exchange authentication code with Google")}`);
        }

        // 2. Fetch Google user profile
        const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const googleUser = await userinfoResponse.json();

        if (!userinfoResponse.ok || !googleUser.email) {
            console.error("[Google Auth] Failed to fetch user info:", googleUser);
            return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Failed to retrieve Google profile information")}`);
        }

        const normalizedEmail = googleUser.email.toLowerCase().trim();

        // 3. Find or create user in MongoDB
        let user = await userModel.findOne({
            $or: [
                { googleId: googleUser.id },
                { email: normalizedEmail }
            ]
        });

        if (user) {
            // Update Google ID, avatar, and verify email
            if (!user.googleId) user.googleId = googleUser.id;
            if (!user.avatar && googleUser.picture) user.avatar = googleUser.picture;
            user.isVerified = true;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
        } else {
            // Generate a clean, unique username
            let baseUsername = (googleUser.name || normalizedEmail.split('@')[0])
                .replace(/[^a-zA-Z0-9_]/g, '')
                .toLowerCase();
            if (!baseUsername || baseUsername.length < 3) baseUsername = "candidate";

            let username = baseUsername;
            let count = 1;
            while (await userModel.findOne({ username })) {
                username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
                count++;
                if (count > 5) break;
            }

            const fallbackPassword = Math.random().toString(36).slice(-10) + "K@9!";
            const hash = await bcrypt.hash(fallbackPassword, 10);

            user = await userModel.create({
                username,
                email: normalizedEmail,
                password: hash,
                googleId: googleUser.id,
                avatar: googleUser.picture || null,
                isVerified: true
            });

            // Send welcome registration email asynchronously
            sendRegistrationEmail(user.email, user.username).catch((err) => {
                console.error("[Google Auth] Welcome email dispatch failed:", err.message || err);
            });
        }

        // 4. Issue JWT authentication cookie
        const token = jwt.sign(
            { id: user._id.toString(), _id: user._id.toString(), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "4d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        // 5. Redirect successfully authenticated user to dashboard
        return res.redirect(`${frontendUrl}/app/dashboard`);
    } catch (err) {
        console.error("[Google Auth] Callback exception:", err);
        return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("An error occurred during Google sign in")}`);
    }
}

/**
 * @name googleTokenLoginController
 * @description Verify Google credential ID token sent from client-side SDK and authenticate user
 * @access Public
 */
async function googleTokenLoginController(req, res) {
    const { credential, idToken } = req.body;
    const tokenToVerify = credential || idToken;

    if (!tokenToVerify) {
        return res.status(400).json({
            message: "Google credential/token is required"
        });
    }

    try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenToVerify}`);
        const payload = await verifyRes.json();

        if (!verifyRes.ok || !payload.email) {
            return res.status(400).json({
                message: "Invalid or expired Google token"
            });
        }

        const normalizedEmail = payload.email.toLowerCase().trim();

        let user = await userModel.findOne({
            $or: [
                { googleId: payload.sub },
                { email: normalizedEmail }
            ]
        });

        if (user) {
            if (!user.googleId) user.googleId = payload.sub;
            if (!user.avatar && payload.picture) user.avatar = payload.picture;
            user.isVerified = true;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
        } else {
            let baseUsername = (payload.name || normalizedEmail.split('@')[0])
                .replace(/[^a-zA-Z0-9_]/g, '')
                .toLowerCase();
            if (!baseUsername || baseUsername.length < 3) baseUsername = "candidate";

            let username = baseUsername;
            let count = 1;
            while (await userModel.findOne({ username })) {
                username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
                count++;
                if (count > 5) break;
            }

            const fallbackPassword = Math.random().toString(36).slice(-10) + "K@9!";
            const hash = await bcrypt.hash(fallbackPassword, 10);

            user = await userModel.create({
                username,
                email: normalizedEmail,
                password: hash,
                googleId: payload.sub,
                avatar: payload.picture || null,
                isVerified: true
            });

            sendRegistrationEmail(user.email, user.username).catch((err) => {
                console.error("[Google Auth] Welcome email dispatch failed:", err.message || err);
            });
        }

        const token = jwt.sign(
            { id: user._id.toString(), _id: user._id.toString(), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "4d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "Google authentication successful",
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error("[Google Auth] Token login exception:", err);
        return res.status(500).json({
            message: "Google authentication failed",
            error: err.message
        });
    }
}

/**
 * @name forgotPasswordController
 * @description Send 6-digit OTP code for password reset
 * @access Public
 */
async function forgotPasswordController(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email address is required"
        });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
        // Return 404 so UI can guide the user
        return res.status(404).json({
            message: "No account found with this email address"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    sendPasswordResetEmail(user.email, user.username, otp).catch((err) => {
        console.error("[Auth] Password reset email dispatch failed:", err.message || err);
    });

    return res.status(200).json({
        success: true,
        message: "A 6-digit password reset code has been sent to your email.",
        email: user.email
    });
}

/**
 * @name resetPasswordController
 * @description Reset user's password using the 6-digit OTP code
 * @access Public
 */
async function resetPasswordController(req, res) {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            message: "Email, reset code, and new password are required"
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
        return res.status(404).json({
            message: "No account found with this email address"
        });
    }

    if (!user.otp || user.otp !== otp.toString().trim()) {
        return res.status(400).json({
            message: "Invalid verification code. Please check and try again."
        });
    }

    if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
        return res.status(400).json({
            message: "Reset code has expired. Please request a new reset code."
        });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password has been reset successfully! You can now sign in with your new password."
    });
}

module.exports = {
    registerUserController,
    verifyOtpController,
    resendOtpController,
    loginUserController,
    logoutUserController,
    getMeController,
    sendTestEmailController,
    initiateGoogleLogin,
    googleCallbackController,
    googleTokenLoginController,
    forgotPasswordController,
    resetPasswordController
}