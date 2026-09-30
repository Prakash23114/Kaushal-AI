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
  Filter,
  CheckCircle2,
  Circle,
  Code2,
  Brain,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Calculator
} from 'lucide-react';
import {
  getQuestionBankData,
  toggleQuestionPracticed,
  toggleQuestionBookmarked
} from '../Features/interview/services/interview.api';

// Curated Question Bank strictly organized into APTITUDE and TECHNICAL (DSA)
const QUESTIONS_DATA = [
  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORY A: APTITUDE
  // ───────────────────────────────────────────────────────────────────────────

  // 1. Numerical Ability
  {
    id: 'apt-num-1',
    mainCategory: 'Aptitude',
    subCategory: 'Numerical Ability',
    difficulty: 'Intermediate',
    topic: 'Percentages & Ratios',
    question: 'A tech company increases its engineering team by 20% in Q1 and then reduces by 10% in Q2 due to budget realignment. What is the net percentage change in team size?',
    concepts: 'Net percentage change formula: a + b + (ab / 100). Base 100 calculation.',
    answer: 'Let initial team size be 100. After a 20% increase in Q1, team size is 120. In Q2, a 10% reduction on 120 gives: 120 - 12 = 108. Net change is +8% increase. Alternatively, using formula: +20 - 10 + (20 * -10)/100 = 10 - 2 = +8% net growth.'
  },
  {
    id: 'apt-num-2',
    mainCategory: 'Aptitude',
    subCategory: 'Numerical Ability',
    difficulty: 'Intermediate',
    topic: 'Speed, Time & Work',
    question: 'Worker A can complete a software deployment script in 6 hours, while Worker B takes 8 hours. If they collaborate with Worker C, the task takes only 2 hours. How long would Worker C take alone?',
    concepts: 'Work rate equivalence: 1/A + 1/B + 1/C = 1/Total.',
    answer: 'Combined rate: 1/A + 1/B + 1/C = 1/2. We know 1/6 + 1/8 = (4 + 3)/24 = 7/24. Therefore, 1/C = 1/2 - 7/24 = 12/24 - 7/24 = 5/24. Worker C alone requires 24 / 5 = 4.8 hours (4 hours and 48 minutes).'
  },
  {
    id: 'apt-num-3',
    mainCategory: 'Aptitude',
    subCategory: 'Numerical Ability',
    difficulty: 'Advanced',
    topic: 'Probability & Permutations',
    question: 'In a microservice cluster of 5 nodes, 2 nodes fail independently with probability p = 0.1 each. What is the probability that at least 4 nodes remain operational?',
    concepts: 'Binomial distribution: P(X >= 4) = P(X = 4) + P(X = 5). Success rate q = 0.9.',
    answer: 'Let n = 5, p_fail = 0.1, p_success = 0.9. P(X = 5) = (0.9)^5 = 0.59049. P(X = 4) = 5 * (0.9)^4 * (0.1)^1 = 5 * 0.6561 * 0.1 = 0.32805. P(At least 4 operational) = 0.59049 + 0.32805 = 0.91854 (~91.85%).'
  },

  // 2. Verbal Ability
  {
    id: 'apt-vrb-1',
    mainCategory: 'Aptitude',
    subCategory: 'Verbal Ability',
    difficulty: 'Beginner',
    topic: 'Sentence Correction & Grammar',
    question: 'Identify the grammatically correct sentence regarding asynchronous execution:\n(A) Neither the database connection nor the worker threads was terminated cleanly.\n(B) Neither the database connection nor the worker threads were terminated cleanly.',
    concepts: 'Subject-verb agreement with correlative conjunctions (neither...nor): the verb agrees with the closer subject ("worker threads" is plural).',
    answer: 'Option (B) is correct. In "neither...nor" constructions, the verb agrees in number with the subject closest to it. Here, "worker threads" is plural, requiring the plural verb "were terminated".'
  },
  {
    id: 'apt-vrb-2',
    mainCategory: 'Aptitude',
    subCategory: 'Verbal Ability',
    difficulty: 'Intermediate',
    topic: 'Critical Reasoning & Deductions',
    question: '"All distributed transactions that use two-phase commit incur latency overhead. No lightweight IoT devices can tolerate high latency overhead." What valid conclusion follows?',
    concepts: 'Categorical syllogism and contrapositive inference.',
    answer: 'Conclusion: No lightweight IoT devices can utilize distributed transactions with two-phase commit without violating their latency tolerances. Conversely, any system using 2PC incurs overhead that exceeds lightweight IoT thresholds.'
  },
  {
    id: 'apt-vrb-3',
    mainCategory: 'Aptitude',
    subCategory: 'Verbal Ability',
    difficulty: 'Intermediate',
    topic: 'Reading Comprehension & Tone',
    question: 'When an author describes an engineering decision as "an expedient stopgap rather than an architectural triumph," what does this signify about the design choice?',
    concepts: 'Connotation and critical tone inference.',
    answer: 'The author recognizes the decision as a temporary pragmatic workaround aimed at immediate problem resolution (technical debt), rather than an optimal, well-engineered, or sustainable long-term architectural solution.'
  },

  // 3. Reasoning Ability
  {
    id: 'apt-rea-1',
    mainCategory: 'Aptitude',
    subCategory: 'Reasoning Ability',
    difficulty: 'Intermediate',
    topic: 'Syllogisms & Logic',
    question: 'Statements: 1. All microservices communicate via REST or gRPC. 2. Some microservices that use gRPC use protocol buffers. 3. No protocol buffer service is schema-less. Which statement must be true?',
    concepts: 'Deductive reasoning and Venn logic.',
    answer: 'Some microservices using gRPC are not schema-less. Because those services use protocol buffers, and no protocol buffer service is schema-less, at least a subset of gRPC services enforce rigid schemas.'
  },
  {
    id: 'apt-rea-2',
    mainCategory: 'Aptitude',
    subCategory: 'Reasoning Ability',
    difficulty: 'Advanced',
    topic: 'Seating & Ordering Puzzles',
    question: 'Six developers (P, Q, R, S, T, U) are seated in a row. S is between P and R. Q is to the immediate right of R. T is to the extreme left. U is at the extreme right. What is the position of S from the left?',
    concepts: 'Linear arrangement constraints: Left to Right placement.',
    answer: 'Positions (1 to 6): 1. T (extreme left). 6. U (extreme right). Remaining positions: 2, 3, 4, 5. Since Q is immediate right of R, and S is between P and R, the order is P, S, R, Q. Combining gives: T, P, S, R, Q, U. Therefore, S is in position 3 from the left.'
  },
  {
    id: 'apt-rea-3',
    mainCategory: 'Aptitude',
    subCategory: 'Reasoning Ability',
    difficulty: 'Beginner',
    topic: 'Coding-Decoding',
    question: 'If "SYSTEM" is encoded as "TZTUFN" (+1 shift), how is "BINARY" encoded under the same rule?',
    concepts: 'Alphabetical cipher transformation.',
    answer: 'Each letter is shifted forward by 1 in the alphabet: B -> C, I -> J, N -> O, A -> B, R -> S, Y -> Z. "BINARY" becomes "CJOB SZ" ("CJOBSZ").'
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORY B: TECHNICAL (PURELY DSA)
  // ───────────────────────────────────────────────────────────────────────────

  // 1. Arrays
  {
    id: 'dsa-arr-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Arrays',
    difficulty: 'Intermediate',
    topic: 'Two Pointers & Greedy',
    question: 'How does the Two Pointers approach solve the "Container With Most Water" problem in O(n) time, and why is moving the shorter bar optimal?',
    concepts: 'Two pointers, greedy choice property, maximizing Area = min(h[l], h[r]) * (r - l).',
    answer: 'Place left pointer at 0 and right pointer at n - 1. The container area is limited by the shorter line: min(height[l], height[r]) * (r - l). Moving the taller pointer inwards would only decrease width without any possibility of increasing height (since the minimum remains bounded by the shorter line). Moving the shorter pointer inwards is the only way to potentially discover a taller boundary that offsets the reduced width.'
  },
  {
    id: 'dsa-arr-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Arrays',
    difficulty: 'Intermediate',
    topic: 'Kadane Algorithm',
    question: 'Explain Kadane’s algorithm for Maximum Subarray Sum. How does it handle an array of all negative numbers?',
    concepts: 'Dynamic Programming, greedy restart, running sum vs maximum sum, O(n) time, O(1) space.',
    answer: 'Kadane’s tracks currentSum and maxSum. At each element x, currentSum = max(x, currentSum + x). If currentSum falls below x, it resets to start a new subarray at x. For all negative numbers, initializing maxSum to -Infinity (or array[0]) ensures the result returns the single least negative element rather than 0.'
  },

  // 2. Strings
  {
    id: 'dsa-str-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Strings',
    difficulty: 'Intermediate',
    topic: 'Sliding Window',
    question: 'How do you find the Length of the Longest Substring Without Repeating Characters in O(n) time?',
    concepts: 'Dynamic sliding window, Hash Map / frequency array of last seen indices, O(n) time, O(min(m, n)) space.',
    answer: 'Maintain a window [left, right] and a Map storing each character’s latest seen index. As right iterates through the string, if s[right] is already in the map and its index >= left, jump left to map[s[right]] + 1. Update map[s[right]] = right and maxLen = max(maxLen, right - left + 1).'
  },
  {
    id: 'dsa-str-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Strings',
    difficulty: 'Advanced',
    topic: 'Pattern Matching',
    question: 'Compare KMP (Knuth-Morris-Pratt) algorithm with the naive string search. How does the LPS (Longest Prefix Suffix) array prevent redundant backtracking?',
    concepts: 'KMP algorithm, LPS preprocessing, deterministic finite automaton, O(n + m) time vs O(n * m) naive.',
    answer: 'Naive search resets the text pointer upon a mismatch, resulting in worst-case O(n * m). KMP precomputes the LPS array of the pattern in O(m). LPS[i] stores the length of the longest proper prefix of pattern[0..i] that is also a suffix. When a mismatch occurs at pattern[j], rather than restarting the text pointer, KMP slides the pattern by resetting j = LPS[j - 1], preserving linear O(n + m) time.'
  },

  // 3. Linked Lists
  {
    id: 'dsa-ll-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Linked Lists',
    difficulty: 'Intermediate',
    topic: 'Pointers & Reversal',
    question: 'How do you reverse a Singly Linked List iteratively and recursively in O(n) time and O(1) iterative space?',
    concepts: 'Three pointers (prev, curr, next), pointer manipulation, recursion call stack.',
    answer: 'Iterative: Maintain prev = null, curr = head. In a loop, store next = curr.next, redirect curr.next = prev, advance prev = curr, and advance curr = next. When curr is null, prev is the new head. Recursive: Base case if !head || !head.next return head. Recurse newHead = reverse(head.next), set head.next.next = head, head.next = null, and return newHead.'
  },
  {
    id: 'dsa-ll-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Linked Lists',
    difficulty: 'Intermediate',
    topic: 'Cycle Detection',
    question: 'Explain Floyd’s Tortoise and Hare algorithm for cycle detection in a linked list and how to locate the cycle starting node.',
    concepts: 'Two pointers at different speeds (1x and 2x), modular arithmetic proof, O(n) time, O(1) space.',
    answer: 'Step 1: Slow pointer moves 1 step, fast pointer moves 2 steps. If fast or fast.next is null, no cycle exists. If slow === fast, a cycle is confirmed. Step 2 (Find cycle entrance): Reset slow to head while keeping fast at the meeting point. Move both 1 step at a time. The node where they meet is the exact cycle entrance.'
  },

  // 4. Stack
  {
    id: 'dsa-stk-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Stack',
    difficulty: 'Intermediate',
    topic: 'Monotonic Stack',
    question: 'What is a Monotonic Stack and how does it solve the "Next Greater Element" problem in O(n) time?',
    concepts: 'Monotonic decreasing stack, indices caching, amortized O(1) push/pop per element.',
    answer: 'A monotonic decreasing stack maintains elements in non-increasing order. Iterate through the array: while the current element is greater than the element at the stack’s top, pop the top index and record the current element as its Next Greater Element. Then push the current element’s index. Each index is pushed and popped at most once, guaranteeing linear O(n) total time.'
  },
  {
    id: 'dsa-stk-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Stack',
    difficulty: 'Beginner',
    topic: 'Parentheses Matching',
    question: 'How do you implement a Valid Parentheses validator for "(", ")", "{", "}", "[", "]" using a stack?',
    concepts: 'LIFO structure, matching open/close pairs, edge cases with empty stack.',
    answer: 'Iterate characters. When encountering an open bracket, push the corresponding closing bracket onto the stack. When encountering a closing bracket, pop the top element; if the stack is empty or the popped element does not match, return false. After traversing, return stack.length === 0.'
  },

  // 5. Queue
  {
    id: 'dsa-que-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Queue',
    difficulty: 'Advanced',
    topic: 'Monotonic Deque',
    question: 'How does a Monotonic Deque achieve O(n) time complexity for the Sliding Window Maximum problem?',
    concepts: 'Double-ended queue (Deque), monotonic decreasing values, index bounds checking, amortized O(n).',
    answer: 'Maintain a deque of array indices where values are strictly decreasing. For each element at index i: 1. Remove indices from the front that fell out of window (idx <= i - k). 2. Remove indices from the back whose values are <= nums[i] (they can never be the maximum). 3. Push i to the back. 4. Once i >= k - 1, deque.front() is the maximum for the window.'
  },
  {
    id: 'dsa-que-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Queue',
    difficulty: 'Intermediate',
    topic: 'Circular Queue',
    question: 'Why is a Circular Queue preferred over a standard array queue for fixed-size buffer implementations?',
    concepts: 'Ring buffer, modulo arithmetic ((rear + 1) % capacity), preventing memory drift.',
    answer: 'In a naive array queue, dequeueing leaves unused slots at the front unless all elements are shifted left (costing O(n)). A Circular Queue connects the last position back to the first using modulo arithmetic ((rear + 1) % size), enabling O(1) enqueue and dequeue without shifting elements or memory leaks.'
  },

  // 6. Trees
  {
    id: 'dsa-tre-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Trees',
    difficulty: 'Intermediate',
    topic: 'Lowest Common Ancestor',
    question: 'How do you find the Lowest Common Ancestor (LCA) in a Binary Tree vs in a Binary Search Tree (BST)?',
    concepts: 'Binary Tree postorder recursion vs BST directional pruning using node values.',
    answer: 'In a BST: Leverage ordering property. If both nodes are smaller than root.val, LCA is in root.left; if both are greater, LCA is in root.right; otherwise root is the split point (LCA) in O(h) time. In a general Binary Tree: Use postorder DFS. If root is null or equals p or q, return root. Recurse left and right. If both return non-null, root is LCA; otherwise return the non-null child.'
  },
  {
    id: 'dsa-tre-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Trees',
    difficulty: 'Intermediate',
    topic: 'BST Validation',
    question: 'Why is checking root.left.val < root.val and root.right.val > root.val insufficient to validate a BST?',
    concepts: 'Subtree bound validation, range propagation (-Infinity, +Infinity), DFS traversal.',
    answer: 'A valid BST requires EVERY node in the left subtree to be strictly less than the root, not just the direct child. For example: [10, 5, 15, null, null, 6, 20] has 6 in the right subtree of 10, which violates BST rules even though 6 < 15. The correct approach propagates valid ranges (minVal, maxVal) down the recursive tree.'
  },

  // 7. Graphs
  {
    id: 'dsa-grp-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Graphs',
    difficulty: 'Advanced',
    topic: 'Topological Sort',
    question: 'Explain Kahn’s algorithm for Topological Sort and how it detects cycles in directed graphs (e.g., build dependencies).',
    concepts: 'In-degree array, BFS queue, DAG validation, O(V + E) time.',
    answer: '1. Calculate the in-degree (number of incoming edges) for all vertices. 2. Enqueue all vertices with in-degree 0. 3. While queue is not empty, dequeue vertex u, append it to the topological order, and decrement in-degree for all its neighbors. If any neighbor reaches in-degree 0, enqueue it. 4. If processed count < total vertices V, a cycle exists (deadlock).'
  },
  {
    id: 'dsa-grp-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Graphs',
    difficulty: 'Advanced',
    topic: 'Shortest Path (Dijkstra)',
    question: 'How does Dijkstra’s algorithm find the single-source shortest path, and why does it fail with negative edge weights?',
    concepts: 'Greedy choice, Priority Queue / Min-Heap, edge relaxation, non-negative weight invariant.',
    answer: 'Dijkstra initializes distances to Infinity (source = 0) and repeatedly extracts the unvisited vertex with the minimum distance using a Min-Heap, relaxing outgoing edges. It fails with negative weights because once a vertex is marked visited, Dijkstra assumes its shortest path is finalized and will not reconsider it even if a negative edge later reduces its cost.'
  },

  // 8. Recursion
  {
    id: 'dsa-rec-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Recursion',
    difficulty: 'Advanced',
    topic: 'Backtracking',
    question: 'Explain the Backtracking paradigm using the N-Queens problem. How does state pruning minimize search space?',
    concepts: 'State space tree, DFS recursion, state rollback (backtrack), bitmask/set collision checking.',
    answer: 'Backtracking builds solution candidates incrementally and abandons (prunes) a candidate as soon as it determines it cannot yield a valid solution. For N-Queens, place a queen row by row. Use sets (or bitmasks) to record occupied columns, positive diagonals (r + c), and negative diagonals (r - c). If a placement conflicts, skip it immediately. If valid, recurse to row + 1, then remove queen from state to explore other paths.'
  },

  // 9. Sorting
  {
    id: 'dsa-srt-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Sorting',
    difficulty: 'Intermediate',
    topic: 'QuickSort vs MergeSort',
    question: 'Compare QuickSort and MergeSort in terms of time complexity, space complexity, stability, and cache locality.',
    concepts: 'Divide and conquer, in-place partitioning, stability, worst-case O(n^2) vs guaranteed O(n log n).',
    answer: 'MergeSort guarantees O(n log n) in all cases, is stable, but requires O(n) auxiliary memory. QuickSort has average O(n log n) and O(log n) auxiliary stack space, but worst-case O(n^2) if pivot selection is poor. QuickSort is typically faster in practice due to in-place swaps, fewer memory allocations, and superior CPU cache locality.'
  },

  // 10. Searching
  {
    id: 'dsa-src-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Searching',
    difficulty: 'Intermediate',
    topic: 'Binary Search',
    question: 'How do you search for a target value in a Rotated Sorted Array in O(log n) time without un-rotating it?',
    concepts: 'Modified binary search, identifying sorted half, boundary condition checks.',
    answer: 'Compute mid = Math.floor((left + right) / 2). One half (left..mid or mid..right) is guaranteed to be sorted. Check if left half is sorted (nums[left] <= nums[mid]): if target lies within [nums[left], nums[mid]], search left (right = mid - 1); otherwise search right. If right half is sorted: if target lies within [nums[mid], nums[right]], search right; otherwise search left.'
  },

  // 11. Hashing
  {
    id: 'dsa-hsh-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Hashing',
    difficulty: 'Intermediate',
    topic: 'Hash Table Collisions',
    question: 'How do Separate Chaining and Open Addressing (Linear Probing) handle hash collisions, and what is the load factor?',
    concepts: 'Collision resolution, linked buckets vs probe sequences, clustering, load factor alpha = n / k.',
    answer: 'Separate chaining stores colliding entries in linked lists or balanced trees at the same bucket; search remains O(1) average but degrades if buckets become large. Open addressing stores all elements directly in the table: on collision, it probes alternate slots (linear, quadratic, or double hashing). The load factor (n / table_size) indicates when resizing/rehashing is required (typically at 0.75).'
  },

  // 12. Dynamic Programming
  {
    id: 'dsa-dp-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Dynamic Programming',
    difficulty: 'Advanced',
    topic: '0/1 Knapsack & Optimization',
    question: 'Explain the 0/1 Knapsack problem. How does the 2D DP table transition to an optimized 1D space array?',
    concepts: 'Optimal substructure, overlapping subproblems, space optimization from O(n * W) to O(W).',
    answer: 'In 2D DP: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]). Since state dp[i][w] only depends on the previous row dp[i-1], we can compress to a single 1D array dp[w]. Crucially, we must iterate capacity w backwards from W down to wt[i] so we use values from the previous iteration without overwriting them prematurely.'
  },
  {
    id: 'dsa-dp-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Dynamic Programming',
    difficulty: 'Intermediate',
    topic: 'Longest Common Subsequence',
    question: 'How do you find the Longest Common Subsequence (LCS) of two strings using Dynamic Programming?',
    concepts: 'Grid DP, character match transition dp[i][j] = 1 + dp[i-1][j-1], mismatch max(dp[i-1][j], dp[i][j-1]).',
    answer: 'Let dp[i][j] represent the LCS of text1[0..i-1] and text2[0..j-1]. If text1[i-1] === text2[j-1], dp[i][j] = 1 + dp[i-1][j-1]. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Time complexity is O(m * n) and space is O(m * n) (reducible to O(min(m, n))).'
  },

  // 13. Time & Space Complexity
  {
    id: 'dsa-cmp-1',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Time & Space Complexity',
    difficulty: 'Intermediate',
    topic: 'Master Theorem & Amortized Cost',
    question: 'What is Amortized Time Complexity? Explain why dynamic array append (push) is O(1) amortized despite O(n) reallocations.',
    concepts: 'Amortized analysis, accounting method, capacity doubling, aggregate cost proof.',
    answer: 'Amortized complexity averages the total time of a sequence of operations over all operations. When a dynamic array fills up, it allocates double capacity and copies n elements (costing O(n)). However, this resizing only occurs after n appends. The sum of doubling costs 1 + 2 + 4 + ... + n is less than 2n. Distributing 2n across n insertions yields an average of O(1) time per append.'
  },
  {
    id: 'dsa-cmp-2',
    mainCategory: 'Technical (DSA)',
    subCategory: 'Time & Space Complexity',
    difficulty: 'Advanced',
    topic: 'Auxiliary Space vs Input Space',
    question: 'What is the exact distinction between Space Complexity and Auxiliary Space? Give an example.',
    concepts: 'Input memory vs extra algorithm memory, in-place algorithms.',
    answer: 'Total Space Complexity includes all memory utilized by the algorithm, including input data, auxiliary structures, and call stack. Auxiliary Space measures ONLY the extra or temporary memory allocated by the algorithm to solve the problem. For example, reversing an array of size n in-place has total space O(n) but auxiliary space O(1).'
  }
];

const APTITUDE_SUBCATS = ['Numerical Ability', 'Verbal Ability', 'Reasoning Ability'];

const TECHNICAL_SUBCATS = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stack',
  'Queue',
  'Trees',
  'Graphs',
  'Recursion',
  'Sorting',
  'Searching',
  'Hashing',
  'Dynamic Programming',
  'Time & Space Complexity'
];

