---
date: 2026-08-21
problem: Valid Anagram
link: https://leetcode.com/problems/valid-anagram/description/
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
    def isAnagram(self, s: str, t: str) -> bool:
        sF = {}
        tF = {}

        for c in s:
            sF[c] = sF.get(c, 0) + 1
        
        for c in t:
            tF[c] =tF.get(c,0) + 1

        return sF == tF
```

## Notes
(what you'd do differently, what you missed, what pattern this really is)
