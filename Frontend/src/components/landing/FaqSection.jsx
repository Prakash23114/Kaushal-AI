import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Which technical roles does Kaushal AI prepare me for?',
      a: 'Kaushal AI is customized for Software Development Engineers (SDE 1/2), Frontend Developers, Backend Engineers, Full Stack Developers, Data Analysts, DevOps/Cloud Engineers, and QA/SDET roles. You can customize questions according to your exact target tech stack.',
    },
    {
      q: 'How do the AI technical mock interviews work?',
      a: 'You select your desired tech role, topic (such as DSA, System Design, React, Node.js, or SQL), and difficulty. Kaushal AI acts as an experienced tech interviewer, asking live coding questions, architecture trade-offs, and behavioral questions. You answer via text or voice and get instant evaluation on technical precision and STAR methodology.',
    },
    {
      q: 'Can I practice project defense and architecture questions?',
      a: 'Yes! Kaushal AI analyzes your uploaded projects from your resume, probing you on database design decisions, state management, latency bottlenecks, microservices vs monolith trade-offs, and scalability.',
    },
    {
      q: 'How does the Resume Analyzer optimize my tech CV for ATS?',
      a: 'The Resume Analyzer scans your resume just like modern engineering recruiter ATS tools do. It identifies missing tech stack keywords, evaluates the impact metrics of your project bullet points, checks GitHub link visibility, and gives actionable advice to maximize interview callbacks.',
    },
    {
      q: 'Is Kaushal AI free for engineering and college students?',
      a: 'Yes, Kaushal AI is 100% free and open for college students, developers, and job seekers preparing for campus placement drives and off-campus tech interviews.',
    },
    {
      q: 'Can I practice on mobile or tablet?',
      a: 'Yes, Kaushal AI is fully responsive across desktops, laptops, tablets, and mobile phones, so you can practice question drills and review technical roadmaps anywhere.',
    },
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faqs"
      style={{
        padding: '4rem 0 4.5rem',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--lp-border)',
        borderBottom: '1px solid var(--lp-border)',
        position: 'relative',
      }}
    >
      <div className="lp-container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--lp-peach)',
              border: '1px solid var(--lp-primary-border)',
              borderRadius: '9999px',
              padding: '0.3rem 0.85rem',
              marginBottom: '0.65rem',
            }}
          >
            <HelpCircle size={13} color="var(--lp-primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lp-primary)' }}>
              Got Questions?
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 2.8vw, 2.3rem)',
              fontWeight: 800,
              color: 'var(--lp-text-dark)',
              margin: '0 0 0.5rem',
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--lp-text-muted)', margin: 0 }}>
            Everything you need to know about preparing for your engineering career with Kaushal AI.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div
          style={{
            maxWidth: '820px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isOpen ? '#FFF9F4' : '#FFFFFF',
                  border: `1.5px solid ${isOpen ? 'var(--lp-primary-border)' : 'var(--lp-border)'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? 'var(--lp-shadow-sm)' : 'none',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  aria-expanded={isOpen}
                >
                  <span
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      color: isOpen ? 'var(--lp-primary)' : 'var(--lp-text-dark)',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'var(--lp-peach)' : '#F5EFE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <ChevronDown size={15} color={isOpen ? 'var(--lp-primary)' : 'var(--lp-text-dark)'} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.35rem 1.25rem',
                      color: 'var(--lp-text-secondary)',
                      fontSize: '0.91rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(240, 228, 213, 0.6)',
                      paddingTop: '0.85rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
