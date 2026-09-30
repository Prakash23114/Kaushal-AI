import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
  AlertCircle,
  FolderGit2
} from 'lucide-react';
import {
  getProfileMe,
  getProjectDefenseQuestions,
  evaluateMockAnswer,
  saveMockSession
} from '../Features/interview/services/interview.api';

export const ProjectInterview = () => {
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [detectedProjects, setDetectedProjects] = useState([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const [projectName, setProjectName] = useState('');
  const [techStack, setTechStack] = useState('');
  const [projectSummary, setProjectSummary] = useState('');

  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [defenseFinished, setDefenseFinished] = useState(false);

  useEffect(() => {
    const loadProfileProjects = async () => {
      try {
        const res = await getProfileMe();
        if (res?.profile) {
          setCandidateProfile(res.profile);
          const projs = res.profile.projects || [];
          setDetectedProjects(projs);

          if (projs.length > 0) {
            const first = projs[0];
            setProjectName(first.title);
            setTechStack(first.techStack?.join(', ') || '');
            setProjectSummary(first.description || first.keyHighlights?.join('. ') || '');
            fetchDefenseQuestions(first.title, first.techStack?.join(', ') || '', first.description || '');
          } else {
            // Default placeholder based on extracted skills
            const skills = res.profile.extractedSkills?.slice(0, 4).join(', ') || 'React, Node.js, MongoDB';
            setProjectName('Portfolio Web Application');
            setTechStack(skills);
            setProjectSummary('Full-stack web application designed and built by candidate.');
            fetchDefenseQuestions('Portfolio Web Application', skills, 'Full-stack application');
          }
        }
      } catch (e) {
        console.error('Failed to load candidate projects:', e);
      }
    };

    loadProfileProjects();
  }, []);

  const fetchDefenseQuestions = async (name, stack, summary) => {
    setLoadingQuestions(true);
    try {
      const res = await getProjectDefenseQuestions({
        projectName: name,
        techStack: stack,
        projectSummary: summary
      });
      if (res?.questions?.length > 0) {
        setQuestions(res.questions);
        setActiveQuestionIndex(0);
        setEvaluations([]);
        setDefenseFinished(false);
      }
    } catch (e) {
      console.error('Failed to load defense questions:', e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectDetectedProject = (index) => {
    setSelectedProjectIndex(index);
    const proj = detectedProjects[index];
    if (proj) {
      const name = proj.title;
      const stack = proj.techStack?.join(', ') || '';
      const summary = proj.description || proj.keyHighlights?.join('. ') || '';
      setProjectName(name);
      setTechStack(stack);
      setProjectSummary(summary);
      fetchDefenseQuestions(name, stack, summary);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || evaluating) return;

    setEvaluating(true);
    const questionText = questions[activeQuestionIndex] || 'Explain your project architecture.';

    try {
      const response = await evaluateMockAnswer({
        question: `[Project: ${projectName} | Tech: ${techStack}] ${questionText}`,
        answer: userAnswer.trim(),
        role: candidateProfile?.targetRoles?.[0] || 'Software Engineer',
        difficulty: 'Advanced',
        interviewType: 'Project Based',
      });

      const evalData = response.evaluation || {
        score: 78,
        technicalAccuracy: 80,
        communication: 78,
        answerStructure: 'Clear breakdown with architecture details',
        missingPoints: ['Quantifiable performance metrics (e.g. latency, throughput)'],
        improvementSuggestions: ['Explain caching layer and horizontal scaling'],
        betterAnswerApproach: 'Define component responsibilities, state trade-offs, and show engineering depth.',
      };

      const updatedEvals = [...evaluations, { question: questionText, answer: userAnswer.trim(), ...evalData }];
      setEvaluations(updatedEvals);
      setUserAnswer('');

      if (activeQuestionIndex + 1 < questions.length) {
        setActiveQuestionIndex((prev) => prev + 1);
      } else {
        setDefenseFinished(true);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

        // Save completed session to MongoDB
        const avgScore = Math.round(updatedEvals.reduce((acc, e) => acc + (e.score || 0), 0) / updatedEvals.length);
        await saveMockSession({
          role: candidateProfile?.targetRoles?.[0] || 'Software Engineer',
          interviewType: 'Project Based',
          difficulty: 'Advanced',
          questions: updatedEvals.map(e => e.question),
          answers: updatedEvals.map(e => e.answer),
          score: avgScore,
          technicalScore: avgScore,
          communicationScore: avgScore,
          behavioralScore: avgScore,
          projectScore: avgScore,
          evaluations: updatedEvals,
          feedback: `Completed defense of project "${projectName}". Scored ${avgScore}%.`,
          duration: 600
        });
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
          Placement and senior engineering interviewers scrutinize your resume projects. Defend your tech stack,
          architecture choices, scalability bottlenecks, and technical trade-offs.
        </p>
      </div>

      {/* Detected Resume Projects Picker */}
      {detectedProjects.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FolderGit2 size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Projects Detected on Your Resume</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {detectedProjects.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDetectedProject(idx)}
                className={`btn btn-sm ${selectedProjectIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1rem' }}
              >
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project Details Setup */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Configured Project Details
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
              Project Summary / Pitch
            </label>
            <textarea
              rows={2}
              value={projectSummary}
              onChange={(e) => setProjectSummary(e.target.value)}
              className="textarea-field"
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => fetchDefenseQuestions(projectName, techStack, projectSummary)}
            disabled={loadingQuestions || !projectName.trim()}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={14} />
            <span>Regenerate Project Questions</span>
          </button>
        </div>
      </div>

      {/* Defense Question Simulator */}
      {!defenseFinished ? (
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
                Defense Question {activeQuestionIndex + 1} of {questions.length || 5}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Focus: {projectName}
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.45, marginTop: '0.5rem' }}>
              {loadingQuestions ? 'Generating project-specific defense questions...' : questions[activeQuestionIndex] || 'Explain your project architecture.'}
            </h3>
          </div>

          {/* Answer Box */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Your Architectural Defense
            </label>
            <textarea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Explain your engineering choices for ${projectName}. Mention specific trade-offs, database indexing, scalability bottlenecks, and failure recovery...`}
              className="textarea-field"
              disabled={evaluating}
              style={{ fontSize: '0.95rem', lineHeight: 1.5 }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                onClick={handleEvaluate}
                disabled={evaluating || !userAnswer.trim()}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}
              >
                {evaluating ? (
                  <>
                    <Sparkles size={16} className="spin-animation" />
                    <span>Evaluating Defense...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Next Question</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Project Defense Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            You have successfully defended <strong>{projectName}</strong>. Your answers and evaluations have been saved to your profile.
          </p>
          <button
            onClick={() => {
              setDefenseFinished(false);
              setActiveQuestionIndex(0);
              setEvaluations([]);
            }}
            className="btn btn-primary"
          >
            Defend Another Project
          </button>
        </div>
      )}

      {/* Evaluations History */}
      {evaluations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Evaluated Defense Answers</h3>
          {evaluations.map((evalItem, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">Q{idx + 1} Defense</span>
                <span className="badge badge-success">{evalItem.score}% Depth</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>{evalItem.question}</p>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {evalItem.answer}
              </div>
              {evalItem.betterAnswerApproach && (
                <div style={{ fontSize: '0.82rem', color: 'var(--primary)', lineHeight: 1.45 }}>
                  <strong>Senior Recommendation:</strong> {evalItem.betterAnswerApproach}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectInterview;
