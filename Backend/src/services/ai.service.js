const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({

    matchScore: z.number().describe(
        "A professional profile-to-job match score from 0 to 100. " +
        "Evaluate the alignment between the candidate's demonstrated skills, " +
        "experience, projects, education, and the requirements of the job description. " +
        "Base the score only on evidence provided in the candidate information. " +
        "Do not assume skills or experience that are not mentioned."
    ),

    technicalQuestions: z.array(z.object({

        question: z.string().describe(
            "A realistic technical interview question specifically relevant to the " +
            "candidate's resume, projects, technical skills, and the target job. " +
            "Questions should test practical understanding rather than simple definitions."
        ),

        intention: z.string().describe(
            "The interviewer's purpose for asking the question. " +
            "Explain which technical competency, problem-solving ability, " +
            "engineering experience, or depth of understanding the interviewer is trying to evaluate."
        ),

        answer: z.string().describe(
            "A professional answer strategy for the candidate. " +
            "Explain the key concepts, technical points, examples, trade-offs, " +
            "and reasoning the candidate should cover. " +
            "The answer should help the candidate formulate their own response " +
            "rather than simply providing a memorized one-line answer."
        )

    })).describe(
        "A carefully selected set of realistic technical interview questions " +
        "tailored to the candidate's actual technical background and the target job. " +
        "Prioritize questions related to technologies, projects, architecture, " +
        "databases, APIs, system design, debugging, scalability, and practical engineering."
    ),

    behavioralQuestions: z.array(z.object({

        question: z.string().describe(
            "A realistic behavioral or situational interview question relevant to " +
            "the candidate's experience, projects, teamwork, leadership, challenges, " +
            "conflict resolution, ownership, communication, or career goals."
        ),

        intention: z.string().describe(
            "The behavioral competency the interviewer is attempting to evaluate, " +
            "such as communication, teamwork, leadership, ownership, adaptability, " +
            "problem-solving, decision-making, or handling failure."
        ),

        answer: z.string().describe(
            "A professional framework for answering the question. " +
            "Recommend relevant points and examples the candidate should discuss. " +
            "Where appropriate, use the STAR approach: Situation, Task, Action, and Result."
        )

    })).describe(
        "A set of realistic behavioral and situational interview questions " +
        "tailored to the candidate's background and the target role. " +
        "Questions should evaluate professional behavior, communication, teamwork, " +
        "leadership, ownership, adaptability, and problem-solving."
    ),

    skillGaps: z.array(z.object({

        skill: z.string().describe(
            "A specific technical or professional skill that is missing, " +
            "underdeveloped, or insufficiently demonstrated in the candidate's profile " +
            "when compared with the target job description."
        ),

        severity: z.enum([
            "low",
            "medium",
            "high"
        ]).describe(
            "The practical importance of the skill gap for the target role. " +
            "High means the skill is a major requirement of the role, " +
            "medium means it is useful or moderately important, and " +
            "low means it is beneficial but not essential."
        )

    })).describe(
        "A concise list of meaningful skill gaps identified by comparing " +
        "the candidate's demonstrated capabilities with the requirements of the target job. " +
        "Do not list technologies simply because they are absent from the resume; " +
        "include only gaps that are relevant to the target position."
    ),

    preparationPlan: z.array(z.object({

        day: z.number().describe(
            "The sequential day number of the interview preparation plan, starting from 1."
        ),

        focus: z.string().describe(
            "The primary topic or competency the candidate should focus on that day, " +
            "such as backend development, databases, system design, DSA, projects, " +
            "behavioral preparation, or mock interviews."
        ),

        tasks: z.array(z.string()).describe(
            "A practical list of specific preparation activities for the day. " +
            "Tasks should be actionable and achievable, such as revising a concept, " +
            "implementing a small feature, solving selected problems, reviewing a project, " +
            "or practicing interview questions."
        )

    })).describe(
        "A structured, realistic, day-by-day interview preparation roadmap. " +
        "The plan should prioritize the candidate's actual skill gaps and the most relevant " +
        "requirements of the target job. It should progress from knowledge revision " +
        "to practical application and finally interview simulation."
    ),

    title: z.string().describe(
        "The exact or most appropriate professional job title represented by the target job description, " +
        "such as Backend Developer, Full Stack Developer, Software Engineer, or AI Engineer."
    )

})


async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
You are a senior technical interviewer and recruitment specialist.

Your task is to generate a professional interview preparation report for a candidate
based strictly on the candidate's resume, self-description, and the target job description.

========================
CANDIDATE RESUME
========================

${resume}

