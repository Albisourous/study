# System Design Practice

At L5/Senior, expect design rounds to test how you handle ambiguity, trade-offs, and scale — not just "know the components." Drive the conversation; don't wait to be told what to design.

## Reported Anthropic round (prepare this one for sure)
- [ ] **Design an inference API for serving LLMs** — variable-length requests, GPU memory management across concurrent requests, request queuing with priority, streaming responses. They go deep since it's literally what they build:
  - Dynamic batching: grouping requests of similar length to maximize GPU utilization; when to flush vs hold for one more request
  - KV cache management across concurrent generations
  - Autoscaling signals: queue depth weighted by estimated token count (raw GPU util can look fine while latency tanks)
  - Related flavors reported: eval infrastructure for a frontier LLM, prompt-injection detection, multi-turn context management

## Practice list (pick 4-6, mix of these)
- [ ] Design a rate limiter
- [ ] Design an LRU cache (+ distributed variant)
- [ ] Design a URL shortener
- [ ] Design a chat/notification system
- [ ] Design a job queue / task scheduler
- [ ] Design a key-value store
- [ ] Design a code execution sandbox / API gateway (relevant to Anthropic's product surface — Claude Code, API platform)
- [ ] Design a real-time collaborative document (relevant to frontend background)

## Template — copy into a new file per design, e.g. `rate-limiter.md`

```
# [System name]

## 1. Requirements (clarify first, out loud)
- Functional:
- Non-functional (scale, latency, consistency):
- Explicit non-goals:

## 2. Back-of-envelope estimates
- QPS, storage, bandwidth

## 3. High-level design
(diagram description / API shape)

## 4. Deep dive (pick 1-2 components to go deep on)

## 5. Trade-offs & alternatives considered

## 6. Bottlenecks & how you'd address them at 10x scale

## Self-review after
- What did I miss that I should've asked about upfront?
- Where did I over-engineer / under-engineer?
```
