import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Check,
  X,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { analyzeJobDescription, getProfileMe } from '../Features/interview/services/interview.api';

export const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfileMe();
        if (res?.profile) {
          setCandidateProfile(res.profile);
          if (res.profile.resumeText) {
            setResumeText(res.profile.resumeText);
          }
        }
      } catch (e) {
        console.warn('Profile load warning:', e);
      }
    };
    loadProfile();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setErrorMsg('Please paste a target job description.');
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
          Deconstruct job descriptions into required skills, preferred competencies, and compare against your verified resume.
          Analyses are automatically saved to your account.
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
                Target Job Description <span style={{ color: 'var(--primary)' }}>*</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Your Verified Resume Profile
                </label>
                {candidateProfile?.resumeFileName && (
                  <span className="badge badge-success" style={{ gap: '0.3rem' }}>
                    <FileCheck size={12} />
                    <span>{candidateProfile.resumeFileName}</span>
                  </span>
                )}
              </div>
              <textarea
                rows={9}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Candidate resume text (prefilled from your profile)..."
                className="textarea-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', gap: '0.5rem', borderRadius: 'var(--radius-md)' }}
          >
            <Sparkles size={18} />
            <span>{loading ? 'Matching Skills & Saving to Account...' : 'Analyze Job & Match Skills'}</span>
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKILL MATCH</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {analysis.matchedSkills?.length
                  ? Math.round((analysis.matchedSkills.length / (analysis.matchedSkills.length + (analysis.missingSkills?.length || 1))) * 100)
                  : 65}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {analysis.matchedSkills?.length || 0} skills aligned
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE LEVEL</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.65rem' }}>
                {analysis.experienceLevel || 'Mid-Level'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {analysis.roleTitle || 'Engineer'}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MISSING SKILLS</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.25rem' }}>
                {analysis.missingSkills?.length || 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Target gaps to bridge
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Matched Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Matching Skills Found</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.matchedSkills?.map((skill, idx) => (
                  <span key={idx} className="badge badge-success" style={{ gap: '0.35rem' }}>
                    <Check size={12} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertCircle size={18} color="var(--danger)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Missing JD Requirements</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.missingSkills?.map((skill, idx) => (
                  <span key={idx} className="badge badge-danger" style={{ gap: '0.35rem' }}>
                    <X size={12} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Preparation Recommendations */}
          {analysis.preparationRecommendations?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Recommended Preparation Topics for this Job
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {analysis.preparationRecommendations.map((rec, idx) => (
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

export default JobAnalyzer;
