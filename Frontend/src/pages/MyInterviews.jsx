import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  History,
  Sparkles,
  Clock,
  ExternalLink,
  PlusCircle,
  Search,
  Printer,
  ChevronRight,
  Award
} from 'lucide-react';
import { useInterview } from '../Features/interview/hooks/useInterview';

export const MyInterviews = () => {
  const { reports, getReports, loading, getResumePdf } = useInterview();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    getReports();
  }, []);

  const handleDownloadPdf = async (e, reportId) => {
    e.stopPropagation();
    setDownloadingId(reportId);
    try {
      await getResumePdf(reportId);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredReports = (reports || []).filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (r.title && r.title.toLowerCase().includes(query)) ||
      (r.jobDescription && r.jobDescription.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            My Interview <span className="gradient-text">History</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review all previously generated interview plans, question banks, and ATS resumes.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/new-interview')}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <PlusCircle size={16} />
          <span>New Strategy</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved interview plans by job title or keyword..."
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={32} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading interview strategies...</p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredReports.map((r) => {
            const isHigh = r.matchScore >= 80;
            const isMid = r.matchScore >= 60;
            const scoreBadgeClass = isHigh ? 'badge-success' : isMid ? 'badge-primary' : 'badge-warning';

            return (
              <div
                key={r._id}
                onClick={() => navigate(`/app/interview/${r._id}`)}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all var(--transition-normal)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <span className={`badge ${scoreBadgeClass}`} style={{ fontSize: '0.8rem' }}>
                      {r.matchScore}% Match
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                    {r.title || 'Untitled Target Role'}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      marginTop: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {r.jobDescription?.slice(0, 140)}...
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    onClick={(e) => handleDownloadPdf(e, r._id)}
                    disabled={downloadingId === r._id}
                    className="btn btn-ghost btn-sm"
                    style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                    title="Download ATS Resume"
                  >
                    <Printer size={14} />
                    <span>{downloadingId === r._id ? 'Generating...' : 'PDF Resume'}</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
                    <span>Open Strategy</span>
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: '3rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <History size={36} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            No interview strategies found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            {searchQuery ? 'Try clearing your search query.' : 'Create your first interview strategy using AI analysis.'}
          </p>
          <button onClick={() => navigate('/app/new-interview')} className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Create New Strategy</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyInterviews;
