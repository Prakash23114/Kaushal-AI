import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Search,
  Sparkles,
  Bot,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';

const QUESTIONS_DATA = [
  {
    id: 'js-1',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    topic: 'Event Loop & Concurrency',
    question: 'How does the JavaScript Event Loop handle microtasks vs macrotasks?',
    concepts: 'Call stack, Event Loop, Promises (Microtasks), setTimeout/setInterval (Macrotasks), execution priority.',
    answer: 'The Event Loop checks the call stack first. Once the call stack is empty, it flushes the entire microtask queue (Promises, queueMicrotask, MutationObserver) before executing the oldest macrotask from the task queue (setTimeout, setInterval, I/O events). This is why Promise.then() runs before setTimeout(..., 0).'
  },
  {
    id: 'js-2',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    topic: 'Closures & Scope',
    question: 'What is a closure in JavaScript and what are realistic production use-cases?',
    concepts: 'Lexical scoping, memory retention, data privacy, currying, event handlers.',
    answer: 'A closure is the combination of a function bundled together with references to its surrounding lexical state. Closures allow inner functions to access outer variables even after the outer function has returned. Production use cases include data encapsulation (private variables), function factories, currying, and memoization.'
  },
  {
    id: 'react-1',
    category: 'React',
    difficulty: 'Intermediate',
    topic: 'Reconciliation & Virtual DOM',
    question: 'How does React Virtual DOM diffing algorithm work, and why do keys matter in lists?',
    concepts: 'Virtual DOM, reconciliation, heuristic O(n) diffing, element types, key reconciliation.',
    answer: 'React employs an O(n) heuristic diffing algorithm based on two assumptions: elements of different types generate different trees, and the developer can hint at which elements remain stable across renders using keys. Without unique, stable keys, React might unmount and recreate entire component subtrees or misattribute state between list items.'
  },
  {
    id: 'react-2',
    category: 'React',
    difficulty: 'Advanced',
    topic: 'Performance & Optimization',
    question: 'When should you use useMemo, useCallback, and React.memo, and when are they harmful?',
    concepts: 'Referential equality, re-renders, premature optimization, memory overhead, dependency arrays.',
    answer: 'React.memo skips re-rendering a child if props do not change. useCallback caches function instances across renders to preserve referential equality when passed to memoized children. useMemo caches expensive computational results. They are harmful when applied prematurely to lightweight calculations, where the overhead of instantiating the hook and checking dependencies exceeds the savings.'
  },
  {
    id: 'node-1',
    category: 'Node.js',
    difficulty: 'Intermediate',
    topic: 'Architecture & Thread Pool',
    question: 'How does Node.js handle concurrency if it is single-threaded?',
    concepts: 'Single-threaded event loop, libuv thread pool, non-blocking asynchronous I/O, epoll/kqueue.',
    answer: 'Node.js runs the JavaScript main thread on a single-threaded Event Loop, but delegates non-blocking asynchronous I/O operations (network sockets, timers) to the operating system kernel via epoll/kqueue. For CPU-bound tasks or file system operations that lack async OS support, Node utilizes the libuv thread pool (default 4 threads).'
  },
  {
    id: 'mongo-1',
    category: 'MongoDB',
    difficulty: 'Intermediate',
    topic: 'Indexing & Aggregations',
    question: 'How do compound indexes work in MongoDB and what is the ESR rule?',
    concepts: 'B-tree index, prefix matching, ESR rule (Equality, Sort, Range), explain() analysis.',
    answer: 'A compound index holds references to multiple fields. The ESR rule states the optimal order for fields in a compound index: 1. Equality fields first (exact matches), 2. Sort fields second (avoids in-memory sorting), 3. Range fields last ($gt, $lt, $in). Index prefixes must match query filters from left to right.'
  },
  {
    id: 'sd-1',
    category: 'System Design',
    difficulty: 'Advanced',
    topic: 'Scalability & Caching',
    question: 'How would you scale a read-heavy system handling 100k requests per second?',
    concepts: 'Load balancers, CDN, Redis/Memcached, read replicas, database sharding, cache invalidation.',
    answer: 'Use a multi-tiered approach: 1. Edge caching via CDN for static and cacheable dynamic responses. 2. DNS-level and reverse proxy load balancing (e.g. NGINX/HAProxy). 3. Distributed in-memory caching (Redis cluster) using Cache-Aside strategy. 4. Database read replicas with read/write splitting. 5. Rate limiting and circuit breaking (Resilience4j) to prevent cascading outages.'
  },
  {
    id: 'dsa-1',
    category: 'DSA',
    difficulty: 'Intermediate',
    topic: 'Two Pointers & Sliding Window',
    question: 'Explain the sliding window technique and when to choose it over two pointers.',
    concepts: 'Continuous subarray/substring, dynamic vs fixed window size, hash map state, O(n) time complexity.',
    answer: 'Sliding window is an optimization technique used to transform nested O(n^2) loops over contiguous arrays or strings into a single O(n) pass. A fixed window maintains a constant length k, while a dynamic window expands the right pointer and contracts the left pointer based on condition criteria (e.g., longest substring without repeating characters).'
  },
  {
    id: 'genai-1',
    category: 'GenAI',
    difficulty: 'Intermediate',
    topic: 'RAG & Embeddings',
    question: 'What is Retrieval-Augmented Generation (RAG) and how does it prevent LLM hallucination?',
    concepts: 'Vector embeddings, semantic search, cosine similarity, prompt grounding, context injection.',
    answer: 'RAG pairs an LLM with an external knowledge base. When a user queries the system, relevant document chunks are retrieved from a vector database using semantic similarity search (cosine distance). These retrieved facts are injected into the prompt context, grounding the LLM in verified real-time data and significantly mitigating hallucinations.'
  },
  {
    id: 'beh-1',
    category: 'Behavioral',
    difficulty: 'Intermediate',
    topic: 'Conflict & Collaboration',
    question: 'Describe a time you proposed a technical direction that was rejected by your team. How did you react?',
    concepts: 'STAR method, emotional intelligence, team alignment, disagree and commit, constructive debate.',
    answer: 'Structure with STAR: Situation (describe technical decision), Task (your goal), Action (how you presented trade-offs, listened objectively to objections, and evaluated alternative criteria), Result (agreed on team consensus, committed wholeheartedly, and prioritized project delivery over personal ego).'
  },
  {
    id: 'proj-1',
    category: 'Projects',
    difficulty: 'Intermediate',
    topic: 'Authentication & Security',
    question: 'How did you handle authentication and authorization in your project? What security vulnerabilities did you guard against?',
    concepts: 'JWT, httpOnly cookies, CSRF protection, token blacklisting, role-based access control, input sanitization.',
    answer: 'Detail the complete token lifecycle: User signs in -> server signs JWT with secret -> stores in secure, httpOnly, sameSite cookie to prevent XSS theft. Protected routes verify JWT via middleware and check token blacklist on logout. Guarded against SQL/NoSQL injection using ODM/ORM parameterization and input validation with Zod.'
  }
];

