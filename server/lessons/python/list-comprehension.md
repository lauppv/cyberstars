By now we've written a lot of loops that create a new list from an existing one. Something like: "go through a list, do something with each element, and put the result in a new list"

```py
numbers = [1, 2, 3, 4, 5]
doubled = []

for n in numbers:
    doubled.append(n * 2)

print(doubled)
```

Output **[2, 4, 6, 8, 10]**

This pattern is so common that Python gives us a shortcut: **list comprehension**

```py
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)
```

Output **[2, 4, 6, 8, 10]**. Same result, one line instead of four. The syntax is: **[expression for variable in collection]**

Let's break it down:

- **n \* 2** is the expression, what we want to do with each element
- **for n in numbers** is the loop, going through each element
- The **square brackets []** tell Python to put the results in a new list

---

We can also add an **if** to filter elements

```py
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [n for n in numbers if n % 2 == 0]
print(evens)
```

Output **[2, 4, 6, 8, 10]**. Only the numbers where **n % 2 == 0** made it into the new list

```py
names = ["Tommy Vercetti", "Lance", "Cortez", "Phil Cassidy"]
long_names = [name for name in names if len(name) > 6]
print(long_names)
```

Output **['Tommy Vercetti', 'Phil Cassidy']**. Only names longer than 6 characters survived

---

We can transform and filter at the same time

```py
names = ["tommy", "lance", "cortez"]
upper = [name.upper() for name in names]
print(upper)
```

Output **['TOMMY', 'LANCE', 'CORTEZ']**

```py
prices = [10, 25, 5, 40, 15, 30]
discounted = [price * 0.9 for price in prices if price > 20]
print(discounted)
```

Output **[22.5, 36.0, 13.5, 27.0]**. We took only prices above 20, then applied a 10% discount

---

**When to use it?** List comprehensions are great for simple transformations. If the logic gets complicated (nested ifs, multiple lines of processing), use a regular **for** loop instead. Readability is more important than being clever

```py
scores = [85, 42, 91, 67, 38, 74, 95]
passed = [s for s in scores if s >= 50]
print(passed)
```

Clean. Easy to read. Perfect use case

---

## Mission: Data Filter

You have a list of sensor readings (already on the right). Using **list comprehension** for each step:

1. Create `high` — only the readings **above 80**
2. Create `doubled` — every reading **multiplied by 2**
3. Create `passing` — only the readings that are **50 or more**
4. Print all three lists, each on its own line

**Output**

```text
[95, 88, 92]
[150, 60, 190, 176, 84, 184]
[75, 95, 88, 92]
```
