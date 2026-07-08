Combine **tuples**, **sets**, **nested loops**, and **list comprehension**

---

## Mission: Crew Analysis

You're comparing two teams. Each crew member is a **tuple** of `(name, score)`:

```py
team_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
team_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]
```

Do the following, in order:

1. Put **team B's names** into a **set**. Then print `In both:` and, on the following lines, go through **team A in order** and print each name that is **also in** that set.
2. Use a **list comprehension** to collect every score from **team A** that is **above 80**. Print `Team A high: ` then that list.
3. Print `Matches:` and then use **nested loops** (team A on the outside, team B on the inside) to print every pair that has the **same score**, as `name1 and name2 both scored X`.

**Output**

```text
In both:
Tommy
Lance
Team A high: [85, 91]
Matches:
Lance and Quinn both scored 72
Cortez and Tommy both scored 91
```
