import React, { useState, useEffect, useRef } from 'react';
import {
  FileSearch,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  TrendingUp,
  X,
  Layers,
  Award,
  ArrowRight,
  FolderGit2
} from 'lucide-react';
import { analyzeResume, getProfileMe } from '../Features/interview/services/interview.api';

export const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef();

  // Load existing CandidateProfile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfileMe();
        if (res?.profile) {
          setCurrentProfile(res.profile);
          if (res.profile.targetRoles?.[0]) {
            setTargetRole(res.profile.targetRoles[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      }
    };
    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        setErrorMsg('Please upload a PDF or DOCX file.');
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
      setSuccessMsg('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeFile && !resumeText.trim()) {
      setErrorMsg('Please provide a resume PDF or paste resume text.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await analyzeResume({
        resumeFile,
        resumeText: resumeText.trim(),
        targetRole,
      });

      if (response && (response.analysis || response.profile)) {
        setAnalysis(response.analysis);
        if (response.profile) {
          setCurrentProfile(response.profile);
        }
        setSuccessMsg('Resume re-analyzed successfully! Candidate profile and dashboard have been updated.');
      } else {
        setErrorMsg('Failed to analyze resume. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Service is temporarily busy. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const displayData = analysis || currentProfile;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          ATS Resume <span className="gradient-text">Diagnostics & Scoring</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Evaluate ATS compatibility, keyword density, technical depth, project metrics, and role alignment.
          Re-analyzing your resume automatically updates your Kaushal AI candidate profile and dashboard.
        </p>
      </div>

      {/* Input / Upload Card */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                fontSize: '0.88rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                fontSize: '0.88rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Upload PDF */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Upload New Resume PDF
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-strong)',
                  background: resumeFile ? 'var(--success-bg)' : 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderColor: resumeFile ? 'var(--success)' : 'var(--border-subtle)',
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <FileCheck size={28} color="var(--success)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{resumeFile.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to replace</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <Upload size={28} color="var(--primary)" />
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      {currentProfile?.resumeFileName ? `Replace ${currentProfile.resumeFileName}` : 'Choose PDF file or drop here'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, DOCX up to 5MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Role & Text Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Target Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="input-field"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="DevOps / Cloud Engineer">DevOps / Cloud Engineer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Or paste resume text directly:
                </label>
                <textarea
                  rows={3}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste text if you don't have a PDF file..."
                  className="textarea-field"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', gap: '0.5rem', borderRadius: 'var(--radius-md)' }}
          >
            <Sparkles size={18} />
            <span>{loading ? 'Re-analyzing with Gemini AI...' : 'Re-analyze & Update Profile'}</span>
          </button>
        </form>
      </div>

      {/* Diagnostics Results Display */}
      {displayData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATS READINESS SCORE</span>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {displayData.atsScore || 70}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--success)' }}>
                Machine parseability evaluated
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TECHNICAL STRENGTH</span>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
                {displayData.technicalStrength || 75}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Tech stack depth
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROJECT ARCHITECTURE</span>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--secondary)', marginTop: '0.25rem' }}>
                {displayData.projectStrength || 75}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Demonstrated complexity
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE RELEVANCE</span>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--warning)', marginTop: '0.25rem' }}>
                {displayData.roleRelevance || 75}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Target role alignment
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          {displayData.extractedSkills?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Extracted Skills & Technologies
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {displayData.extractedSkills.map((skill, idx) => (
                  <span key={idx} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects Detected */}
          {displayData.projects?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FolderGit2 size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Resume Projects</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {displayData.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {proj.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                      Technologies: {proj.techStack?.join(', ') || 'N/A'}
                    </div>
                    {proj.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Areas & Improvement Priorities */}
          {displayData.weakAreas?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertCircle size={18} color="var(--warning)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Identified Weak Areas</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {displayData.weakAreas.map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
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

          {/* Actionable Recommendations */}
          {displayData.recommendations?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Actionable Optimization Steps
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {displayData.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
