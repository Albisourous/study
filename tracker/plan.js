// 14-day LeetCode plan for SDE-2 level interviews (~5 problems/day).
// Ordered by pattern so each day builds on the previous one.
// Covers the "design" pattern via Min Stack (D5), Time-Based KV Store (D6),
// LRU Cache (D7) and Trie (D11) — per the vault's week-2 goals.
// diff: "E"asy | "M"edium | "H"ard
const PLAN = [
  {
    day: 1,
    topic: "Arrays & Hashing I",
    problems: [
      { slug: "contains-duplicate", title: "Contains Duplicate", diff: "E" },
      { slug: "valid-anagram", title: "Valid Anagram", diff: "E" },
      { slug: "two-sum", title: "Two Sum", diff: "E" },
      { slug: "group-anagrams", title: "Group Anagrams", diff: "M" },
      { slug: "top-k-frequent-elements", title: "Top K Frequent Elements", diff: "M" },
    ],
  },
  {
    day: 2,
    topic: "Arrays & Hashing II + Bit Manipulation",
    problems: [
      { slug: "product-of-array-except-self", title: "Product of Array Except Self", diff: "M" },
      { slug: "valid-sudoku", title: "Valid Sudoku", diff: "M" },
      { slug: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", diff: "M" },
      { slug: "single-number", title: "Single Number", diff: "E" },
      { slug: "number-of-1-bits", title: "Number of 1 Bits", diff: "E" },
    ],
  },
  {
    day: 3,
    topic: "Two Pointers",
    problems: [
      { slug: "valid-palindrome", title: "Valid Palindrome", diff: "E" },
      { slug: "two-sum-ii-input-array-is-sorted", title: "Two Sum II", diff: "M" },
      { slug: "3sum", title: "3Sum", diff: "M" },
      { slug: "container-with-most-water", title: "Container With Most Water", diff: "M" },
      { slug: "trapping-rain-water", title: "Trapping Rain Water", diff: "H" },
    ],
  },
  {
    day: 4,
    topic: "Sliding Window",
    problems: [
      { slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", diff: "E" },
      { slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", diff: "M" },
      { slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", diff: "M" },
      { slug: "permutation-in-string", title: "Permutation in String", diff: "M" },
      { slug: "minimum-window-substring", title: "Minimum Window Substring", diff: "H" },
    ],
  },
  {
    day: 5,
    topic: "Stack",
    problems: [
      { slug: "valid-parentheses", title: "Valid Parentheses", diff: "E" },
      { slug: "min-stack", title: "Min Stack", diff: "M" },
      { slug: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", diff: "M" },
      { slug: "daily-temperatures", title: "Daily Temperatures", diff: "M" },
      { slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", diff: "H" },
    ],
  },
  {
    day: 6,
    topic: "Binary Search + Design",
    problems: [
      { slug: "binary-search", title: "Binary Search", diff: "E" },
      { slug: "koko-eating-bananas", title: "Koko Eating Bananas", diff: "M" },
      { slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", diff: "M" },
      { slug: "time-based-key-value-store", title: "Time Based Key-Value Store", diff: "M" },
      { slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", diff: "H" },
    ],
  },
  {
    day: 7,
    topic: "Linked List",
    problems: [
      { slug: "reverse-linked-list", title: "Reverse Linked List", diff: "E" },
      { slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", diff: "E" },
      { slug: "reorder-list", title: "Reorder List", diff: "M" },
      { slug: "remove-nth-node-from-end-of-list", title: "Remove Nth Node From End", diff: "M" },
      { slug: "lru-cache", title: "LRU Cache", diff: "M" },
    ],
  },
  {
    day: 8,
    topic: "Trees I",
    problems: [
      { slug: "invert-binary-tree", title: "Invert Binary Tree", diff: "E" },
      { slug: "diameter-of-binary-tree", title: "Diameter of Binary Tree", diff: "E" },
      { slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", diff: "M" },
      { slug: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", diff: "M" },
      { slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", diff: "M" },
    ],
  },
  {
    day: 9,
    topic: "Trees II",
    problems: [
      { slug: "lowest-common-ancestor-of-a-binary-tree", title: "Lowest Common Ancestor", diff: "M" },
      { slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", diff: "M" },
      { slug: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Tree from Preorder + Inorder", diff: "M" },
      { slug: "serialize-and-deserialize-binary-tree", title: "Serialize and Deserialize Binary Tree", diff: "H" },
      { slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", diff: "H" },
    ],
  },
  {
    day: 10,
    topic: "Heap + Intervals",
    problems: [
      { slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", diff: "M" },
      { slug: "task-scheduler", title: "Task Scheduler", diff: "M" },
      { slug: "find-median-from-data-stream", title: "Find Median from Data Stream", diff: "H" },
      { slug: "merge-intervals", title: "Merge Intervals", diff: "M" },
      { slug: "non-overlapping-intervals", title: "Non-overlapping Intervals", diff: "M" },
    ],
  },
  {
    day: 11,
    topic: "Tries + Backtracking",
    problems: [
      { slug: "implement-trie-prefix-tree", title: "Implement Trie", diff: "M" },
      { slug: "subsets", title: "Subsets", diff: "M" },
      { slug: "combination-sum", title: "Combination Sum", diff: "M" },
      { slug: "permutations", title: "Permutations", diff: "M" },
      { slug: "word-search", title: "Word Search", diff: "M" },
    ],
  },
  {
    day: 12,
    topic: "Graphs I — Traversal",
    problems: [
      { slug: "number-of-islands", title: "Number of Islands", diff: "M" },
      { slug: "clone-graph", title: "Clone Graph", diff: "M" },
      { slug: "surrounded-regions", title: "Surrounded Regions", diff: "M" },
      { slug: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", diff: "M" },
      { slug: "rotting-oranges", title: "Rotting Oranges", diff: "M" },
    ],
  },
  {
    day: 13,
    topic: "Graphs II + Greedy",
    problems: [
      { slug: "course-schedule", title: "Course Schedule", diff: "M" },
      { slug: "course-schedule-ii", title: "Course Schedule II", diff: "M" },
      { slug: "word-ladder", title: "Word Ladder", diff: "H" },
      { slug: "jump-game", title: "Jump Game", diff: "M" },
      { slug: "gas-station", title: "Gas Station", diff: "M" },
    ],
  },
  {
    day: 14,
    topic: "Dynamic Programming",
    problems: [
      { slug: "climbing-stairs", title: "Climbing Stairs", diff: "E" },
      { slug: "house-robber", title: "House Robber", diff: "M" },
      { slug: "coin-change", title: "Coin Change", diff: "M" },
      { slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", diff: "M" },
      { slug: "longest-common-subsequence", title: "Longest Common Subsequence", diff: "M" },
    ],
  },
];
