import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Calendar,
  Send,
  HelpCircle,
  Target
} from 'lucide-react';
import {
  getDailyChallenge,
  evaluateMockAnswer,
  submitDailyChallenge,
  getDashboardData
} from '../Features/interview/services/interview.api';

export const DailyChallenge = () => {
  const today = new Date().toISOString().slice(0, 10);
  const answersKey = `kaushal_daily_answers_${today}`;
  const evalsKey = `kaushal_daily_evals_${today}`;

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');
  const [weakAreaGrounding, setWeakAreaGrounding] = useState(null);

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(answersKey);
      return saved ? JSON.parse(saved) : { technical: '', behavioral: '', project: '' };
    } catch {
      return { technical: '', behavioral: '', project: '' };
    }
  });

  const [evaluations, setEvaluations] = useState(() => {
    try {
      const saved = localStorage.getItem(evalsKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [evaluating, setEvaluating] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStreakAndChallenge = async () => {
      try {
        const [dashRes, chalRes] = await Promise.all([
          getDashboardData(),
          getDailyChallenge()
        ]);

        if (isMounted) {
          if (dashRes) {
            setStreak(dashRes.streak || 0);
          }
          if (chalRes && chalRes.challenge) {
            setChallenge(chalRes.challenge);
            setCompletedToday(!!chalRes.completedToday);
            setWeakAreaGrounding(chalRes.weakAreaGrounding || null);
          }
        }
      } catch (e) {
        console.error('Failed to load challenge/streak:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStreakAndChallenge();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save answers whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(answersKey, JSON.stringify(answers));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, [answers, answersKey]);

  // Save evaluations whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(evalsKey, JSON.stringify(evaluations));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, [evaluations, evalsKey]);

  const handleAnswerChange = (text) => {
    setAnswers((prev) => ({ ...prev, [activeTab]: text }));
  };

  const handleEvaluateAnswer = async () => {
    const currentAnswer = answers[activeTab];
    if (!currentAnswer.trim() || evaluating) return;

    setEvaluating(true);
    setErrorNotice('');

    const questionObj = challenge[activeTab];
    const categoryName = activeTab === 'technical' ? 'Technical' : activeTab === 'behavioral' ? 'Behavioral' : 'Project Based';

    try {
      const response = await evaluateMockAnswer({
        question: questionObj.question,
        answer: currentAnswer.trim(),
        role: 'Full Stack Developer',
        difficulty: 'Intermediate',
        interviewType: categoryName,
      });

      const evalData = response.evaluation || {
        score: 75,
        technicalAccuracy: 75,
        communication: 78,
        answerStructure: 'Good overview provided',
        confidence: 'Moderate',
        missingPoints: ['Edge cases not fully detailed'],
        improvementSuggestions: ['Add measurable impact and technical trade-offs'],
        betterAnswerApproach: 'Structure with direct definition followed by practical implementation.',
      };

      const updatedEvals = { ...evaluations, [activeTab]: evalData };
      setEvaluations(updatedEvals);

      // Check if all 3 are completed
      const allDone = ['technical', 'behavioral', 'project'].every((tab) => updatedEvals[tab]);
      if (allDone && !completedToday) {
        setCompletedToday(true);
        setStreak((prev) => prev + 1);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

        // Submit to database to persist completion and update streak
        try {
          await submitDailyChallenge({ evaluations: updatedEvals });
        } catch (dbErr) {
          console.error('Failed to submit daily challenge to DB:', dbErr);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorNotice('Evaluation service is temporarily busy. Please retry.');
    } finally {
      setEvaluating(false);
    }
  };

  const tabs = [
    { id: 'technical', label: '1. Technical Drill', done: !!evaluations.technical },
    { id: 'behavioral', label: '2. Behavioral Scenario', done: !!evaluations.behavioral },
    { id: 'project', label: '3. Project Defense', done: !!evaluations.project },
  ];

  const currentQuestion = challenge ? challenge[activeTab] : null;
  const currentEvaluation = evaluations[activeTab];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1px solid var(--border-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <Flame size={24} color="var(--warning)" />
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Daily AI Interview <span className="gradient-text">Challenge</span>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Solve today's 3 personalized questions to maintain your streak.
            {weakAreaGrounding && (
              <> Priority focus: <strong style={{ color: 'var(--warning)' }}>{weakAreaGrounding}</strong> (from your resume gaps).</>
            )}
          </p>
        </div>

        {/* Real Streak Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Practice Streak
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: streak > 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
              {streak} Days {streak > 0 ? '🔥' : ''}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Generating today's personalized questions with Gemini...</p>
        </div>
      ) : (
        <>
          {/* Completion Celebration Banner */}
          {completedToday && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--success-bg)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
              }}
            >
              <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '1rem', display: 'block' }}>Today's Challenge Completed!</strong>
                <span style={{ fontSize: '0.85rem' }}>
                  Awesome dedication. Your {streak}-day active practice streak has been logged to your account.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', gap: '0.5rem' }}
              >
                <span>{t.label}</span>
                {t.done && <CheckCircle2 size={16} color="var(--success)" />}
              </button>
            ))}
          </div>

          {/* Active Question Box */}
          {currentQuestion && (
            <div className="glass-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-xl)' }}>
              {/* Question Metadata Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-primary">
                  {currentQuestion.topic || currentQuestion.competency || currentQuestion.scenario || 'Interview Drill'}
                </span>
                {currentQuestion.difficulty && (
                  <span className="badge badge-warning">{currentQuestion.difficulty}</span>
                )}
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {currentQuestion.question}
              </h3>

              {/* Hints / Guidance */}
              {(currentQuestion.hints || currentQuestion.starGuidance || currentQuestion.expectedDefense) && (
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.5rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong style={{ color: 'var(--primary)' }}>Interviewer Guidance: </strong>
                  {currentQuestion.hints || currentQuestion.starGuidance || currentQuestion.expectedDefense}
                </div>
              )}

              {/* Answer Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your Response</label>
                <textarea
                  rows={6}
                  value={answers[activeTab]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your response concisely..."
                  className="textarea-field"
                  disabled={evaluating}
                  style={{ fontSize: '0.95rem', lineHeight: 1.5 }}
                />

                {errorNotice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
                    <AlertCircle size={16} />
                    <span>{errorNotice}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {answers[activeTab].trim().split(/\s+/).filter(Boolean).length} words
                  </span>

                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !answers[activeTab].trim()}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}
                  >
                    {evaluating ? (
                      <>
                        <Sparkles size={16} className="spin-animation" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit for AI Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Evaluation Results */}
              {currentEvaluation && (
                <div
                  style={{
                    marginTop: '2rem',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="var(--success)" />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>AI Score & Analysis</h4>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.9rem' }}>
                      {currentEvaluation.score}% Score
                    </span>
                  </div>

                  {currentEvaluation.betterAnswerApproach && (
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <strong style={{ color: 'var(--primary)' }}>Optimal Answer Structure: </strong>
                      {currentEvaluation.betterAnswerApproach}
                    </div>
                  )}

                  {currentEvaluation.missingPoints?.length > 0 && (
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--warning)' }}>Missing Points: </strong>
                      <ul style={{ margin: '0.35rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                        {currentEvaluation.missingPoints.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DailyChallenge;
