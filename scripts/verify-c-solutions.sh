#!/usr/bin/env bash
# Compiles every *-solution.md under a C lessons dir and checks its output
# against every ```text block(s) in the paired lesson .md, using the matching
# ```text input block right before it as stdin (if present).
#
# Usage: verify-c-solutions.sh [--dir server/lessons/c/ro] [slug ...]
#   no slugs = check every lesson that has a -solution.md
#   --dir defaults to server/lessons/c/ro; pass server/lessons/c for EN

set -uo pipefail
LESSON_DIR="server/lessons/c/ro"
if [[ "${1:-}" == "--dir" ]]; then
  LESSON_DIR="$2"
  shift 2
fi
WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

FAIL=0

extract_c_block() {
  # $1 = solution file -> prints the code inside the first ```c ... ``` fence
  awk '/^```c$/{f=1;next} /^```$/{if(f){exit}} f' "$1"
}

check_lesson() {
  local slug="$1"
  local sol="$LESSON_DIR/${slug}-solution.md"
  local lesson="$LESSON_DIR/${slug}.md"
  if [[ ! -f "$sol" ]]; then
    return
  fi
  if [[ ! -f "$lesson" ]]; then
    echo "SKIP $slug: no lesson.md"
    return
  fi

  local src="$WORKDIR/${slug}.c"
  local bin="$WORKDIR/${slug}.bin"
  extract_c_block "$sol" > "$src"

  local mission="$WORKDIR/${slug}.mission.md"
  awk '/^## Misiune/{f=1} /^## Mission/{f=1} f' "$lesson" > "$mission"
  lesson="$mission"

  if ! gcc -Wall -Wextra "$src" -o "$bin" 2>"$WORKDIR/${slug}.compile.log"; then
    echo "FAIL $slug: compile error"
    cat "$WORKDIR/${slug}.compile.log"
    FAIL=1
    return
  fi

  # Pull every ```text block from the lesson, in order. Pattern used across
  # lessons: an optional "Input" ```text block immediately followed later by
  # an "Output"/example ```text block. We pair them positionally: blocks come
  # in either single form (output only, no stdin) or pairs (input, output).
  mapfile -t blocks < <(awk '
    /^```text$/{f=1; buf=""; next}
    /^```$/{if(f){print buf; print "---BLOCK-END---"; f=0}; next}
    f{buf = buf $0 "\n"}
  ' "$lesson")

  # Reconstruct blocks array (split on marker)
  local -a text_blocks=()
  local cur=""
  for line in "${blocks[@]}"; do
    if [[ "$line" == "---BLOCK-END---" ]]; then
      text_blocks+=("$cur")
      cur=""
    else
      cur+="$line"$'\n'
    fi
  done

  local n=${#text_blocks[@]}
  if (( n == 0 )); then
    echo "SKIP $slug: no text blocks found to verify against"
    return
  fi

  # Heuristic: if odd count, treat as alternating (input,output,input,output,...)
  # if even count could also be that, or all-outputs with no stdin. We detect
  # by looking at the lesson prose: an "Input" heading right before a block
  # marks it as stdin. Simplify: scan the raw lesson text for the sequence of
  # ```text blocks and note which are preceded (within 2 lines) by "Input".
  mapfile -t is_input < <(awk '
    /^Input$/{pending=1}
    /^\*\*Input\*\*$/{pending=1}
    /^```text$/{
      if(f==0){ print (pending?"1":"0"); pending=0 }
    }
    /^```$/{f=!f}
    /^```text$/{f=1}
  ' "$lesson")

  local i=0
  local ok=1
  while (( i < n )); do
    if [[ "${is_input[$i]:-0}" == "1" ]]; then
      local input="${text_blocks[$i]}"
      local expected="${text_blocks[$((i+1))]}"
      local actual
      actual=$(printf '%s' "$input" | "$bin" 2>&1)
      if [[ "$actual" != "$(printf '%s' "$expected" | sed -e 's/[[:space:]]*$//')" ]]; then
        echo "FAIL $slug: mismatch (input-driven, block $i)"
        echo "  expected: $(printf '%s' "$expected" | tr '\n' '|')"
        echo "  actual:   $(printf '%s' "$actual" | tr '\n' '|')"
        ok=0
      fi
      i=$((i+2))
    else
      local expected="${text_blocks[$i]}"
      local actual
      actual=$("$bin" 2>&1)
      if [[ "$actual" != "$(printf '%s' "$expected" | sed -e 's/[[:space:]]*$//')" ]]; then
        echo "FAIL $slug: mismatch (no-input, block $i)"
        echo "  expected: $(printf '%s' "$expected" | tr '\n' '|')"
        echo "  actual:   $(printf '%s' "$actual" | tr '\n' '|')"
        ok=0
      fi
      i=$((i+1))
    fi
  done

  if (( ok == 1 )); then
    echo "OK   $slug"
  else
    FAIL=1
  fi
}

if [[ $# -gt 0 ]]; then
  for slug in "$@"; do
    check_lesson "$slug"
  done
else
  for f in "$LESSON_DIR"/*-solution.md; do
    slug=$(basename "$f" -solution.md)
    check_lesson "$slug"
  done
fi

exit $FAIL
