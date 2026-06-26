This is a **recap**. It puts to work the things you've learned recently: **return values** (`return`), **dictionaries**, and **looping** over them with `.keys()`, `.values()`, and `.items()`. You decide how to combine them

---

## Mission: Mission Control Report

You have a dictionary of crew members and their scores from the last mission.

Write a function `analyze(scores)` that takes this dictionary and **returns a new dictionary** with three keys:

- `"average"` — the average score (sum of all scores divided by how many members there are)
- `"top"` — the name of the member with the highest score
- `"passing"` — a **list** of names whose score is **50 or more**

Then **call** the function and use the returned dictionary to print the report:

1. `Average: ` then the average
2. `Top: ` then the top name
3. `Passing:` on its own line, then each passing name on its own line (loop over the list)

**Output**

```text
Average: 67.6
Top: Tommy
Passing:
Tommy
Cortez
Mira
```
