In Built-in Functions we used `zip()` to walk through two lists side by side. Now we take it further: more than two lists, lists of different lengths, and a list next to itself

---

`zip()` takes the first item of each list, then the second of each, and so on. It works with three lists or more too

```py
names = ["Ada", "Alan", "Grace"]
ages = [36, 41, 85]
cities = ["London", "Manchester", "New York"]
for name, age, city in zip(names, ages, cities):
    print(f"{name}, {age}, {city}")
```

Output

```text
Ada, 36, London
Alan, 41, Manchester
Grace, 85, New York
```

Each time around the loop we get one item from each list, so we need as many variables as there are lists

---

When the lists are not the same length, `zip()` stops at the end of the shortest one. The extra items are left out, without an error

```py
planets = ["Mercury", "Venus", "Earth", "Mars"]
moons = [0, 0, 1]
for planet, count in zip(planets, moons):
    print(planet, count)
```

Output

```text
Mercury 0
Venus 0
Earth 1
```

Mars is missing, because `moons` has only three items. Be careful: if a list is shorter by mistake, `zip()` won't tell us

---

Two lists can become a dictionary: one gives the keys, the other the values

```py
codes = ["MER", "VEN", "EAR"]
names = ["Mercury", "Venus", "Earth"]
planets = dict(zip(codes, names))
print(planets["VEN"])
```

Output

```text
Venus
```

---

A nice trick: zip a list with itself moved by one place. Then each step of the loop gets an item and the one after it

```py
heights = [100, 140, 130, 190]
for before, after in zip(heights, heights[1:]):
    print(before, "->", after, "change", after - before)
```

Output

```text
100 -> 140 change 40
140 -> 130 change -10
130 -> 190 change 60
```

`heights[1:]` is the list without its first item, so it is one shorter. That's why `zip()` stops one step early, which is what we want: the last item has nothing after it

---

`zip()` and `enumerate()` work well together. `enumerate()` gives a number and an item, and here the item is a pair from `zip()`. Brackets around the two names catch the pair

```py
names = ["Ada", "Alan"]
ages = [36, 41]
for number, (name, age) in enumerate(zip(names, ages), start=1):
    print(number, name, age)
```

Output

```text
1 Ada 36
2 Alan 41
```

---

## Mission: Most Improved

The trainers of the station's football team test every player twice: once at the start of the month and once at the end. They want to see each player's change, and who improved the most

1. Start your program with three variables: **names**, a list of strings, and **before** and **after**, two lists of whole numbers: the players' scores, in the same order as the names. For example `names = ["Kai", "Mila", "Tom"]`, `before = [60, 75, 80]` and `after = [72, 70, 95]`
2. For each player, print the name, `: `, the score before, `->` with a space on each side, the score after, and the change in brackets, with a `+` in front of it when it isn't negative
3. Print `Most improved: ` and the name of the player with the biggest change. If two players have the same biggest change, print the one that comes first

Use `zip()`, not `range()`. The three lists have the same length, from 1 to 20 players, and every score is from 0 to 100

**Example** for names = ["Kai", "Mila", "Tom"], before = [60, 75, 80] and after = [72, 70, 95]

```text
Kai: 60 -> 72 (+12)
Mila: 75 -> 70 (-5)
Tom: 80 -> 95 (+15)
Most improved: Tom
```

A change of 0 is written `+0`
