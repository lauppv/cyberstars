In List Comprehension we built lists in one line: `[n * 2 for n in numbers]`. The same short form works for dictionaries and sets. Only the brackets change

---

A **dictionary comprehension** uses curly braces and a `key: value` pair before the `for`

```py
names = ["Ada", "Alan", "Grace"]
lengths = {name: len(name) for name in names}
print(lengths)
```

Output

```text
{'Ada': 3, 'Alan': 4, 'Grace': 5}
```

For each name, Python makes one pair: the name is the key, its length is the value. It's the short way to write a loop with `lengths[name] = len(name)` inside

---

An `if` at the end keeps only some items, exactly as in a list comprehension

```py
scores = {"Ada": 92, "Alan": 48, "Grace": 75}
passed = {name: s for name, s in scores.items() if s >= 50}
print(passed)
```

Output

```text
{'Ada': 92, 'Grace': 75}
```

We can also swap keys and values, or build a dictionary from two lists with `zip()`

```py
codes = {"MER": "Mercury", "VEN": "Venus"}
by_name = {planet: code for code, planet in codes.items()}
print(by_name["Venus"])
```

Output

```text
VEN
```

---

A **set comprehension** uses curly braces with one value before the `for`, no colon. Since it's a set, every value is kept only once

```py
words = ["sun", "star", "moon", "sky"]
first = {w[0] for w in words}
print(sorted(first))
```

Output

```text
['m', 's']
```

We print `sorted(first)` and not `first` itself. A set has no order, and a set of strings can come out in another order each time the program runs. `sorted()` gives a list in a fixed order

---

Choose the brackets by what you need. Square brackets `[ ]` for a list, where order and repeats matter. Curly braces with `key: value` for a dictionary, to look things up by a key. Curly braces with one value for a set, to keep each value once

```py
numbers = [3, 1, 3, 2]
print([n * n for n in numbers])
print({n: n * n for n in numbers})
print(sorted({n * n for n in numbers}))
```

Output

```text
[9, 1, 9, 4]
{3: 9, 1: 1, 2: 4}
[1, 4, 9]
```

---

## Mission: Word Index

The station's library wants a small index of a sentence: how long each word is, and which letters start the long words

1. Start your program with a variable **text**, a string of words in small letters, with one space between them. For example `text = "the ship left the moon at dawn"`
2. Print `Lengths: ` and a dictionary with each word as a key and its length as the value, made with a dictionary comprehension. A word that comes twice is in it only once, in the place where it first appears
3. Print `Starts: ` and the sorted list of the first letters of the words with more than 3 letters, each letter once, made with a set comprehension

**text** has from 1 to 20 words, each from 1 to 12 letters

**Example** for text = "the ship left the moon at dawn"

```text
Lengths: {'the': 3, 'ship': 4, 'left': 4, 'moon': 4, 'at': 2, 'dawn': 4}
Starts: ['d', 'l', 'm', 's']
```