========================
CANDIDATE SELF DESCRIPTION
========================

${selfDescription}

========================
TARGET JOB DESCRIPTION
========================

${jobDescription}

========================
YOUR OBJECTIVE
========================

Analyze the candidate's profile against the target role and generate a realistic,
professional, and actionable interview preparation report.

The report should help the candidate understand:

1. How closely their current profile aligns with the target role.
2. Which technical areas are likely to be tested.
3. Which projects and experiences the interviewer may ask about.
4. Which behavioral areas may be evaluated.
5. Which important skills or requirements are currently missing or weak.
6. What the candidate should study and practice before the interview.

========================
IMPORTANT INSTRUCTIONS
========================

1. Use ONLY information supported by the resume, self-description,
   and job description.

2. Do NOT invent companies, internships, projects, technologies,
   achievements, certifications, responsibilities, or work experience.

3. Questions should be realistic for an actual interview and should be
   appropriate for the candidate's experience level.

4. Prioritize questions based on the candidate's actual projects and technologies.
   For example, if the candidate has worked with Node.js, MongoDB, FastAPI,
   Kafka, WebSockets, microservices, or system design, create practical questions
   around those areas when relevant to the job.

5. Avoid generic questions unless they are genuinely relevant to the target role.

6. Technical questions should test understanding, implementation ability,
   architecture, debugging, scalability, databases, APIs, and engineering decisions
   where appropriate.

7. Behavioral questions should focus on communication, teamwork, leadership,
   ownership, challenges, failures, decision-making, adaptability, and project experience.

8. Skill gaps must be based on an actual comparison between the candidate profile
   and the job requirements. Do not treat every missing technology as a skill gap.

9. The preparation plan should prioritize the most important areas first
   and should be practical for interview preparation.

10. The candidate's project experience should be treated as a major source of
    potential interview questions.

11. For every suggested answer, provide an answer strategy and important points
    to mention rather than encouraging the candidate to memorize a fixed response.

12. Maintain a professional tone suitable for a software engineering interview report.

13. Keep the output concise enough to be useful while still providing meaningful detail.

14. Return ONLY valid JSON matching the provided schema.
`

 const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
    }
});

    return JSON.parse(response.text)
}


async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch()

    const page = await browser.newPage()

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}


async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = z.object({

        html: z.string().describe(
            "Complete, self-contained HTML document for a professional, ATS-friendly resume. " +
            "The HTML must contain only the resume content and styling required to render " +
            "a polished 1-2 page PDF."
        )

    })

    const prompt = `
You are an expert technical resume writer and ATS resume specialist.

Create a professional, ATS-friendly resume tailored specifically to the target
job description using the candidate information provided below.

========================
CANDIDATE RESUME
========================

${resume}

========================
CANDIDATE SELF DESCRIPTION
========================

${selfDescription}

========================
TARGET JOB DESCRIPTION
========================

${jobDescription}

========================
RESUME REQUIREMENTS
========================

1. Preserve the candidate's factual information.

2. Do NOT invent:
   - Skills
   - Companies
   - Job titles
   - Experience
   - Projects
   - Achievements
   - Certifications
   - Technologies
   - Metrics
   - Responsibilities

3. Tailor the resume toward the target job by emphasizing the candidate's
   most relevant existing skills, projects, experience, and achievements.

4. Use professional software-engineering resume language.

5. Make the content sound naturally written by an experienced professional,
   not AI-generated.

6. Prioritize measurable achievements and technical impact where the candidate
   has already provided them.

7. Keep the resume concise and ideally within 1-2 A4 pages.

8. Use standard ATS-friendly section headings such as:
   - Summary
   - Technical Skills
   - Experience
   - Projects
   - Education
   - Leadership
   - Achievements
   - Certifications

9. Use relevant keywords from the job description only when they are supported
   by the candidate's actual background.

10. Do not use excessive graphics, icons, tables, multiple columns,
    progress bars, skill ratings, or decorative elements that could interfere
    with ATS parsing.

11. Use clean typography, consistent spacing, clear hierarchy,
    and subtle professional styling.

12. The resume should be easy for both ATS systems and human recruiters to read.

13. Focus on relevance rather than including unnecessary information.

14. The final HTML must be complete and directly renderable by Puppeteer.

15. Return ONLY a JSON object containing a single "html" field.

The HTML should contain:
- Proper HTML structure
- Embedded CSS
- Professional typography
- Clear section hierarchy
- Print-friendly A4 layout
- No external dependencies
- No JavaScript
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}


module.exports = {
    generateInterviewReport,
    generateResumePdf
}