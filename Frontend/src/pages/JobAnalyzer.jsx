import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Check,
  X,
  ArrowRight
} from 'lucide-react';
import { analyzeJobDescription } from '../Features/interview/services/interview.api';

export const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setErrorMsg('Please paste a job description.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await analyzeJobDescription({
        jobDescription: jobDescription.trim(),
        resumeText: resumeText.trim(),
      });

      if (response && response.analysis) {
        setAnalysis(response.analysis);
      } else {
        setErrorMsg('Failed to analyze job description.');
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
          Job Description <span className="gradient-text">Analyzer & Skill Matcher</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Deconstruct job descriptions into required skills, preferred competencies, and compare against your background.
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Job Description <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <textarea
                rows={9}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="textarea-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Your Resume / Profile Summary (Optional)
              </label>
              <textarea
                rows={9}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your skills, experience, or resume text to generate match comparison..."
                className="textarea-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <Sparkles size={16} />
              <span>{loading ? 'Extracting & Matching...' : 'Analyze Job Description'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Overview Banner */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                Target Position
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analysis.roleTitle}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Estimated Seniority: <strong>{analysis.experienceLevel || 'Mid-Senior'}</strong>
              </p>
            </div>
          </div>

          {/* Skill Breakdown: Matched vs Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Matched Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="var(--success)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Matched Skills</h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.matchedSkills?.length > 0 ? (
                  analysis.matchedSkills.map((sk, i) => (
                    <span key={i} className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                      <Check size={12} style={{ marginRight: '3px' }} />
                      {sk}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Provide resume text to calculate matches.
                  </span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertCircle size={20} color="var(--danger)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Missing Required Skills</h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.missingSkills?.map((sk, i) => (
                  <span key={i} className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    <X size={12} style={{ marginRight: '3px' }} />
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Core Requirements & Responsibilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Required Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Mandatory Technical Stack
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.requiredSkills?.map((sk, i) => (
                  <span key={i} className="badge badge-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Bonus & Preferred Skills
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.preferredSkills?.map((sk, i) => (
                  <span key={i} className="badge badge-info" style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Preparation Recommendations */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Priority Preparation Checklist for this Role
            </h4>
            <div style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {analysis.preparationRecommendations}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;
