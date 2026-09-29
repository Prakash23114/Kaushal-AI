import React, { useState, useRef } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { analyzeResume } from '../Features/interview/services/interview.api';

export const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef();

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

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeFile && !resumeText.trim()) {
      setErrorMsg('Please provide a resume PDF or paste resume text.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await analyzeResume({
        resumeFile,
        resumeText: resumeText.trim(),
        targetRole,
      });

      if (response && response.analysis) {
        setAnalysis(response.analysis);
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

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          ATS Resume <span className="gradient-text">Diagnostics & Scoring</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Evaluate ATS compatibility, keyword density, technical depth, project metrics, and role alignment.
        </p>
      </div>

      {/* Input Card */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Upload PDF */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Upload Resume PDF
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
                    <Upload size={28} color="var(--text-muted)" />
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Select PDF or DOCX</span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Role & Paste option */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Or Paste Text
                </label>
                <textarea
                  rows={3}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume content here if you do not have a PDF..."
                  className="textarea-field"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <Sparkles size={16} />
              <span>{loading ? 'Analyzing with Gemini...' : 'Analyze Resume'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Visual Analysis Results ── */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 4 Score Gauges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {[
              { label: 'ATS Compatibility', score: analysis.atsScore, color: 'var(--primary)' },
              { label: 'Technical Depth', score: analysis.technicalStrength, color: 'var(--success)' },
              { label: 'Project Impact', score: analysis.projectStrength, color: 'var(--secondary)' },
              { label: 'Role Suitability', score: analysis.roleRelevance, color: 'var(--accent-cyan)' },
            ].map((metric, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: `4px solid ${metric.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    margin: '0 auto 0.75rem',
                    color: metric.color,
                  }}
                >
                  {metric.score}%
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Missing Keywords & Extracted Skills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Missing Keywords */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertCircle size={20} color="var(--danger)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>High-Impact Missing Keywords</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Include these industry keywords to clear recruiter ATS automated screening:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.missingKeywords?.map((kw, i) => (
                  <span key={i} className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="var(--success)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Demonstrated Skills Found</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Verified skills successfully recognized in your resume:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.extractedSkills?.map((sk, i) => (
                  <span key={i} className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Weak Sections & Specific Fixes */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Section-by-Section Revisions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analysis.weakSections?.map((ws, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--warning)', marginBottom: '0.35rem' }}>
                    Section: {ws.section}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    <strong>Detected Issue:</strong> {ws.issue}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    <strong>Actionable Fix:</strong> {ws.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Actionable Optimization Checklist
            </h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              {analysis.actionableSuggestions?.map((sug, i) => (
                <li key={i} style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