export const QuestionBank = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Primary Category: 'Aptitude' or 'Technical (DSA)'
  const [activeMainCategory, setActiveMainCategory] = useState(
    searchParams.get('category') === 'Aptitude' ? 'Aptitude' : 'Technical (DSA)'
  );

  // Subcategory filter ('All' or specific subcategory)
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  // Search & other filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'practiced', 'bookmarked'
  const [expandedId, setExpandedId] = useState(null);

  // Practice & bookmark states
  const [practicedMap, setPracticedMap] = useState({});
  const [bookmarkedMap, setBookmarkedMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadBankData = async () => {
      try {
        const res = await getQuestionBankData();
        if (isMounted && res) {
          setPracticedMap(res.practicedMap || {});
          setBookmarkedMap(res.bookmarkedMap || {});
        }
      } catch (e) {
        console.error('Failed to load question bank data:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBankData();
    return () => {
      isMounted = false;
    };
  }, []);

  // When switching main categories, reset subcategory to 'All'
  const handleMainCategoryChange = (cat) => {
    setActiveMainCategory(cat);
    setSelectedSubCategory('All');
  };

  const handleTogglePracticed = async (questionId, e) => {
    e.stopPropagation();
    const current = !!practicedMap[questionId];
    setPracticedMap((prev) => ({ ...prev, [questionId]: !current }));
    try {
      await toggleQuestionPracticed({ questionId, isPracticed: !current });
    } catch (err) {
      console.error('Failed to toggle practiced:', err);
      setPracticedMap((prev) => ({ ...prev, [questionId]: current }));
    }
  };

  const handleToggleBookmarked = async (questionId, e) => {
    e.stopPropagation();
    const current = !!bookmarkedMap[questionId];
    setBookmarkedMap((prev) => ({ ...prev, [questionId]: !current }));
    try {
      await toggleQuestionBookmarked({ questionId, isBookmarked: !current });
    } catch (err) {
      console.error('Failed to toggle bookmarked:', err);
      setBookmarkedMap((prev) => ({ ...prev, [questionId]: current }));
    }
  };

  // Filter questions based on state
  const filteredQuestions = QUESTIONS_DATA.filter((item) => {
    // 1. Main Category filter
    if (item.mainCategory !== activeMainCategory) return false;

    // 2. Subcategory filter
    if (selectedSubCategory !== 'All' && item.subCategory !== selectedSubCategory) {
      return false;
    }

    // 3. Difficulty filter
    if (selectedDifficulty !== 'All' && item.difficulty !== selectedDifficulty) {
      return false;
    }

    // 4. Status filter
    if (statusFilter === 'practiced' && !practicedMap[item.id]) return false;
    if (statusFilter === 'bookmarked' && !bookmarkedMap[item.id]) return false;

    // 5. Keyword search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQ = item.question.toLowerCase().includes(q);
      const matchConcept = item.concepts.toLowerCase().includes(q);
      const matchAns = item.answer.toLowerCase().includes(q);
      const matchTopic = item.topic.toLowerCase().includes(q);
      const matchSub = item.subCategory.toLowerCase().includes(q);
      if (!matchQ && !matchConcept && !matchAns && !matchTopic && !matchSub) return false;
    }

    return true;
  });

  const aptitudeCount = QUESTIONS_DATA.filter((q) => q.mainCategory === 'Aptitude').length;
  const technicalCount = QUESTIONS_DATA.filter((q) => q.mainCategory === 'Technical (DSA)').length;

  const currentSubcategories = activeMainCategory === 'Aptitude' ? APTITUDE_SUBCATS : TECHNICAL_SUBCATS;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── 1. Page Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Curated <span className="gradient-text">Question Bank</span>
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Master essential Aptitude reasoning and core Technical DSA concepts with comprehensive solution frameworks.
        </p>
      </div>

      {/* ── 2. Top-Level Main Category Selector Tabs ── */}
      <div
        className="glass-card"
        style={{
          padding: '0.6rem',
          borderRadius: 'var(--radius-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.75rem',
          background: 'var(--bg-surface-elevated)'
        }}
      >
        {/* TAB 1: APTITUDE */}
        <button
          type="button"
          onClick={() => handleMainCategoryChange('Aptitude')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: activeMainCategory === 'Aptitude' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
            background: activeMainCategory === 'Aptitude' ? 'var(--primary)' : 'var(--bg-surface)',
            color: activeMainCategory === 'Aptitude' ? '#ffffff' : 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            fontWeight: 700,
            fontSize: '1rem'
          }}
        >
          <Brain size={22} color={activeMainCategory === 'Aptitude' ? '#fff' : 'var(--primary)'} />
          <span>Aptitude Preparation</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: activeMainCategory === 'Aptitude' ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.15)',
              color: activeMainCategory === 'Aptitude' ? '#ffffff' : 'var(--primary)'
            }}
          >
            {aptitudeCount} Qs
          </span>
        </button>

        {/* TAB 2: TECHNICAL (PURELY DSA) */}
        <button
          type="button"
          onClick={() => handleMainCategoryChange('Technical (DSA)')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: activeMainCategory === 'Technical (DSA)' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
            background: activeMainCategory === 'Technical (DSA)' ? 'var(--primary)' : 'var(--bg-surface)',
            color: activeMainCategory === 'Technical (DSA)' ? '#ffffff' : 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            fontWeight: 700,
            fontSize: '1rem'
          }}
        >
          <Code2 size={22} color={activeMainCategory === 'Technical (DSA)' ? '#fff' : 'var(--accent-cyan)'} />
          <span>Technical (DSA)</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: activeMainCategory === 'Technical (DSA)' ? 'rgba(255,255,255,0.25)' : 'rgba(6,182,212,0.15)',
              color: activeMainCategory === 'Technical (DSA)' ? '#ffffff' : 'var(--accent-cyan)'
            }}
          >
            {technicalCount} Qs
          </span>
        </button>
      </div>

      {/* ── 3. Subcategories Filter Ribbon ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          {activeMainCategory === 'Aptitude' ? 'Aptitude Modules' : 'Data Structures & Algorithms Topics'}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setSelectedSubCategory('All')}
            className={`btn btn-sm ${selectedSubCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            All {activeMainCategory === 'Aptitude' ? 'Aptitude' : 'DSA'} ({activeMainCategory === 'Aptitude' ? aptitudeCount : technicalCount})
          </button>

          {currentSubcategories.map((sub) => {
            const count = QUESTIONS_DATA.filter(
              (q) => q.mainCategory === activeMainCategory && q.subCategory === sub
            ).length;
            const isSelected = selectedSubCategory === sub;

            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubCategory(sub)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
              >
                <span>{sub}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    opacity: 0.85,
                    marginLeft: '0.3rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface-elevated)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Search and Secondary Filters ── */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeMainCategory} questions, algorithms, concepts...`}
            className="input-field"
            style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field"
            style={{ width: '135px', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ width: '140px', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <option value="all">All Questions</option>
            <option value="practiced">Practiced Only</option>
            <option value="bookmarked">Bookmarked Only</option>
          </select>
        </div>
      </div>

      {/* ── 5. Questions List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredQuestions.length}</strong> questions in{' '}
            <strong>{selectedSubCategory === 'All' ? activeMainCategory : selectedSubCategory}</strong>
          </span>

          <button
            onClick={() => navigate('/app/mock-interview')}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', gap: '0.4rem' }}
          >
            <Bot size={15} />
            <span>Practice in Live Mock Interview</span>
          </button>
        </div>

        {filteredQuestions.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '3rem 2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center'
            }}
          >
            <HelpCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Questions Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              No questions matched your current filter criteria. Try adjusting your search query, difficulty, or subcategory.
            </p>
            <button
              onClick={() => {
                setSelectedSubCategory('All');
                setSelectedDifficulty('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isPracticed = !!practicedMap[q.id];
            const isBookmarked = !!bookmarkedMap[q.id];

            const diffBadgeClass =
              q.difficulty === 'Beginner'
                ? 'badge-success'
                : q.difficulty === 'Intermediate'
                ? 'badge-primary'
                : 'badge-warning';

            return (
              <div
                key={q.id}
                className="glass-card"
                style={{
                  padding: '1.5rem 1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-fast)',
                  borderLeft: `4px solid ${
                    q.mainCategory === 'Aptitude' ? 'var(--primary)' : 'var(--accent-cyan)'
                  }`
                }}
              >
                {/* Header row: Category / Subcategory + Difficulty + Action buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      className="badge"
                      style={{
                        background: q.mainCategory === 'Aptitude' ? 'rgba(99,102,241,0.15)' : 'rgba(6,182,212,0.15)',
                        color: q.mainCategory === 'Aptitude' ? 'var(--primary)' : 'var(--accent-cyan)',
                        fontWeight: 700
                      }}
                    >
                      {q.subCategory}
                    </span>
                    <span className="badge badge-primary">{q.topic}</span>
                    <span className={`badge ${diffBadgeClass}`}>{q.difficulty}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Practiced Toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleTogglePracticed(q.id, e)}
                      title={isPracticed ? 'Marked as Practiced' : 'Mark as Practiced'}
                      className={`btn btn-sm ${isPracticed ? 'btn-success' : 'btn-secondary'}`}
                      style={{ borderRadius: 'var(--radius-full)', padding: '0.3rem 0.65rem', fontSize: '0.78rem', gap: '0.35rem' }}
                    >
                      {isPracticed ? <CheckCircle size={14} /> : <Circle size={14} />}
                      <span>{isPracticed ? 'Practiced' : 'Mark Practiced'}</span>
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmarked(q.id, e)}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                      className={`btn btn-sm ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.55rem' }}
                    >
                      {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h4 style={{ fontSize: '1.08rem', fontWeight: 700, lineHeight: 1.45, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                  {q.question}
                </h4>

                {/* Concepts Preview */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Key Concepts:</strong> {q.concepts}
                </div>

                {/* Expand / Collapse Solution Approach */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <span>{isExpanded ? 'Hide Solution Strategy' : 'View Recommended Solution & Complexity'}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Expanded Answer / Solution Box */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Optimal Solution & Architectural Strategy
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                      {q.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
