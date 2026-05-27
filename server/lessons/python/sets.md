We know **lists**, **tuples**, and **dictionaries**. Time for the last big collection type: **sets**

A **set** is a collection where **every element is unique**. No duplicates allowed. Think of it like a guest list for a party — each person can only be on the list **once**

```py
guests = {"Tommy", "Lance", "Cortez", "Tommy"}
print(guests)
```

Output

```text
{'Lance', 'Cortez', 'Tommy'}
```

Wait, we wrote **Tommy** twice, but he only appears once. That's the whole point of a set — it automatically removes duplicates. Also notice that the **order might be different** from how we wrote them. Sets don't care about order, only about **what's inside**

---

Sets use **curly braces {}**, just like dictionaries. But there's no **key: value**, just values. If it has colons it's a dictionary, if it doesn't it's a set

```py
mySet = {1, 2, 3}
myDict = {"a": 1, "b": 2}
```

**Be careful** with empty collections

```py
empty_dict = {}
empty_set = set()
```

An empty **{}** creates a dictionary, not a set. To create an empty set, use **set()**

---

We can **add** elements with **.add()** and **remove** them with **.remove()**

```py
weapons = {"bat", "pistol"}
weapons.add("shotgun")
print(weapons)

weapons.remove("bat")
print(weapons)
```

Notice we use **.add()**, not **.append()** like with lists. Sets don't have an order, so "appending at the end" doesn't make sense

---

The most useful thing about sets: checking if something **is in** the set. This is **extremely fast**, much faster than checking in a list

```py
bannedPlayers = {"Sonny", "Diaz", "Gonzalez"}

player = "Tommy"
if player in bannedPlayers:
    print(f"{player} is banned!")
else:
    print(f"{player} is welcome")
```

Output **Tommy is welcome**

---

A super common use case: **removing duplicates from a list**

```py
names = ["Tommy", "Lance", "Tommy", "Cortez", "Lance", "Lance"]
uniqueNames = list(set(names))
print(uniqueNames)
```

We converted the list to a set (which removed duplicates), then back to a list. Clean and simple

---

**len()** works on sets too

```py
colors = {"red", "green", "blue", "red"}
print(len(colors))
```

Output **3**, not 4, because the duplicate **red** was removed

---

You have a list **votes** on the right with some repeated names. Do the following

1. Display how many **total** votes there are (length of the list)
2. Create a set from the list to find the **unique** voters
3. Display how many **unique** voters there are
4. Display the unique voters

Expected output

```text
8
4
{'Fiona', 'Shrek', 'Donkey', 'Puss'}
```

The order of names in the set might be different, that's fine :)
