Combine **tuples**, **sets**, **nested loops**, and **list comprehension**

---

## Mission: Crew Analysis

You're comparing two teams. Each crew member is a **tuple** of `(name, score)` (both lists are already on the right):

```python
team_a = [("Ana", 85), ("Mihai", 72), ("Elena", 91), ("Radu", 60)]
team_b = [("Ioana", 88), ("Mihai", 65), ("Ana", 91), ("Vlad", 72)]
```

Do the following, in order:

1. Put **team B's names** into a **set**. Then print `In both:` and, on the following lines, go through **team A in order** and print each name that is **also in** that set.
2. Use a **list comprehension** to collect every score from **team A** that is **above 80**. Print `Team A high: ` then that list.
3. Print `Matches:` and then use **nested loops** (team A on the outside, team B on the inside) to print every pair that has the **same score**, as `name1 and name2 both scored X`.

**Output**

```text
In both:
Ana
Mihai
Team A high: [85, 91]
Matches:
Mihai and Vlad both scored 72
Elena and Ana both scored 91
```
