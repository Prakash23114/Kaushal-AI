import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  Upload,
  Briefcase,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useInterview } from '../Features/interview/hooks/useInterview';

const LOADING_STAGES = [
  'Analyzing Resume PDF & extracting core skills...',
  'Understanding Target Job Description requirements...',
  'Comparing candidate capabilities against role standards...',
  'Generating realistic technical interview questions...',
  'Formulating STAR behavioral scenario frameworks...',
  'Synthesizing day-by-day 14-day preparation roadmap...',
  'Finalizing your customized Kaushal AI strategy...',
];

export const NewInterview = () => {
  const { generateReport } = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const resumeInputRef = useRef();

  // Multi-stage loader timer simulation
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev < LOADING_STAGES.length - 1) return prev + 1;
          return prev;
        });
      }, 4200);
    } else {
      setCurrentStageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        setErrorMsg('Please upload a PDF or DOCX file.');
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        setErrorMsg('Please upload a PDF or DOCX file.');
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResumeFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!jobDescription.trim()) {
      setErrorMsg('Target Job Description is required.');
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      setErrorMsg('Please upload your Resume PDF or provide a Self Description.');
      return;
    }

    setLoading(true);
    try {
      const fileToUpload = resumeFile || resumeInputRef.current?.files?.[0];
      const data = await generateReport({
        jobDescription,
        selfDescription: selfDescription.trim() || 'Candidate profile based on uploaded resume.',
        resumeFile: fileToUpload,
      });

      if (data && data._id) {
        navigate(`/app/interview/${data._id}`);
      } else {
        setErrorMsg('Failed to generate interview report. The AI service may be experiencing high demand.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'AI service is temporarily busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Create Your <span className="gradient-text">AI Interview Strategy</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Our AI compares your profile against the job description to generate targeted technical questions,
          behavioral STAR answers, skill gap diagnostics, and a personalized 14-day roadmap.
        </p>
      </div>

      {/* Multi-Stage Loading Screen Overlay */}
      {loading && (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-hover)',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.75rem',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--primary)',
              animation: 'pulseGlow 2s infinite ease-in-out',
            }}
          >
            <Sparkles size={32} color="var(--primary)" />
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Building Your Custom Strategy
            </h3>
            <p
              style={{
                color: 'var(--primary)',
                fontSize: '1.05rem',
                fontWeight: 600,
                minHeight: '2rem',
                transition: 'opacity 0.3s ease',
              }}
            >
              {LOADING_STAGES[currentStageIndex]}
            </p>
          </div>

          {/* Stepper pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              maxWidth: '650px',
            }}
          >
            {LOADING_STAGES.map((stage, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === currentStageIndex ? '28px' : '10px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background:
                    idx < currentStageIndex
                      ? 'var(--success)'
                      : idx === currentStageIndex
                      ? 'var(--primary)'
                      : 'rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Processing deep candidate alignment via Gemini 3.8 Flash • Approx 25-35s
          </span>
        </div>
      )}

      {/* Main Dual-Panel Form */}
      {!loading && (
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--danger)',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>{errorMsg}</div>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                style={{ color: 'var(--danger)', padding: '0.25rem' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Left Panel: Target Job Description */}
            <div
              className="glass-card"
              style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Target Job Description</h3>
                </div>
                <span className="badge badge-primary">Required</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Paste the full job posting including required skills, technologies, and responsibilities.
              </p>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={`e.g. Senior Frontend Engineer at Atlassian:
Proficiency in React, TypeScript, state management, Micro-frontends, Webpack/Vite.
Experience with large-scale web performance, REST and GraphQL APIs, testing with Jest/Playwright.`}
                className="textarea-field"
                rows={12}
                maxLength={5000}
                style={{ resize: 'vertical', flex: 1, minHeight: '250px' }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                {jobDescription.length} / 5000 characters
              </div>
            </div>

            {/* Right Panel: Resume Upload & Self-Description */}
            <div
              className="glass-card"
              style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Candidate Profile</h3>
              </div>

              {/* Upload Dropzone */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Upload Resume PDF</label>
                  <span className="badge badge-success">Recommended</span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => resumeInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${
                      isDragging
                        ? 'var(--primary)'
                        : resumeFile
                        ? 'var(--success)'
                        : 'var(--border-strong)'
                    }`,
                    background: isDragging
                      ? 'rgba(99, 102, 241, 0.08)'
                      : resumeFile
                      ? 'var(--success-bg)'
                      : 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                  }}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  {resumeFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={36} color="var(--success)" />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {resumeFile.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {(resumeFile.size / 1024).toFixed(1)} KB • Click to change file
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="btn btn-sm btn-danger"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <X size={14} />
                        <span>Remove File</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <Upload size={32} color="var(--text-muted)" />
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        Click to upload or drag & drop resume
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        PDF or DOCX format (Max 5MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* OR Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              </div>

              {/* Self Description Fallback */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Quick Self-Description
                </label>
                <textarea
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Describe your tech stack, years of experience, key projects, and domains if you don't have a resume PDF ready..."
                  className="textarea-field"
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span>Personalized Gemini AI Strategy Generation • Approx 30s</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ gap: '0.65rem' }}
            >
              <Sparkles size={18} />
              <span>Generate My Interview Strategy</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewInterview;
