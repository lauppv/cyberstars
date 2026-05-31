Combine **sorting**, **enhanced patterns**, **enums**, and **switch**

---

## Mission: Bridge Command Board

The station captain uses a priority board to track critical tasks. Build the board system using enums for priority levels, sorting for urgency order, and a switch for display labels.

1. Define an enum **`Priority`** with values `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
2. Create a class **`Task`** with fields: `title` (String), `priority` (Priority), `done` (boolean)
3. Write **`static String priorityLabel(Priority p)`** — use a **switch** to return: LOW -> `"[  ]"`, MEDIUM -> `"[* ]"`, HIGH -> `"[**]"`, CRITICAL -> `"[!!]"`
4. In main, create an ArrayList of tasks:
   - "Write tests" — HIGH — done
   - "Fix bug" — CRITICAL — not done
   - "Update docs" — LOW — done
   - "Code review" — MEDIUM — not done
   - "Deploy" — CRITICAL — not done
5. **Sort** the list by priority (CRITICAL first, LOW last) using `Collections.sort` with a Comparator that compares `.ordinal()` values in reverse
6. Print the board with an enhanced for loop. Mark done tasks with `"(DONE)"`

**Output**

```text
=== TASK BOARD ===
[!!] Fix bug
[!!] Deploy
[**] Write tests (DONE)
[* ] Code review
[  ] Update docs (DONE)
```
