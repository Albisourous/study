// Adaptive LeetCode + Anthropic interview-prep plan (Amazon L5 → Senior SWE).
//
// The plan is a single ordered QUEUE. The app chunks it into days of `pace`
// items starting from the first unfinished one — anything you don't finish
// today rolls into tomorrow. Three item kinds are interleaved so most days
// mix ~6 problems with 1 non-LC rep:
//   - lc    — LeetCode problem (link + checkbox)
//   - task  — prep item: behavioral, mock, system design, review (checkbox + ✎ opens a vault file)
//   - drill — Anthropic-style practical coding rep (checkbox + ✎ creates a dated note in Drills/)
//
// Drills mirror reported Anthropic rounds: staged problems that grow
// requirements (rate limiter, KV store, context manager, pipelines).

const PACE_DEFAULT = 7;

const block = (topic, rows) =>
  rows.map(([slug, title, diff]) => ({ id: slug, type: "lc", slug, title, diff, topic }));

const task = (title, desc, topic, file) => ({
  id: "task:" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  type: "task",
  title,
  desc,
  topic,
  file, // existing vault file the ✎ link opens (obsidian://open)
});

const drill = (title, desc, path) => ({
  id: "drill:" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  type: "task",
  title,
  desc,
  topic: "Coding Drill",
  newFile: path, // ✎ creates Drills/<path>-<date>.md (obsidian://new)
});

