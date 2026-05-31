Combine **return values**, **dictionaries**, and **looping over dictionaries**

---

## Mission: Mission Control Report

Write a function `analyze(scores)` that takes a dictionary of crew names → scores and **returns a dictionary** with three keys:

- `"average"` — the average score (sum of all scores divided by how many there are)
- `"top"` — the name of the crew member with the highest score
- `"passing"` — a **list** of names whose score is **50 or more**

The crew scores are already on the right:

```python
scores = {"Ana": 95, "Mihai": 42, "Elena": 88, "Radu": 37, "Ioana": 76}
```

Call the function, then print the report:

1. `Average: ` then the average
2. `Top: ` then the top name
3. `Passing:` on its own line, then each passing name on the following lines (loop over the list)

**Output**

```text
Average: 67.6
Top: Ana
Passing:
Ana
Elena
Ioana
```
