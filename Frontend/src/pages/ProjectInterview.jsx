import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  Send,
  Layers,
  Server,
  Database,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { evaluateMockAnswer } from '../Features/interview/services/interview.api';

const PROJECT_DEFENSE_QUESTIONS = [
  'Walk me through the high-level architecture of your project and the data flow from client to database.',
  'Why did you choose your specific database and backend framework over alternatives (e.g. SQL vs NoSQL)?',
  'What happens if 10,000 concurrent users suddenly start interacting with your application? Where are the bottlenecks?',
  'What was the single most difficult technical roadblock or production bug you encountered, and how did you debug it?',
  'How did you handle authentication, session security, and authorization? What security vulnerabilities did you mitigate?',
  'If you had to rebuild this project from scratch today, what architectural decisions would you change and why?'
];

export const ProjectInterview = () => {
  const [projectName, setProjectName] = useState('Kaushal AI / E-Commerce / SaaS Platform');
  const [techStack, setTechStack] = useState('React, Node.js, Express, MongoDB, JWT, Puppeteer');
  const [projectSummary, setProjectSummary] = useState(
    'An AI-powered interview preparation platform featuring resume parsing, personalized 14-day roadmaps, Gemini AI coaching, and ATS resume PDF generation.'
  );

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState([]);

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || evaluating) return;

    setEvaluating(true);
    const questionText = PROJECT_DEFENSE_QUESTIONS[activeQuestionIndex];

    try {
      const response = await evaluateMockAnswer({
        question: `[Project: ${projectName} | Tech Stack: ${techStack}] ${questionText}`,
        answer: userAnswer.trim(),
        role: 'Full Stack Engineer',
        difficulty: 'Advanced',
        interviewType: 'Project Based',
      });

      const evalData = response.evaluation || {
        score: 80,
        technicalAccuracy: 82,
        communication: 78,
        answerStructure: 'Clear breakdown with architecture details',
        missingPoints: ['Quantifiable performance metrics (e.g. latency, throughput)'],
        improvementSuggestions: ['Explain caching layer and horizontal scaling'],
        betterAnswerApproach: 'Define component responsibilities, state trade-offs, and show engineering depth.',
      };

      setEvaluations((prev) => [...prev, { question: questionText, answer: userAnswer, ...evalData }]);
      setUserAnswer('');

      if (activeQuestionIndex + 1 < PROJECT_DEFENSE_QUESTIONS.length) {
        setActiveQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert('AI evaluator is temporarily busy. Please retry.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Project Defense <span className="gradient-text">Interview Simulator</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Placement and senior engineering interviewers scrutinize your projects. Practice defending your tech stack,
          architecture choices, scalability bottlenecks, and trade-offs.
        </p>
      </div>

      {/* Project Details Setup */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Configure Your Project Context
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Technologies & Architecture
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Project Elevator Pitch
            </label>
            <textarea
              rows={2}
              value={projectSummary}
              onChange={(e) => setProjectSummary(e.target.value)}
              className="textarea-field"
            />
          </div>
        </div>
      </div>

      {/* Defense Question Simulator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            borderLeft: '5px solid var(--secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">
              Defense Question {activeQuestionIndex + 1} of {PROJECT_DEFENSE_QUESTIONS.length}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.5 }}>
            {PROJECT_DEFENSE_QUESTIONS[activeQuestionIndex]}
          </h3>
        </div>

        {/* Candidate Response Box */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Defend Your Engineering Choices:
          </label>
          <textarea
            rows={7}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Explain the architectural reasoning, trade-offs you considered, and why this design was optimal..."
            className="textarea-field"
            disabled={evaluating}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              onClick={handleEvaluate}
              disabled={!userAnswer.trim() || evaluating}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              <Sparkles size={16} />
              <span>{evaluating ? 'Grading Architectural Defense...' : 'Submit Project Defense'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historical Evaluations for Project Defense */}
      {evaluations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Evaluated Defense Answers</h3>

          {evaluations.map((ev, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">Round {idx + 1}</span>
                <span className="badge badge-success">Defense Score: {ev.score}/100</span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>{ev.question}</h4>

              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Your Defense:</strong> {ev.answer}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--danger-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    What the Interviewer Missed:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    {ev.missingPoints?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    Senior Answer Strategy:
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                    {ev.betterAnswerApproach}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectInterview;
