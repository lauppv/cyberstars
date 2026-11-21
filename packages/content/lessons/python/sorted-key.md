`sorted()` puts numbers from small to big and words from A to Z. But often we want another order: words by their length, people by their age, ships by their speed. The `key` argument tells `sorted()` what to look at when it compares

---

`key` takes a function. `sorted()` calls it on each item and sorts by what comes back. The items themselves don't change

```py
words = ["comet", "sun", "asteroid", "moon"]
print(sorted(words))
print(sorted(words, key=len))
```

Output

```text
['asteroid', 'comet', 'moon', 'sun']
['sun', 'moon', 'comet', 'asteroid']
```

With `key=len`, `sorted()` compares 5, 3, 8 and 4 instead of the words. We write `len` without brackets: we give the function itself, and `sorted()` calls it

---

Capital letters come before small ones in the codes we saw in Characters and Their Codes, so `"Zara"` comes before `"ada"`. To sort without caring about capitals, compare the small-letter version

```py
names = ["ada", "Zara", "Ben"]
print(sorted(names))
print(sorted(names, key=lambda n: n.lower()))
```

Output

```text
['Ben', 'Zara', 'ada']
['ada', 'Ben', 'Zara']
```

---

A lambda as key lets us sort dictionaries by any of their values. `reverse=True` turns the order around

```py
ships = [
    {"name": "Hope", "speed": 12},
    {"name": "Swift", "speed": 30},
    {"name": "Old Bob", "speed": 5},
]
for ship in sorted(ships, key=lambda s: s["speed"], reverse=True):
    print(ship["name"], ship["speed"])
```

Output

```text
Swift 30
Hope 12
Old Bob 5
```

---

What if two items have the same value? A key can give back a tuple. Python compares the first values, and only when they are equal it looks at the second

```py
racers = [("Kai", 50), ("Ada", 42), ("Ben", 50)]
print(sorted(racers, key=lambda r: (r[1], r[0])))
```

Output

```text
[('Ada', 42), ('Ben', 50), ('Kai', 50)]
```

Kai and Ben both have 50, so the names decide: Ben comes before Kai

---

Lists also have a `.sort()` method. It takes the same `key` and `reverse`, but it changes the list itself and gives back nothing. `sorted()` leaves the old list as it was and makes a new one

```py
scores = [7, 2, 9]
new = sorted(scores)
print(scores, new)
scores.sort(reverse=True)
print(scores)
```

Output

```text
[7, 2, 9] [2, 7, 9]
[9, 7, 2]
```

---

## Mission: Race Results

The station held a race in its long tunnel. Each pilot has a name and a time in seconds, and a smaller time is better

1. Start your program with a variable **pilots**, a list of dictionaries, each with a `"name"` (a string) and a `"time"` (a whole number). For example `pilots = [{"name": "kai", "time": 50}, {"name": "Ada", "time": 42}, {"name": "ben", "time": 50}]`
2. Print the results from the fastest to the slowest, one line each: the place counted from 1, `. `, the name, ` `, the time and `s`. Pilots with the same time go in the order of their names, without caring about capitals
3. Print `By name: ` and all the names in the order of the alphabet, without caring about capitals, joined with `, `

Use `sorted()` or `.sort()` with a `key`. **pilots** has from 1 to 15 pilots, and no two names are the same once written in small letters

**Example** for the pilots above

```text
1. Ada 42s
2. ben 50s
3. kai 50s
By name: Ada, ben, kai
```
