We know lists, tuples, and dictionaries. Time for the last big collection type: sets

A **set** is a collection where **every element is unique**. No duplicates allowed. Think of it like a guest list for a party: each person can only be on the list once

```py
guests = {"Tommy", "Lance", "Cortez", "Tommy"}
print(guests)
```

Output

```text
{'Lance', 'Cortez', 'Tommy'}
```

Wait, we wrote Tommy twice, but he only appears once. That's the whole point of a set: it automatically removes duplicates. Also notice that the order might be different from how we wrote them. Sets don't care about order, only about what's inside

---

Sets use **curly braces {}**, just like dictionaries. But there's no key: value, just values. If it has colons it's a dictionary, if it doesn't it's a set

```py
my_set = {1, 2, 3}
my_dict = {"a": 1, "b": 2}
```

Be careful with empty collections

```py
empty_dict = {}
empty_set = set()
```

An empty **{}** creates a dictionary, not a set. To create an empty set, use **set()**

---

We can add elements with **.add()** and remove them with **.remove()**

```py
weapons = {"bat", "pistol"}
weapons.add("shotgun")
print(weapons)

weapons.remove("bat")
print(weapons)
```

Notice we use .add(), not .append() like with lists. Sets don't have an order, so "appending at the end" doesn't make sense

---

The **in** operator checks whether a value is in a collection. It works with lists and dictionaries too. Sets are especially useful when we want unique values or need to compare groups of values

```py
banned_players = {"Sonny", "Diaz", "Gonzalez"}

player = "Tommy"
if player in banned_players:
    print(f"{player} is banned!")
else:
    print(f"{player} is welcome")
```

Output **Tommy is welcome**

---

Sets can also perform **set operations**: combine groups, find what they share, or find what is in one group but not another

```py
crew = {"Tommy", "Lance", "Cortez"}
engineers = {"Lance", "Phil"}

print(crew | engineers)  # union: everyone in either set
print(crew & engineers)  # intersection: in both sets
print(crew - engineers)  # difference: in crew, but not engineers
print(crew ^ engineers)  # symmetric difference: in exactly one set
```

You can also call these as methods: `.union()`, `.intersection()`, `.difference()`, and `.symmetric_difference()`

---

len() works on sets too

```py
colors = {"red", "green", "blue", "red"}
print(len(colors))
```

Output **3**, not 4, because the duplicate red was removed

---

## Mission: Crew Overlap

Two station teams reported the codes they can repair. Their lists are stored in `crew_a` and `crew_b`. Turn each list into a set, then use set operations to report:

1. `Shared: ` the number of codes in both teams
2. `Only A: ` the number of codes only team A can repair
3. `Combined: ` the number of different codes either team can repair
4. `One team: ` the number of codes that exactly one team can repair

Use intersection (`&`), difference (`-`), union (`|`), and symmetric difference (`^`).

**Output**

```text
Shared: 2
Only A: 1
Combined: 5
One team: 3
```
