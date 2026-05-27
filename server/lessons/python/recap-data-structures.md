Combine **tuples**, **sets**, **nested loops**, and **list comprehension**

---

You're analyzing data from two classes. Each student is a **tuple** of (name, grade):

```python
class_a = [("Ana", 85), ("Mihai", 72), ("Elena", 91), ("Radu", 72)]
class_b = [("Ioana", 88), ("Mihai", 65), ("Ana", 92), ("Vlad", 78)]
```

Do the following:

1. Use a **set** to find students who appear in **both** classes (by name). Print them
2. Use a **list comprehension** to get all grades from class_a that are **above 80**
3. Use **nested loops** to find all pairs of students (one from each class) who have the **same grade**. If none, print "No matching grades"

Expected output

```text
Students in both: Ana, Mihai
High grades from A: [85, 91]
No matching grades
```

For the set of common names, extract names from each class into sets and use **&** (intersection)
