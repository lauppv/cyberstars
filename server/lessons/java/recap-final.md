Combine **sorting**, **enhanced patterns**, **enums**, and **switch**

---

Build a **task board** system. Define an enum **Priority** with values **LOW**, **MEDIUM**, **HIGH**, **CRITICAL**

Create a class **Task** with fields: **title** (String), **priority** (Priority), **done** (boolean)

Write these methods:

**static String priorityLabel(Priority p)** — use a **switch** to return a label: LOW → "[  ]", MEDIUM → "[* ]", HIGH → "[**]", CRITICAL → "[!!]"

In main, create an ArrayList of tasks:
- "Write tests" — HIGH — done
- "Fix bug" — CRITICAL — not done
- "Update docs" — LOW — done
- "Code review" — MEDIUM — not done
- "Deploy" — CRITICAL — not done

**Sort** the list by priority (CRITICAL first, LOW last). Use **Collections.sort** with a Comparator that compares **.ordinal()** values in reverse

Print the board using an **enhanced for** loop. Mark done tasks with "(DONE)"

Expected output
```text
=== TASK BOARD ===
[!!] Fix bug
[!!] Deploy
[**] Write tests (DONE)
[* ] Code review
[  ] Update docs (DONE)
```
