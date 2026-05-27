Python comes with a bunch of useful functions already built in. We've already seen **print()**, **len()**, **int()**, **input()**, **range()**, **min()**, **max()**. Let's look at some more that will save us a lot of time

---

**sum()** adds up all the numbers in a list

```py
scores = [80, 95, 70, 88]
print(sum(scores))
```

Output **333**. No need to write a for loop with a total variable, Python does it for us

---

**sorted()** returns a **new** sorted list

```py
numbers = [5, 2, 8, 1, 9, 3]
print(sorted(numbers))
print(numbers)
```

Output

```text
[1, 2, 3, 5, 8, 9]
[5, 2, 8, 1, 9, 3]
```

Notice that the **original** list is unchanged. **sorted()** gives us a new one. If we want to sort in **reverse** (descending) order

```py
print(sorted(numbers, reverse=True))
```

Output **[9, 8, 5, 3, 2, 1]**

It works on strings too

```py
names = ["Tommy", "Lance", "Cortez", "Phil"]
print(sorted(names))
```

Output **['Cortez', 'Lance', 'Phil', 'Tommy']**. Alphabetical order

---

**enumerate()** gives us both the **index** and the **value** when looping through a list

Remember the old way?

```py
names = ["Tommy", "Lance", "Cortez"]
for i in range(len(names)):
    print(f"{i}: {names[i]}")
```

With **enumerate()** it's much cleaner

```py
names = ["Tommy", "Lance", "Cortez"]
for i, name in enumerate(names):
    print(f"{i}: {name}")
```

Output

```text
0: Tommy
1: Lance
2: Cortez
```

Same result, but we don't have to write **range(len(...))** and **names[i]**. Much nicer :)

---

**zip()** combines two lists **element by element**, like a zipper on a jacket

```py
names = ["Tommy", "Lance", "Cortez"]
scores = [95, 80, 70]

for name, score in zip(names, scores):
    print(f"{name}: {score}")
```

Output

```text
Tommy: 95
Lance: 80
Cortez: 70
```

**zip()** pairs up the first element from each list, then the second, then the third, and so on. If the lists have different lengths, it stops at the shortest one

---

**any()** returns **True** if **at least one** element is true. **all()** returns **True** if **every** element is true

```py
scores = [80, 95, 40, 70]

hasFailure = any(s < 50 for s in scores)
print(hasFailure)

allPassed = all(s >= 50 for s in scores)
print(allPassed)
```

Output

```text
True
False
```

**any()**: is there at least one score below 50? Yes (40), so **True**

**all()**: are ALL scores at least 50? No (40 is not), so **False**

---

**abs()** gives us the **absolute value** (removes the minus sign)

```py
print(abs(-5))
print(abs(5))
print(abs(-100))
```

Output

```text
5
5
100
```

---

**round()** rounds a number

```py
print(round(3.7))
print(round(3.2))
print(round(3.14159, 2))
```

Output

```text
4
3
3.14
```

The second argument tells Python how many decimal places we want

---

You have two lists: **names** and **scores**. Using the built-in functions we learned

1. Display each name with their score using **zip** (format: **name: score**)
2. Display the scores **sorted** from lowest to highest
3. Display the **sum** of all scores
4. Display whether **all** students passed (score >= 50)

Expected output

```text
Tommy: 95
Lance: 42
Cortez: 88
Phil: 71
[42, 71, 88, 95]
296
False
```