const QUEUE = [
  // ── Phase 1: fundamentals (vault week 1) ──
  ...block("Arrays & Hashing", [
    ["contains-duplicate", "Contains Duplicate", "E"],
    ["valid-anagram", "Valid Anagram", "E"],
    ["two-sum", "Two Sum", "E"],
    ["group-anagrams", "Group Anagrams", "M"],
    ["top-k-frequent-elements", "Top K Frequent Elements", "M"],
    ["product-of-array-except-self", "Product of Array Except Self", "M"],
    ["valid-sudoku", "Valid Sudoku", "M"],
    ["longest-consecutive-sequence", "Longest Consecutive Sequence", "M"],
    ["single-number", "Single Number", "E"],
    ["number-of-1-bits", "Number of 1 Bits", "E"],
  ]),
  task(
    "Draft your 'why Anthropic' answer",
    "60 seconds, out loud, in your own words. The recruiter screen filters on mission fluency — nail the tension: why do safety-focused people build more capable AI?",
    "Behavioral",
    "behavioral/star-stories.md"
  ),
  ...block("Two Pointers", [
    ["valid-palindrome", "Valid Palindrome", "E"],
    ["two-sum-ii-input-array-is-sorted", "Two Sum II", "M"],
    ["3sum", "3Sum", "M"],
    ["container-with-most-water", "Container With Most Water", "M"],
    ["trapping-rain-water", "Trapping Rain Water", "H"],
  ]),
  ...block("Sliding Window", [
    ["best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "E"],
    ["longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters", "M"],
    ["longest-repeating-character-replacement", "Longest Repeating Character Replacement", "M"],
    ["permutation-in-string", "Permutation in String", "M"],
    ["minimum-window-substring", "Minimum Window Substring", "H"],
  ]),
  task(
    "Draft 6–8 STAR stories",
    "Mine your Amazon work — see behavioral/star-stories.md. Background task, ~20 min/day until done.",
    "Behavioral",
    "behavioral/star-stories.md"
  ),
  ...block("Stack", [
    ["valid-parentheses", "Valid Parentheses", "E"],
    ["min-stack", "Min Stack", "M"],
    ["evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", "M"],
    ["daily-temperatures", "Daily Temperatures", "M"],
    ["largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "H"],
  ]),
  drill(
    "Rate limiter drill",
    "Reported Anthropic favorite. Implement fixed-window → sliding-window → token bucket in Python, then talk through multi-user and distributed extensions. Narrate trade-offs out loud while coding.",
    "Drills/Rate Limiter"
  ),
  ...block("Binary Search + Design", [
    ["binary-search", "Binary Search", "E"],
    ["koko-eating-bananas", "Koko Eating Bananas", "M"],
    ["search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "M"],
    ["time-based-key-value-store", "Time Based Key-Value Store", "M"],
    ["median-of-two-sorted-arrays", "Median of Two Sorted Arrays", "H"],
  ]),
  drill(
    "Concurrency pipeline drill",
    "Apply a list of JSON-described transforms to N files using ThreadPoolExecutor under a 30s / 4GB budget — mirrors the reported bulk-image-pipeline round. Practice reading unfamiliar library docs fast.",
    "Drills/Concurrency Pipeline"
  ),
  ...block("Linked List", [
    ["reverse-linked-list", "Reverse Linked List", "E"],
    ["merge-two-sorted-lists", "Merge Two Sorted Lists", "E"],
    ["reorder-list", "Reorder List", "M"],
    ["remove-nth-node-from-end-of-list", "Remove Nth Node From End", "M"],
    ["lru-cache", "LRU Cache", "M"],
  ]),
  drill(
    "In-memory KV store — 4 levels",
    "The actual CodeSignal OA pattern: 90 min, one problem in 4 escalating levels — SET/GET/DELETE → filtered scan → TTL w/ timestamps → persist to disk. Modular code is the whole game; each level breaks your last shortcut.",
    "Drills/In-Memory KV Store"
  ),

  // ── Phase 2: trees + design problems (vault week 2 start) ──
  ...block("Trees", [
    ["invert-binary-tree", "Invert Binary Tree", "E"],
    ["diameter-of-binary-tree", "Diameter of Binary Tree", "E"],
    ["binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "M"],
    ["kth-smallest-element-in-a-bst", "Kth Smallest Element in a BST", "M"],
    ["validate-binary-search-tree", "Validate Binary Search Tree", "M"],
    ["lowest-common-ancestor-of-a-binary-tree", "Lowest Common Ancestor", "M"],
    ["binary-tree-right-side-view", "Binary Tree Right Side View", "M"],
    ["construct-binary-tree-from-preorder-and-inorder-traversal", "Construct Tree from Preorder + Inorder", "M"],
    ["serialize-and-deserialize-binary-tree", "Serialize and Deserialize Binary Tree", "H"],
    ["binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", "H"],
  ]),
  task(
    "System design doc #1 — LLM request batching",
    "Anthropic-flavored prompt: design batching + scheduling for LLM inference (latency vs throughput, priority tiers). Full writeup using the system-design template.",
    "System Design",
    "system-design/README.md"
  ),
  ...block("Heap + Intervals", [
    ["kth-largest-element-in-an-array", "Kth Largest Element in an Array", "M"],
    ["task-scheduler", "Task Scheduler", "M"],
    ["find-median-from-data-stream", "Find Median from Data Stream", "H"],
    ["merge-k-sorted-lists", "Merge K Sorted Lists", "H"],
    ["merge-intervals", "Merge Intervals", "M"],
    ["insert-interval", "Insert Interval", "M"],
    ["non-overlapping-intervals", "Non-overlapping Intervals", "M"],
  ]),
  drill(
    "Context manager drill",
    "Reported onsite question. Maintain conversation history under a token budget — v1: FIFO pruning → v2: never prune the system prompt → v3: priority labels. Staged requirements, production-style.",
    "Drills/Context Manager"
  ),
  ...block("Tries + Backtracking", [
    ["implement-trie-prefix-tree", "Implement Trie", "M"],
    ["design-add-and-search-words-data-structure", "Design Add and Search Words", "M"],
    ["subsets", "Subsets", "M"],
    ["combination-sum", "Combination Sum", "M"],
    ["permutations", "Permutations", "M"],
    ["word-search", "Word Search", "M"],
  ]),
  drill(
    "AI-collab rep",
    "Anthropic evaluates AI-collaboration judgment and may allow assistants in-round. Solve one medium with an AI assistant, then critique its output for edge cases, robustness, and what you'd change.",
    "Drills/AI Collab Rep"
  ),
  task(
    "Mock interview #1",
    "45 min · 1 medium · think aloud the whole time · log feedback in mock-interviews/log.md",
    "Mock",
    "mock-interviews/log.md"
  ),

  // ── Phase 3: graphs + DP (vault week 2 end) ──
  ...block("Graphs + Greedy", [
    ["number-of-islands", "Number of Islands", "M"],
    ["clone-graph", "Clone Graph", "M"],
    ["surrounded-regions", "Surrounded Regions", "M"],
    ["pacific-atlantic-water-flow", "Pacific Atlantic Water Flow", "M"],
    ["rotting-oranges", "Rotting Oranges", "M"],
    ["course-schedule", "Course Schedule", "M"],
    ["course-schedule-ii", "Course Schedule II", "M"],
    ["word-ladder", "Word Ladder", "H"],
    ["jump-game", "Jump Game", "M"],
    ["gas-station", "Gas Station", "M"],
  ]),
  task(
    "System design doc #2 — web crawler + indexing",
    "Crawl frontier, dedupe, politeness, indexing pipeline — another reported Anthropic flavor. Write it up with the template.",
    "System Design",
    "system-design/README.md"
  ),
  task(
    "Values rep — talk through a downside",
    "Pick a system you've built at Amazon. Discuss its risks/downsides candidly for 5 min out loud. Anthropic's values round punishes rehearsed answers — practice honest reasoning, not polished lines.",
    "Behavioral",
    "behavioral/star-stories.md"
  ),
  ...block("Dynamic Programming", [
    ["climbing-stairs", "Climbing Stairs", "E"],
    ["house-robber", "House Robber", "M"],
    ["house-robber-ii", "House Robber II", "M"],
    ["coin-change", "Coin Change", "M"],
    ["longest-palindromic-substring", "Longest Palindromic Substring", "M"],
    ["longest-increasing-subsequence", "Longest Increasing Subsequence", "M"],
    ["longest-common-subsequence", "Longest Common Subsequence", "M"],
  ]),

  // ── Phase 4: simulate the real thing, then taper (vault week 3) ──
  drill(
    "CodeSignal practice OA",
    "One 4-level staged problem, 90 min, fully timed — the real OA format. Three clean levels beat four broken ones; that's the grading meta.",
    "Drills/Practice OA"
  ),
  task(
    "Timed set — 2 random mediums",
    "30 min each · no notes · narrate aloud. Pick problems you've already done and redo them cold.",
    "Mock",
    "mock-interviews/log.md"
  ),
  task(
    "Timed set — 2 random mediums",
    "30 min each · no notes · narrate aloud.",
    "Mock",
    "mock-interviews/log.md"
  ),
  task(
    "Timed set — 2 random mediums",
    "30 min each · no notes · narrate aloud.",
    "Mock",
    "mock-interviews/log.md"
  ),
  task(
    "Mock interview #2",
    "With another person if possible — friend, Pramp, or interviewing.io. Log the feedback.",
    "Mock",
    "mock-interviews/log.md"
  ),
  task(
    "System design mock",
    "One full session, someone else prompting you. Bonus: LLM eval infrastructure or prompt-injection detection as the prompt.",
    "System Design",
    "system-design/README.md"
  ),
  task(
    "Weak-spot triage",
    "Pull the Dashboard revisit list (confidence ≤ 2) — redo your 3 lowest-confidence problems cold.",
    "Review",
    "Dashboard.md"
  ),
  task(
    "Why-Anthropic prep",
    "Read core views + RSP + skim 2–3 eng blog posts. Draft 3–4 interviewer questions. See resources/README.md.",
    "Behavioral",
    "resources/README.md"
  ),
  task(
    "Taper — light review",
    "Reread STAR stories, skim your solution notes. At most 1 easy problem to stay warm. Sleep > cramming.",
    "Review",
    "behavioral/star-stories.md"
  ),
];

// Ensure unique ids — repeated task titles (e.g. the timed sets) get a suffix.
{
  const seen = {};
  for (const it of QUEUE) {
    seen[it.id] = (seen[it.id] || 0) + 1;
    if (seen[it.id] > 1) it.id += `-${seen[it.id]}`;
  }
}
