import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import {
  FileText,
  Upload,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  Target,
  Shield,
  Layers,
  Bot
} from 'lucide-react';
import { useAuth } from '../Features/auth/hooks/useAuth';
import { submitResumeOnboarding } from '../Features/interview/services/interview.api';

const ANALYSIS_STEPS = [
  'Reading PDF structure and extracting raw text...',
  'Parsing technical skills, frameworks, and databases...',
  'Detecting portfolio projects, architecture, and tech stacks...',
  'Evaluating ATS score, formatting, and keyword alignment...',
  'Identifying priority weak areas and gap analysis...',
  'Finalizing persistent candidate profile in Kaushal AI...'
];

export const ResumeOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [profileResult, setProfileResult] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        setErrorMsg('Please upload a PDF or DOCX resume.');
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        setErrorMsg('Please upload a PDF or DOCX resume.');
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
    }
  };

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!resumeFile && !resumeText.trim()) {
      setErrorMsg('Please upload your resume PDF or paste resume text.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);

    try {
      const response = await submitResumeOnboarding({
        resumeFile,
        resumeText: resumeText.trim(),
        targetRole
      });

      clearInterval(stepInterval);

      if (response && response.profile) {
        setProfileResult(response.profile);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error('Failed to analyze candidate profile.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Onboarding error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Service is temporarily busy. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2.5rem 1.5rem',
        background: 'var(--bg-app)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '820px' }}>
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px var(--primary-glow)'
            }}
          >
            <Sparkles size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Let's build your <span className="gradient-text">AI interview profile</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Welcome, <strong>{user?.username || 'Candidate'}</strong>. Kaushal AI uses your real resume to personalize your
            mock interviews, project defense, weak areas, and daily challenges.
          </p>
        </div>

        {/* STEP 1: Upload Form */}
        {!profileResult && !loading && (
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.9rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  fontSize: '0.88rem',
                  marginBottom: '1.5rem'
                }}
              >
                <AlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStartAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Target Engineering Role <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '0.95rem' }}
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="DevOps / Cloud Engineer">DevOps / Cloud Engineer</option>
                </select>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Upload Your Resume PDF <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${resumeFile ? 'var(--success)' : isDragging ? 'var(--primary)' : 'var(--border-strong)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: resumeFile ? 'var(--success-bg)' : 'var(--bg-surface-elevated)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  {resumeFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={36} color="var(--success)" />
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {resumeFile.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {(resumeFile.size / 1024).toFixed(1)} KB • Click or drop to replace
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Upload size={36} color="var(--primary)" />
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Click to upload</span>
                        <span style={{ color: 'var(--text-secondary)' }}> or drag and drop your PDF resume here</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Supported: PDF, DOCX (Max 5MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Paste Text Alternate */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Or paste resume text directly (if you don't have a PDF file):
                </label>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume sections, skills, and projects here..."
                  className="textarea-field"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  gap: '0.5rem'
                }}
              >
                <span>Analyze Resume & Build AI Profile</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Loading State */}
        {loading && (
          <div
            className="glass-card"
            style={{
              padding: '3rem 2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--primary)',
                animation: 'pulseGlow 1.5s infinite ease-in-out'
              }}
            >
              <Bot size={32} color="var(--primary)" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Analyzing Your Resume with Gemini AI
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                {ANALYSIS_STEPS[currentStepIndex]}
              </p>
            </div>

            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {ANALYSIS_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: idx === currentStepIndex ? '28px' : '10px',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: idx <= currentStepIndex ? 'var(--primary)' : 'rgba(255, 255, 255, 0.12)',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Results Summary & Dashboard Entry */}
        {profileResult && (
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  border: '1px solid var(--success)'
                }}
              >
                <CheckCircle2 size={26} color="var(--success)" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Your AI Interview Profile is Ready!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Here are the real insights extracted from your resume. This data is now driving your entire Kaushal AI platform.
              </p>
            </div>

            {/* Highlighted Score Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATS SCORE</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                  {profileResult.atsScore}%
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKILLS DETECTED</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                  {profileResult.extractedSkills?.length || 0}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROJECTS DETECTED</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>
                  {profileResult.projects?.length || 0}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRIORITY WEAK AREAS</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>
                  {profileResult.weakAreas?.length || 0}
                </div>
              </div>
            </div>

            {/* Extracted Skills */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Extracted Skills & Technologies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profileResult.extractedSkills?.slice(0, 15).map((skill, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ padding: '0.35rem 0.75rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Detected Projects for Defense */}
            {profileResult.projects?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Detected Projects (Used in Project Defense)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profileResult.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {proj.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '0.15rem' }}>
                        Tech Stack: {proj.techStack?.join(', ') || 'Full Stack'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Areas Detected */}
            {profileResult.weakAreas?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Identified Weak Areas & Preparation Priorities
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profileResult.weakAreas.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: w.severity === 'high' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                        border: `1px solid ${w.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: w.severity === 'high' ? 'var(--danger)' : 'var(--warning)' }}>
                        {w.name} ({w.severity.toUpperCase()} Priority)
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {w.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/app/dashboard')}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-lg)',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              <span>Continue to Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeOnboarding;
