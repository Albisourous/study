# Dashboard

Requires the free **Dataview** community plugin (Settings → Community plugins → Browse → "Dataview" → Enable). Everything below updates automatically as you add notes to `LeetCode/`.

## All problems (newest first)
```dataview
TABLE difficulty, pattern, status, confidence, time_min as "min"
FROM "LeetCode"
SORT date DESC
```

## Count by pattern (coverage check — you want every pattern > 0 before your interview)
```dataview
TABLE length(rows) as "Solved"
FROM "LeetCode"
GROUP BY pattern
SORT length(rows) DESC
```

## Count by difficulty
```dataview
TABLE length(rows) as "Count"
FROM "LeetCode"
GROUP BY difficulty
```

## Revisit list — low confidence (≤2), go redo these cold
```dataview
TABLE difficulty, pattern, confidence, date
FROM "LeetCode"
WHERE confidence <= 2
SORT date ASC
```

## Total solved
```dataview
TABLE WITHOUT ID length(rows) as "Total problems logged"
FROM "LeetCode"
GROUP BY true
```

---
### Patterns to cover (check them off as `pattern` count > 0 above)
- [ ] arrays-strings
- [ ] two-pointers-sliding-window
- [ ] hashmap
- [ ] linked-lists
- [ ] stacks-queues
- [ ] binary-search
- [ ] trees-bst
- [ ] graphs
- [ ] heaps
- [ ] intervals
- [ ] backtracking
- [ ] dp
- [ ] design
