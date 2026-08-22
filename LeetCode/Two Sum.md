---
date: 2026-08-21
problem: Two Sum
link: https://leetcode.com/problems/two-sum/
difficulty: Easy
pattern: hashmap
status: solved
time_min: 8
confidence: 5
tags: leetcode
---

## Approach
Single pass hashmap: for each num, check if (target - num) already seen.

## Solution

```
def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
```

## Notes
Example note — delete this once you've got your own logged. This is just to show the format Dashboard.md expects.
