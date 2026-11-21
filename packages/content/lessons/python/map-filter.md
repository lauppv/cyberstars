Two jobs come up all the time with lists: change every item in the same way, and keep only the items we want. Python has a built-in function for each: `map()` and `filter()`. Both take a function, often a lambda, and a list

---

`map()` calls the function on each item and gives back the results. To see them as a list, we put `list()` around it

```py
meters = [1500, 300, 42000]
kilometers = list(map(lambda m: m / 1000, meters))
print(kilometers)
```

Output

```text
[1.5, 0.3, 42.0]
```

Any function works, not only a lambda. `map(str, numbers)` turns every number into a string, which is handy before `join()`

```py
numbers = [3, 1, 4]
print("-".join(map(str, numbers)))
```

Output

```text
3-1-4
```

---

`filter()` calls the function on each item and keeps only the items where it gives back True

```py
ages = [12, 30, 17, 45, 18]
adults = list(filter(lambda a: a >= 18, ages))
print(adults)
```

Output

```text
[30, 45, 18]
```

The kept items don't change, and they stay in the same order

---

We can put them together: first keep some items, then change them

```py
words = ["moon", "sun", "comet", "star"]
long_words = filter(lambda w: len(w) > 3, words)
print(list(map(lambda w: w.upper(), long_words)))
```

Output

```text
['MOON', 'COMET', 'STAR']
```

---

`map()` and `filter()` don't make a list right away. They give the items one at a time, when someone asks for them, and only once. That's why we use `list()` to see them, and why a second `list()` of the same result is empty

```py
doubled = map(lambda x: x * 2, [1, 2])
print(list(doubled))
print(list(doubled))
```

Output

```text
[2, 4]
[]
```

List comprehensions, which we met earlier, can do the same jobs: `[m / 1000 for m in meters]`. Use the one that reads better to you. Many Python programmers pick a comprehension when they would need a lambda, and `map()` when a function already exists, like `str`

---

## Mission: Hot Spots

The station's sensors send temperatures in tenths of a degree, as whole numbers: `215` means 21.5 degrees. The engineers want them in degrees, and a list of the places that are too hot

1. Start your program with two variables: **readings**, a list of whole numbers, and **limit**, a whole number of degrees. For example `readings = [215, 380, 199, 402]` and `limit = 30`
2. Print `Degrees: ` and the list of readings in degrees, using `map()`. Divide by 10: multiplying by 0.1 gives numbers like `19.900000000000002`, since a computer can't store 0.1 exactly
3. Print `Too hot: ` and the list of readings in degrees that are bigger than the limit, using `filter()`
4. Print `Count: ` and how many readings are too hot

**readings** has from 1 to 30 readings, each from -500 to 1000, and **limit** is from -50 to 100

**Example** for readings = [215, 380, 199, 402] and limit = 30

```text
Degrees: [21.5, 38.0, 19.9, 40.2]
Too hot: [38.0, 40.2]
Count: 2
```
