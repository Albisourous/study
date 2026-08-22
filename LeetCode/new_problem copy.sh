#!/bin/bash
# Usage: ./new_problem.sh "two-sum"
# Creates a new dated leetcode notes file from the template.

if [ -z "$1" ]; then
  echo "Usage: ./new_problem.sh <problem-slug>"
  echo "Example: ./new_problem.sh two-sum"
  exit 1
fi

SLUG="$1"
DATE=$(date +%Y-%m-%d)
DIR="./leetcode"
FILE="$DIR/${DATE}-${SLUG}.md"

mkdir -p "$DIR"

if [ -f "$FILE" ]; then
  echo "File already exists: $FILE"
  exit 1
fi

cat > "$FILE" << EOF
---
date: ${DATE}
problem: ${SLUG}
link:
difficulty:
pattern:
status: attempted
time_min:
confidence:
tags: leetcode
---

## Approach


## Solution

\`\`\`
(paste code here)
\`\`\`

## Notes
(what you'd do differently, what you missed, what pattern this really is)
EOF

echo "Created $FILE"
