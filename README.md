# Anthropic SDE Interview Prep — 3 Week Plan

**Background:** Amazon SDE2 (L5), 4 YOE, frontend/React + internal tooling. Strong engineering fundamentals, rusty on LC-style interviewing.
**Timeline:** No interview scheduled yet — plan is: 3 weeks of prep, *then* apply, so you're ready the moment a loop gets scheduled instead of scrambling.
**Goal:** Not "grind 300 problems" — get pattern-fluent, fast, and calm under a timer, plus tight behavioral + system design stories.

**Target role(s):** Best current fit given L5/full-stack-frontend background is [Senior Software Engineer, Full-stack](https://job-boards.greenhouse.io/anthropic/jobs/5174743008) (SF | NYC | **Seattle**). Anthropic doesn't post an "SDE2" title — levels map roughly to Senior for someone at your YOE/scope. Worth also watching **Engineering & Design - Product** postings for anything Seattle-based that opens up closer to when you're ready to apply.

---

## How this vault works (open this folder as an Obsidian vault)

| Folder | Purpose |
|---|---|
| `LeetCode/` | One note per problem. Copy `_templates/leetcode-problem.md`, fill it in, done. |
| `Dashboard.md` | Auto-updating view of everything in `LeetCode/` — coverage by pattern, by difficulty, and a "revisit" list of low-confidence problems. Requires the free **Dataview** plugin. |
| `_templates/leetcode-problem.md` | The note template. Set it as your default template (Settings → Templates → Template folder → `_templates`), or install **Templater** for a hotkey to insert it. |
| `system-design/` | One doc per design you practice (template included). |
| `behavioral/star-stories.md` | Your STAR bank, mapped to what Anthropic actually evaluates for. |
| `mock-interviews/log.md` | Log every mock (self, friend, Pramp, etc.) with feedback. |
| `resources/README.md` | Curated links so you're not doom-scrolling for "best LC list." |

### Logging a problem (the only habit that matters)
1. New note in `LeetCode/`, named after the problem (e.g. `Two Sum.md`).
2. Paste in the template, fill the frontmatter (`difficulty`, `pattern`, `status`, `time_min`, `confidence`).
3. That's it — close the note. `Dashboard.md` does the counting for you.

Two example notes (`Two Sum.md`, `Climbing Stairs.md`) are already in `LeetCode/` so you can see the format and check the Dashboard works — delete them once you've logged a couple of your own.

**Optional daily habit:** commit at the end of each session (`git add -A && git commit -m "Day N: 3 problems, graphs"`) so your commit history becomes a second progress log — but the vault works fine with just Obsidian, no git required if you'd rather skip that.

---

## Week 1 — Rebuild fundamentals (pattern fluency over volume)

Goal: re-activate the 12 core patterns. Untimed at first, then add a 25-min soft timer by end of week.

- **Days 1–2: Arrays/Strings + Hashmaps + Two Pointers/Sliding Window**
  - 2–3 problems/pattern. Easy → Medium. Write the brute force first, then optimize — that's literally what the interviewer wants to see you do.
- **Days 3–4: Linked Lists + Stacks/Queues + Binary Search**
  - Binary search: drill the template (lo/hi/mid, boundary conditions) until it's muscle memory — this is the #1 silent killer of interviews.
- **Days 5–6: Trees/BST + Graphs (BFS/DFS)**
  - Recursion + iterative traversal both. Graph: know adjacency list construction cold, BFS for shortest path, DFS for connectivity/cycles.
- **Day 7: Rest + review.** Re-read your own solutions from the week. Redo 2 you struggled with, cold, no notes.

Behavioral (background task, 20 min/day): draft 6–8 STAR stories from Amazon work (see `behavioral/star-stories.md`).

**Target by end of week 1:** ~18–22 problems logged, all 6 pattern groups touched at least once.

---

## Week 2 — Depth + timed reps + system design starts

- **Days 8–9: Heaps/Priority Queues + Intervals**
- **Days 10–11: Backtracking + DP (start with 1D: climbing stairs, house robber, coin change; then 2D: grids, LCS-style)**
  - DP is the highest-leverage weak spot for most senior candidates. Don't skip it because it's uncomfortable — that's exactly why it's here.
- **Days 12–13: Design problems** (LRU Cache, rate limiter, in-memory KV store — these hit both coding *and* system-design thinking, high value for SDE2-level bar)
- **Day 14: First full mock interview** (45 min, 1 medium problem, think-aloud, then self-review — log it in `mock-interviews/log.md`)

Start system design (2 sessions this week, ~1.5 hr each): pick 2 from `system-design/README.md`, write up full doc using the template. At your level Anthropic will expect you to drive the ambiguity, not wait for it to be resolved for you.

**Target by end of week 2:** ~35–40 problems total, first mock done, 2 system design docs drafted, all timed at 30–35 min.

---

## Week 3 — Simulate the real thing, then taper

- **Days 15–17: Timed mixed sets.** 2 random-topic mediums/day, 30 min each, no notes. Treat every session like the real interview — narrate your thinking out loud (record yourself if you can stand it).
- **Day 18: Second mock interview**, ideally with another person (friend, Pramp, or paid mock). Focus feedback on: clarifying questions, communication while coding, handling hints.
- **Day 19: System design mock** — one full session, someone else prompting you.
- **Day 20: Weak-spot triage.** Pull `scripts/stats.py` output, redo your 3 lowest-confidence problems cold.
- **Days 21–22 (or last 2 days before interview): Taper.** Light review only — reread your STAR stories, skim your own solution notes, 1 easy problem/day just to stay warm. No new topics. Sleep > cramming.

Company-specific prep (30–45 min total, do this once mid-week 3):
- Read Anthropic's core views / RSP overview, and skim 2–3 recent blog posts so you can speak to *why Anthropic* specifically (not generic "I like AI").
- Prepare 3–4 sharp questions for your interviewers that show you've thought about the mission, not just the job.

---

## What "done" looks like going in
- [ ] 45–60 problems logged across all 12 patterns, no pattern untouched
- [ ] Comfortable narrating approach → brute force → optimization → complexity, out loud, in under 5 min before coding
- [ ] 3 system design docs, 1 done live with another person
- [ ] 2+ mock interviews completed and logged with feedback
- [ ] 6–8 STAR stories, each mappable to 2+ likely question types
- [ ] Can explain in 60 seconds, cold, why Anthropic specifically

---

## Quick start
1. Clone or download this repo/folder.
2. In Obsidian: **Open folder as vault** → select `anthropic-interview-prep`.
3. Install the **Dataview** community plugin (Settings → Community plugins → Browse).
4. Open `Dashboard.md` — you should see the two example problems already tallied.
5. Log your own problems in `LeetCode/` using the template. Delete the examples once you're rolling.
