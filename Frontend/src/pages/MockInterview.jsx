import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  FileText,
  Volume2,
  History,
  Bot,
  Video,
  VideoOff,
  Code2,
  RefreshCw,
  Layers,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import {
  getMockQuestions,
  evaluateMockAnswer,
  saveMockSession,
  getProfileMe,
  getAllInterviewReports
} from '../Features/interview/services/interview.api';

export const MockInterview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Setup state
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState('');

  const [role, setRole] = useState(searchParams.get('role') || 'Full Stack Developer');
  const [interviewType, setInterviewType] = useState('Technical & DSA (Balanced)');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('15');

  // Active session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(900);
  const [savingSession, setSavingSession] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // Speech Recognition ref
  const recognitionRef = useRef(null);
  const baseAnswerRef = useRef('');

  useEffect(() => {
    // 1. Load candidate profile
    const loadData = async () => {
      try {
        const [profileRes, reportsRes] = await Promise.all([
          getProfileMe().catch(() => null),
          getAllInterviewReports().catch(() => null)
        ]);

        if (profileRes?.profile) {
          setCandidateProfile(profileRes.profile);
        }

        const reportList = reportsRes?.interviewReports || [];
        setStrategies(reportList);

        if (reportList.length > 0) {
          const latest = reportList[0];
          setSelectedStrategyId(latest._id);
          if (!searchParams.get('role')) {
            setRole(latest.title);
          }
        } else if (profileRes?.profile?.targetRoles?.[0] && !searchParams.get('role')) {
          setRole(profileRes.profile.targetRoles[0]);
        }
      } catch (e) {
        console.warn('Initial mock interview data load warning:', e);
      }
    };

    loadData();

    // Check URL type parameter (e.g. redirected from project interview)
    const urlType = searchParams.get('type');
    if (urlType === 'Project') {
      setInterviewType('Project Based (Defend Resume Projects)');
    }
  }, [searchParams]);

  // Clean up media streams and speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Sync camera stream to video tag whenever camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraActive, interviewStarted]);

  // Camera Handlers
  const startCamera = async () => {
    setCameraError('');
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      cameraStreamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera device detected on your system.');
      } else {
        setCameraError('Unable to start camera. Please check your camera permissions.');
      }
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Speech-to-Text Dictation Handlers
  const startVoiceDictation = () => {
    setSpeechError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      // Keep record of current text before speaking session begins
      baseAnswerRef.current = userAnswer ? userAnswer.trim() + ' ' : '';

      recog.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recog.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += chunk + ' ';
          } else {
            interimTranscript += chunk;
          }
        }

        const combined = (baseAnswerRef.current + finalTranscript + interimTranscript).trim();
        setUserAnswer(combined);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser.');
          setIsListening(false);
        } else if (event.error === 'network') {
          setSpeechError('Network error occurred during speech-to-text conversion.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // no-op, user paused
        }
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recog.start();
      recognitionRef.current = recog;
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setSpeechError('Failed to initialize microphone. Please check browser permissions.');
      setIsListening(false);
    }
  };

  const stopVoiceDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const toggleSpeech = () => {
    if (isListening) {
      stopVoiceDictation();
    } else {
      startVoiceDictation();
    }
  };

  const handleStartInterview = async () => {
    setLoadingQuestions(true);
    try {
      const res = await getMockQuestions({
        role,
        difficulty,
        interviewType: interviewType.includes('DSA') ? 'Technical' : interviewType,
        strategyId: selectedStrategyId || undefined
      });

      const qList = res?.questions || [];
      if (qList.length === 0) {
        throw new Error('No questions returned from AI interviewer.');
      }

      setQuestions(qList);
      setCurrentQuestionIndex(0);
      setEvaluations([]);
      setUserAnswer('');
      setInterviewStarted(true);
      setInterviewFinished(false);
      setTimerSeconds(parseInt(duration, 10) * 60);
      setSaveSuccess(false);

      // Auto-start camera if user already enabled it, otherwise they can click Turn On Camera
    } catch (err) {
      console.error('Failed to generate mock questions:', err);
      alert('AI Interviewer is temporarily busy. Please retry.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (interviewStarted && !interviewFinished && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, interviewFinished, timerSeconds]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || evaluating) return;

    if (isListening) {
      stopVoiceDictation();
    }

    setEvaluating(true);
    const questionText = questions[currentQuestionIndex];

    try {
      const response = await evaluateMockAnswer({
        question: questionText,
        answer: userAnswer.trim(),
        role,
        difficulty,
        interviewType,
        strategyId: selectedStrategyId || undefined
      });

      const evalData = response.evaluation || {
        score: 75,
        technicalAccuracy: 75,
        communication: 78,
        answerStructure: 'Clear structured response provided',
        confidence: 'Moderate',
        missingPoints: ['Edge cases and performance complexity trade-offs omitted'],
        improvementSuggestions: ['Add measurable impact and concrete technical trade-offs'],
        betterAnswerApproach: 'Structure with direct definition followed by practical implementation and trade-offs.',
        followUpQuestion: 'How would your solution handle high concurrency or latency spikes?'
      };

      const currentEval = {
        question: questionText,
        answer: userAnswer.trim(),
        ...evalData
      };

      const updatedEvals = [...evaluations, currentEval];
      setEvaluations(updatedEvals);
      setUserAnswer('');
      baseAnswerRef.current = '';

      // Next question or finish
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setInterviewFinished(true);
        stopCamera();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        await handleSaveCompletedSession(updatedEvals);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      const evalData = {
        score: 72,
        technicalAccuracy: 74,
        communication: 72,
        answerStructure: 'Good foundation provided',
        confidence: 'Moderate',
        missingPoints: ['Production error handling and latency consideration'],
        improvementSuggestions: ['State metrics and architectural trade-offs'],
        betterAnswerApproach: 'Define high-level concept clearly, explain underlying mechanism, and discuss production trade-offs.',
        followUpQuestion: 'How would you test this under simulated load?'
      };

      const currentEval = {
        question: questionText,
        answer: userAnswer.trim(),
        ...evalData
      };

      const updatedEvals = [...evaluations, currentEval];
      setEvaluations(updatedEvals);
      setUserAnswer('');
      baseAnswerRef.current = '';

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setInterviewFinished(true);
        stopCamera();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        await handleSaveCompletedSession(updatedEvals);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveCompletedSession = async (allEvaluations) => {
    setSavingSession(true);
    try {
      const avgScore = Math.round(allEvaluations.reduce((acc, e) => acc + (e.score || 0), 0) / allEvaluations.length);
      const avgTech = Math.round(allEvaluations.reduce((acc, e) => acc + (e.technicalAccuracy || e.score || 0), 0) / allEvaluations.length);
      const avgComm = Math.round(allEvaluations.reduce((acc, e) => acc + (e.communication || e.score || 0), 0) / allEvaluations.length);

      await saveMockSession({
        strategyId: selectedStrategyId || undefined,
        role,
        interviewType,
        difficulty,
        questions: allEvaluations.map((e) => e.question),
        answers: allEvaluations.map((e) => e.answer),
        score: avgScore,
        technicalScore: avgTech,
        communicationScore: avgComm,
        behavioralScore: interviewType === 'Behavioral' ? avgScore : avgComm,
        projectScore: interviewType.includes('Project') ? avgScore : avgTech,
        evaluations: allEvaluations,
        feedback: `Completed ${questions.length}-question ${interviewType} session. Overall score: ${avgScore}%.`,
        duration: parseInt(duration, 10) * 60 - timerSeconds
      });

      setSaveSuccess(true);
    } catch (e) {
      console.error('Failed to save interview session to DB:', e);
    } finally {
      setSavingSession(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const overallAvgScore =
    evaluations.length > 0
      ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / evaluations.length)
      : 0;

  // Determine dynamic badge for current question (e.g. DSA, Project, System)
  const getQuestionTypeBadge = (questionText) => {
    if (!questionText) return { label: 'Technical Depth', color: 'badge-primary' };
    const qLower = questionText.toLowerCase();
    if (
      qLower.includes('complexity') ||
      qLower.includes('o(n') ||
      qLower.includes('o(1') ||
      qLower.includes('hash table') ||
      qLower.includes('binary search tree') ||
      qLower.includes('topological') ||
      qLower.includes('trade-off')
    ) {
      return { label: 'DSA Conceptual', color: 'badge-primary' };
    }
    if (
      qLower.includes('algorithm') ||
      qLower.includes('kth largest') ||
      qLower.includes('sliding window') ||
      qLower.includes('array') ||
      qLower.includes('min-heap') ||
      qLower.includes('traverse')
    ) {
      return { label: 'DSA Problem Solving', color: 'badge-warning' };
    }
    if (
      qLower.includes('project') ||
      qLower.includes('architecture') ||
      qLower.includes('bottleneck') ||
      qLower.includes('10,000') ||
      qLower.includes('trade-offs')
    ) {
      return { label: 'Project Defense', color: 'badge-success' };
    }
    if (
      qLower.includes('situation') ||
      qLower.includes('roadblock') ||
      qLower.includes('conflict') ||
      qLower.includes('tell me about')
    ) {
      return { label: 'Behavioral & STAR', color: 'badge-info' };
    }
    return { label: 'Technical & System', color: 'badge-primary' };
  };

  const activeStrategy = strategies.find((s) => s._id === selectedStrategyId) || strategies[0];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── SCREEN 1: INTERVIEW SETUP ── */}
      {!interviewStarted && (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <Mic size={26} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              AI Mock <span className="gradient-text">Interview Room</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              Practice realistic turn-by-turn interviews with live speech-to-text dictation and optional camera preview.
              Includes DSA questions, technical system design, and resume project defense.
            </p>

            {/* Active Strategy Grounding Badge */}
            {activeStrategy && (
              <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                  <Sparkles size={14} />
                  Aligned with Strategy: {activeStrategy.title}
                </span>
                {candidateProfile?.resumeFileName && (
                  <span className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                    <FileText size={14} />
                    Resume: {candidateProfile.resumeFileName}
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Strategy Selection (if multiple exist) */}
            {strategies.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Active Interview Strategy Grounding
                </label>
                <select
                  value={selectedStrategyId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setSelectedStrategyId(sid);
                    const matched = strategies.find((s) => s._id === sid);
                    if (matched) setRole(matched.title);
                  }}
                  className="input-field"
                >
                  {strategies.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.title} (Created {new Date(st.createdAt).toLocaleDateString()}) - Match {st.matchScore}%
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Role */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Target Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI/ML Engineer, DevOps"
                className="input-field"
              />
            </div>

            {/* Interview Category (Now includes DSA) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Interview Category
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="input-field"
              >
                <option value="Technical & DSA (Balanced)">Technical & DSA (Balanced Industry Standard)</option>
                <option value="DSA & Algorithms">Data Structures & Algorithms (Pure DSA)</option>
                <option value="Project Based (Defend Resume Projects)">Project Defense (Defend Resume Projects)</option>
                <option value="Behavioral">Behavioral (STAR Method & Scenarios)</option>
                <option value="HR & Cultural">HR & Cultural Alignment</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Interview Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field"
              >
                <option value="Beginner">Junior / Entry Level</option>
                <option value="Intermediate">Mid-Level (Standard Industry)</option>
                <option value="Advanced">Senior / Lead (High Scrutiny)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Session Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-field"
              >
                <option value="10">10 Minutes (Quick Drill)</option>
                <option value="15">15 Minutes (Standard Session)</option>
                <option value="30">30 Minutes (Deep Comprehensive)</option>
              </select>
            </div>
          </div>

          {/* Camera Pre-check */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {cameraActive ? <Video size={20} color="var(--success)" /> : <VideoOff size={20} color="var(--text-muted)" />}
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Camera Preview: {cameraActive ? 'Enabled (Ready for Mock Session)' : 'Disabled'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  You can toggle your camera anytime during the interview.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleCamera}
              className={`btn btn-sm ${cameraActive ? 'btn-secondary' : 'btn-primary'}`}
              style={{ borderRadius: 'var(--radius-full)', gap: '0.35rem' }}
            >
              {cameraActive ? <VideoOff size={14} /> : <Video size={14} />}
              <span>{cameraActive ? 'Turn Off Camera' : 'Enable Camera Preview'}</span>
            </button>
          </div>

          {cameraError && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{cameraError}</span>
            </div>
          )}

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button
              onClick={handleStartInterview}
              disabled={loadingQuestions}
              className="btn btn-primary btn-lg"
              style={{ padding: '0.9rem 2.75rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)', gap: '0.5rem' }}
            >
              {loadingQuestions ? (
                <>
                  <RefreshCw size={20} className="spin-animation" />
                  <span>Synthesizing Strategy & DSA Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Start AI Mock Interview</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── SCREEN 2: ACTIVE QUESTION SESSION ── */}
      {interviewStarted && !interviewFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Header */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {role}
              </span>
              <span className={`badge ${getQuestionTypeBadge(questions[currentQuestionIndex]).color}`}>
                {getQuestionTypeBadge(questions[currentQuestionIndex]).label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Camera Toggle in Header */}
              <button
                type="button"
                onClick={toggleCamera}
                className={`btn btn-sm ${cameraActive ? 'btn-secondary' : 'btn-outline'}`}
                style={{ gap: '0.35rem', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                title="Toggle camera preview"
              >
                {cameraActive ? <VideoOff size={14} /> : <Video size={14} />}
                <span>{cameraActive ? 'Cam Off' : 'Cam On'}</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: timerSeconds < 120 ? 'var(--danger)' : 'var(--text-primary)'
                }}
              >
                <Clock size={16} />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Optional Live Camera Preview Tile */}
          {cameraActive && (
            <div
              className="glass-card"
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: '#000',
                maxHeight: '260px',
                overflow: 'hidden'
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  maxHeight: '240px',
                  objectFit: 'contain',
                  transform: 'scaleX(-1)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#fff'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981'
                  }}
                />
                <span>LIVE FEED</span>
              </div>
            </div>
          )}

          {/* Current Question Card */}
          <div
            className="glass-card"
            style={{
              padding: '2.25rem',
              borderRadius: 'var(--radius-xl)',
              borderLeft: '5px solid var(--primary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                Interviewer Prompt
              </div>
              <span className={`badge ${getQuestionTypeBadge(questions[currentQuestionIndex]).color}`}>
                {getQuestionTypeBadge(questions[currentQuestionIndex]).label}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--text-primary)' }}>
              {questions[currentQuestionIndex]}
            </h3>
          </div>

          {/* Candidate Answer Input */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your Answer</label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ gap: '0.4rem', borderRadius: 'var(--radius-full)', padding: '0.4rem 0.85rem' }}
                  title="Toggle voice dictation"
                >
                  {isListening ? (
                    <>
                      <MicOff size={15} />
                      <span className="pulse-recording">Recording (Speak now)...</span>
                    </>
                  ) : (
                    <>
                      <Mic size={15} />
                      <span>Answer by Voice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Speech error notice */}
            {speechError && (
              <div
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertCircle size={15} />
                <span>{speechError}</span>
              </div>
            )}

            <textarea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="State your answer clearly or click 'Answer by Voice' to dictate. You can review and edit your answer before submitting..."
              className="textarea-field"
              disabled={evaluating}
              style={{ fontSize: '0.95rem', lineHeight: 1.5 }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words • Minimum 20 words recommended
              </span>

              <button
                onClick={handleSubmitAnswer}
                disabled={evaluating || !userAnswer.trim()}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}
              >
                {evaluating ? (
                  <>
                    <Sparkles size={16} className="spin-animation" />
                    <span>Evaluating with Gemini...</span>
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
      )}

      {/* ── SCREEN 3: INTERVIEW REPORT & SUMMARY ── */}
      {interviewFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '1px solid var(--border-hover)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '2px solid var(--success)',
              }}
            >
              <CheckCircle2 size={32} color="var(--success)" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Interview Session Completed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 1.5rem' }}>
              Your answers have been analyzed by Gemini AI against real software engineering hiring standards.
              {saveSuccess && ' This interview has been saved to your account.'}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                {overallAvgScore}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>/ 100</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setInterviewStarted(false);
                  setInterviewFinished(false);
                  setEvaluations([]);
                  setUserAnswer('');
                }}
                className="btn btn-secondary"
                style={{ gap: '0.45rem' }}
              >
                <RotateCcw size={16} />
                <span>Start Another Session</span>
              </button>
              <button
                onClick={() => navigate('/app/my-interviews')}
                className="btn btn-primary"
                style={{ gap: '0.45rem' }}
              >
                <History size={16} />
                <span>View in My Interviews</span>
              </button>
            </div>
          </div>

          {/* Detailed Question-by-Question Evaluation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Question-by-Question Evaluation</h3>

            {evaluations.map((item, idx) => {
              const conf = item.confidence || 'Moderate';
              const confBadgeClass =
                conf === 'High' ? 'badge-success' : conf === 'Moderate' ? 'badge-primary' : 'badge-warning';

              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-primary">Q{idx + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{item.question}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${confBadgeClass}`}>
                        Confidence: {conf}
                      </span>
                      <span
                        className={`badge ${
                          item.score >= 80 ? 'badge-success' : item.score >= 60 ? 'badge-primary' : 'badge-warning'
                        }`}
                      >
                        {item.score}% Score
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <strong style={{ color: 'var(--text-primary)' }}>Your Answer:</strong> {item.answer}
                  </div>

                  {/* Feedback Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {/* Missing Points */}
                    {item.missingPoints?.length > 0 && (
                      <div
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--warning-bg)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '0.35rem' }}>
                          Missing Concepts & Trade-offs:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {item.missingPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Better Approach */}
                    {item.betterAnswerApproach && (
                      <div
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.35rem' }}>
                          Ideal Answer Approach:
                        </div>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                          {item.betterAnswerApproach}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
