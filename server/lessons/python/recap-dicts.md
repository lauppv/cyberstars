Combine **return values**, **dictionaries**, and **looping over dictionaries**

---

Build a **grade report** system. Write a function **analyze_grades(grades)** that takes a dictionary of student names and grades, and **returns a dictionary** with:

- **"average"** — the average grade (use a loop to sum values)
- **"best"** — the name of the student with the highest grade
- **"passing"** — a list of names with grade >= 50

Use this dictionary:
```python
grades = {"Ana": 95, "Mihai": 42, "Elena": 88, "Radu": 37, "Ioana": 76}
```

Call the function and print the results

Expected output
```text
Average: 67.6
Best: Ana
Passing: Ana, Elena, Ioana
```

For the average, use one decimal place with an f-string: `f"{value:.1f}"`

For passing, join the names with `", ".join(list)`
