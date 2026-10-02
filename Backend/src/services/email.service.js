require("dotenv").config();
const nodemailer = require("nodemailer");

// Part 1: Set Up Nodemailer with OAuth2
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY ERROR:", error.message || error);
  } else {
    console.log("✅ SMTP AUTH SUCCESS: Email service ready");
  }
});

/**
 * Generic email sender using Kaushal AI transporter
 * @param {string} to Recipient email address
 * @param {string} subject Subject line
 * @param {string} text Plain text body fallback
 * @param {string} html HTML body content
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const sender = `"Kaushal AI" <${process.env.EMAIL_USER}>`;
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email Service] ✅ Message sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service] ❌ Error sending email to ${to}:`, error.message || error);
    return { success: false, error: error.message || error };
  }
};

/**
 * Send welcome registration email to a newly signed up user
 * @param {string} userEmail Recipient email address
 * @param {string} name User's username or full name
 */
async function sendRegistrationEmail(userEmail, name) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const dashboardUrl = `${clientUrl}/app/dashboard`;
  const displayName = name || "Learner";

  const subject = `Welcome to Kaushal AI, ${displayName}! 🚀 Prepare Smarter, Interview Better`;

  const text = `
Welcome to Kaushal AI, ${displayName}!

Prepare Smarter. Interview Better. Get Hired.

Hi ${displayName},

Thank you for creating an account with Kaushal AI! You're now equipped with industry-leading AI tools designed to analyze your profile, simulate realistic interview environments, and help you land your dream tech role.

Key Features:
- 🎙️ Realistic AI Mock Interviews: Live voice dictation, camera simulation, and multi-dimensional AI scoring.
- 📄 ATS Resume Diagnostics: Instant ATS score, keyword gap analysis, and tailored fixes.
- 🗺️ 14-Day Structured Roadmap: Day-by-day customized interview prep curriculum.
- 💡 Curated DSA & Aptitude Bank: High-frequency practice questions and optimal strategies.

Launch your dashboard to get started:
${dashboardUrl}

Best regards,
The Kaushal AI Team
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kaushal AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0f19; width: 100%; min-height: 100vh; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #111827; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <div style="display: inline-block; padding: 8px 18px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 9999px; margin-bottom: 16px;">
                <span style="color: #a78bfa; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">✨ Welcome to Kaushal AI</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                Prepare Smarter. Interview Better.
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 15px; color: #94a3b8;">
                Your AI-powered coach for cracking tech interviews
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px;">
              <p style="margin: 0 0 16px 0; font-size: 17px; line-height: 26px; color: #f8fafc;">
                Hi <strong style="color: #c084fc;">${displayName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #94a3b8;">
                Thank you for creating an account with <strong style="color: #ffffff;">Kaushal AI</strong>! You are now equipped with an end-to-end interview intelligence suite designed to formulate personalized preparation strategies, simulate realistic mock interviews, and build your hiring confidence.
              </p>

              <!-- Feature Highlights -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 16px; background-color: #1e293b; border-radius: 10px; border-left: 4px solid #8b5cf6;">
                    <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">
                      🎙️ Realistic AI Mock Interviews
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; line-height: 18px;">
                      Practice technical DSA, system design, and STAR behavioral rounds with speech dictation, live camera feed, and instant multi-dimensional evaluation.
                    </div>
                  </td>
                </tr>
                <tr><td height="12"></td></tr>
                <tr>
                  <td style="padding: 14px 16px; background-color: #1e293b; border-radius: 10px; border-left: 4px solid #6366f1;">
                    <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">
                      📄 ATS Resume Diagnostics
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; line-height: 18px;">
                      Compare your resume directly against target job descriptions to identify missing keywords, technical gaps, and metric-driven fixes.
                    </div>
                  </td>
                </tr>
                <tr><td height="12"></td></tr>
                <tr>
                  <td style="padding: 14px 16px; background-color: #1e293b; border-radius: 10px; border-left: 4px solid #10b981;">
                    <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">
                      🗺️ 14-Day Preparation Roadmap & Coach
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; line-height: 18px;">
                      Structured day-by-day milestones paired with a 24/7 AI mentor grounded in your specific resume and target roles.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Call To Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4); text-align: center;">
                      Launch Your Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                Need assistance? Feel free to reach out to us at any time.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0f172a; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #94a3b8;">
                Kaushal AI &bull; Your Personal AI Interview Coach
              </p>
              <p style="margin: 0; font-size: 12px; color: #475569;">
                If you did not create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await sendEmail(userEmail, subject, text, html);
}

/**
 * Send 6-digit OTP verification email for email verification
 * @param {string} userEmail Recipient email address
 * @param {string} name User's username or full name
 * @param {string} otp 6-digit numeric OTP code
 */
async function sendOtpEmail(userEmail, name, otp) {
  const displayName = name || "Candidate";
  const subject = `${otp} is your Kaushal AI verification code 🔐`;

  const text = `
Verify Your Email Address - Kaushal AI

Hi ${displayName},

Thank you for registering with Kaushal AI! Please use the following 6-digit verification code to complete your signup:

Verification Code: ${otp}

This code will expire in 10 minutes. If you did not sign up for Kaushal AI, please ignore this email.

Best regards,
The Kaushal AI Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Kaushal AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0f19; width: 100%; min-height: 100vh; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #111827; border: 1px solid rgba(249, 115, 22, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 26px;">🎓</span>
                <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Kaushal <span style="color: #f97316;">AI</span></span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">
                Verify Your Email
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">
                Enter the verification code to activate your account
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #f8fafc;">
                Hi <strong style="color: #f97316;">${displayName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #94a3b8;">
                Thank you for creating an account with Kaushal AI. Use the 6-digit verification code below to verify your email address:
              </p>

              <!-- OTP Code Display -->
              <div style="text-align: center; margin: 28px 0;">
                <div style="display: inline-block; padding: 16px 32px; background-color: #1e293b; border: 2px dashed #f97316; border-radius: 12px; letter-spacing: 12px; font-size: 36px; font-weight: 800; color: #f97316; font-family: 'Courier New', monospace; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.15);">
                  ${otp}
                </div>
              </div>

              <div style="padding: 12px 16px; background-color: rgba(249, 115, 22, 0.08); border-radius: 8px; border-left: 3px solid #f97316; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 20px;">
                  ⏱️ <strong>Note:</strong> This verification code expires in <strong>10 minutes</strong>. Do not share this code with anyone.
                </p>
              </div>

              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #64748b; text-align: center;">
                If you did not register for Kaushal AI, you can safely disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0f172a; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #475569;">
                &copy; 2026 Kaushal AI &bull; Your Personal AI Interview Coach
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await sendEmail(userEmail, subject, text, html);
}

// Backward compatibility stubs
async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  return await sendEmail(
    userEmail,
    "Transaction Notification",
    `Hello ${name}, transaction of ${amount} to ${toAccount} was successful.`,
    `<p>Hello <b>${name}</b>, your transaction of <b>${amount}</b> to <b>${toAccount}</b> was successful.</p>`
  );
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  return await sendEmail(
    userEmail,
    "Transaction Failed",
    `Hello ${name}, transaction of ${amount} to ${toAccount} could not be completed.`,
    `<p>Hello <b>${name}</b>, your transaction of <b>${amount}</b> to <b>${toAccount}</b> failed.</p>`
  );
}

module.exports = {
  transporter,
  sendEmail,
  sendRegistrationEmail,
  sendOtpEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};

