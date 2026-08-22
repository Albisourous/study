---
date: 2026-08-21
problem: Climbing Stairs
link: https://leetcode.com/problems/climbing-stairs/
difficulty: Easy
pattern: dp
status: solved
time_min: 15
confidence: 2
tags: leetcode
---

## Approach
Fibonacci-shaped DP: ways(n) = ways(n-1) + ways(n-2).

## Solution

```
def climbStairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
```

## Notes
Example note — delete this once you've got your own logged. Confidence set low on purpose so you can see how the "revisit" table in Dashboard.md picks it up.
