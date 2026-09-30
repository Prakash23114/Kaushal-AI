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
import { getProfileMe } from '../Features/interview/services/interview.api';

const LOADING_STAGES = [
  'Reading verified candidate resume and target role...',
  'Understanding Target Job Description requirements...',
  'Comparing candidate capabilities against role standards...',
  'Generating realistic technical interview questions...',
  'Formulating STAR behavioral scenario frameworks...',
  'Synthesizing day-by-day 14-day preparation roadmap...',
  'Finalizing your customized Kaushal AI strategy in database...',
];

export const NewInterview = () => {
  const { generateReport } = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const resumeInputRef = useRef();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfileMe();
        if (res?.profile) {
          setCandidateProfile(res.profile);
        }
      } catch (err) {
        console.warn('Failed to load profile for new interview:', err);
      }
    };
    loadProfile();
  }, []);

  // Multi-stage loader timer simulation
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev < LOADING_STAGES.length - 1) return prev + 1;
          return prev;
        });
      }, 3500);
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

    if (!resumeFile && !candidateProfile?.resumeText && !selfDescription.trim()) {
      setErrorMsg('Please upload your Resume PDF or provide candidate background.');
      return;
    }

    setLoading(true);

    try {
      const response = await generateReport({
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resumeFile: resumeFile || null,
      });

      const reportId = response?._id || response?.interviewReport?._id;
      if (reportId) {
        navigate(`/app/interview/${reportId}`);
      } else {
        setErrorMsg('Failed to generate interview strategy. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Service is temporarily busy. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Create New <span className="gradient-text">Interview Strategy</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Target a specific company or role. Kaushal AI synthesizes your verified resume against the job description to
          generate technical questions, STAR behavioral frameworks, and a day-by-day 14-day preparation plan.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="glass-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-xl)' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Error Notice */}
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

          {/* Target Job Description */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Target Job Description <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required</span>
            </div>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description, role requirements, and responsibilities here..."
              className="textarea-field"
              required
              disabled={loading}
              style={{ fontSize: '0.92rem' }}
            />
          </div>

          {/* Stored Resume Notice OR Upload */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Candidate Resume
              </label>
              {resumeFile && candidateProfile?.resumeFileName && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Revert to Stored Resume ({candidateProfile.resumeFileName})
                </button>
              )}
            </div>

            {candidateProfile?.resumeFileName && !resumeFile ? (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileCheck size={24} color="var(--success)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      Using Stored Resume: {candidateProfile.resumeFileName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ATS Score: {candidateProfile.atsScore}% • {candidateProfile.extractedSkills?.length || 0} skills detected
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Upload size={14} />
                  <span>Upload Different Resume</span>
                </button>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div
                onClick={() => resumeInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${resumeFile ? 'var(--success)' : isDragging ? 'var(--primary)' : 'var(--border-strong)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: resumeFile ? 'var(--success-bg)' : 'var(--bg-surface-elevated)',
                  transition: 'all var(--transition-fast)'
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <FileCheck size={28} color="var(--success)" />
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', display: 'block' }}>{resumeFile.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {(resumeFile.size / 1024).toFixed(1)} KB • Newly selected for this strategy • Click or drop to change
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{ padding: '0.4rem', color: 'var(--text-muted)', marginLeft: '1rem' }}
                      title="Remove file"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={32} color="var(--primary)" />
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Click to upload</span>
                      <span style={{ color: 'var(--text-secondary)' }}> or drag and drop your PDF resume</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF up to 5MB</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Self Description / Extra Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Additional Context / Self Description (Optional)
            </label>
            <textarea
              rows={3}
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Highlight any specific projects, target salary band, or particular concepts you want emphasized..."
              className="textarea-field"
              disabled={loading}
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', padding: '0.95rem', gap: '0.5rem', borderRadius: 'var(--radius-lg)' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin-animation" />
                <span>{LOADING_STAGES[currentStageIndex]}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Tailored Strategy & Questions</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewInterview;
