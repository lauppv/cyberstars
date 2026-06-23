We have a list of names. We want to greet each one of them. We could do

```py
names = ["Tommy", "Lance", "Cortez"]
print(f"Hello, {names[0]}!")
print(f"Hello, {names[1]}!")
print(f"Hello, {names[2]}!")
```

Once again, we **repeat** code. What if the list has 100 names? We won't write 100 prints. We use a **for** loop. Technically you could also use a **while** loop, but a **for** is more suitable here

```py
names = ["Tommy", "Lance", "Cortez"]
for i in names:
    print(f"Hello, {i}!")
```

Output

```text
Hello, Tommy!
Hello, Lance!
Hello, Cortez!
```

What does this mean? We tell **Python** like this: we use **i** to go through the list **names**. The first time, **i** will be `Tommy`, then **i** will be `Lance` and so on. The behavior is similar to `for i in range()`, except this time we go through a list

---

We can also use **range()** with **len()** if we want the **index** as well as the value

```py
names = ["Tommy", "Lance", "Cortez"]
for i in range(0, len(names)):
    print(f"Hero number {i + 1}: {names[i]}")
```

Output

```text
Hero number 1: Tommy
Hero number 2: Lance
Hero number 3: Cortez
```

Why **i + 1**? Because we count from **0** in code, but humans usually start from **1** when they say "first, second, third". So we add **1** just for display

Both styles are useful. **for n in names** is cleaner when we just want the value. **for i in range(...)** is necessary when we need the position too

---

A classic use case: **summing** numbers in a list

```py
prices = [10, 20, 30, 40]
total = 0
for i in prices:
    total = total + i
print(total)
```

Output **100**. We started with **total = 0**, then for each price **i** we added it to **total**. This is one of the most common patterns in programming, and you will write it many, many times. Read the code line by line and make sure you understand **why** it works

---

## Mission: The Ship's Crew

On the right you have the list of the **20** crew members. Ground control has selected three people for a spacewalk (EVA): the ones at **indexes 5, 10 and 12** in the list

Loop over the list with a **for** loop and print each member numbered (`1. Mary`, `2. Andrew` and so on — use the index with **i + 1**). For the members at indexes **5**, **10** and **12** add ` -> selected for EVA` at the end

Careful: we count from **0**, so index **5** is the **6**th member printed

**Output**

```text
1. Mary
2. Andrew
3. Helen
4. Michael
5. Anna
6. Victor -> selected for EVA
7. Joanna
8. George
9. Diana
10. Robert
11. Christine -> selected for EVA
12. Alex
13. Gabrielle -> selected for EVA
14. Steven
15. Laura
16. Brian
17. Andrea
18. Paul
19. Rose
20. Daniel
```

Change the selected indexes or add a new member and run again — watch the EVA tag move
