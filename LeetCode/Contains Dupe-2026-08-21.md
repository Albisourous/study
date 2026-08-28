---
date: 2026-08-21
problem: Contains Dupe
link: https://leetcode.com/problems/contains-duplicate/description/
difficulty:
pattern:
status: attempted
time_min:
confidence:
tags: leetcode
---

## Approach


## Solution

```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        return len(set(nums)) != len(nums)
```

## Notes
(what you'd do differently, what you missed, what pattern this really is)