const CATEGORIES = [
  'All',
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'System Design',
  'DSA',
  'GenAI',
  'Behavioral',
  'Projects'
];

export const QuestionBank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [openIds, setOpenIds] = useState({});

  // Bookmarks & Practiced states in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('kaushal_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [practiced, setPracticed] = useState(() => {
    try {
      const saved = localStorage.getItem('kaushal_practiced_ids');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('kaushal_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const togglePracticed = (id) => {
    setPracticed((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('kaushal_practiced_ids', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleOpen = (id) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = QUESTIONS_DATA.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      q.question.toLowerCase().includes(query) ||
      q.concepts.toLowerCase().includes(query) ||
      q.topic.toLowerCase().includes(query);

    return matchesCategory && matchesDifficulty && matchesQuery;
  });

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Curated <span className="gradient-text">Interview Question Bank</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Real technical and behavioral questions asked at leading tech companies with expected concepts and model answer guides.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
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
              placeholder="Search by keyword, concept, or topic..."
              className="input-field"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field"
            style={{ width: '180px' }}
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Category Pill Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing {filteredQuestions.length} questions
          </span>
        </div>

        {filteredQuestions.map((q) => {
          const isOpen = !!openIds[q.id];
          const isBookmarked = !!bookmarks[q.id];
          const isPracticed = !!practiced[q.id];

          return (
            <div
              key={q.id}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                borderColor: isOpen ? 'var(--border-hover)' : 'var(--border-subtle)',
              }}
            >
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleOpen(q.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <span className="badge badge-primary">{q.category}</span>
                    <span
                      className={`badge ${
                        q.difficulty === 'Advanced'
                          ? 'badge-danger'
                          : q.difficulty === 'Intermediate'
                          ? 'badge-warning'
                          : 'badge-success'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {q.topic}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
                    {q.question}
                  </h3>
                </div>

                {/* Actions: Bookmark, Practiced, Expand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    style={{
                      padding: '0.4rem',
                      color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>

                  <button
                    onClick={() => togglePracticed(q.id)}
                    title={isPracticed ? 'Marked as Practiced' : 'Mark as Practiced'}
                    style={{
                      padding: '0.4rem',
                      color: isPracticed ? 'var(--success)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <CheckCircle size={18} />
                  </button>

                  <button
                    onClick={() => toggleOpen(q.id)}
                    style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
                  >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div
                  style={{
                    padding: '0 1.5rem 1.5rem',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '0.85rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <strong style={{ color: 'var(--primary)' }}>Key Concepts to Cover: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{q.concepts}</span>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Model Explanation:</div>
                    {q.answer}
                  </div>

                  {/* Ask AI Coach button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() =>
                        navigate(
                          `/app/coach?prompt=${encodeURIComponent(
                            `Can you explain this interview question and drill me with follow-ups: "${q.question}"`
                          )}`
                        )
                      }
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Bot size={15} />
                      <span>Ask AI Coach for Deep Dive</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionBank;
