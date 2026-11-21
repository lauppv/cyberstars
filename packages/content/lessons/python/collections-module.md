In Frequency Dictionary we counted things by hand with a dictionary. That job is so common that Python has ready tools for it, in the module `collections`. First, one small dictionary method that helps with counting too: `.get()`

---

Reading a key that isn't in a dictionary stops the program with a KeyError. `.get(key, default)` gives back the default instead

```py
moons = {"Earth": 1, "Mars": 2}
print(moons.get("Mars", 0))
print(moons.get("Venus", 0))
```

Output

```text
2
0
```

With it, counting fits in one line: `counts[word] = counts.get(word, 0) + 1`

---

`Counter` does all the counting for us. Give it a list, or a string, and it counts how many times each item is there

```py
from collections import Counter

votes = ["pizza", "soup", "pizza", "salad", "pizza", "soup"]
counts = Counter(votes)
print(counts["pizza"])
print(counts["cake"])
print(counts.most_common(2))
```

Output

```text
3
0
[('pizza', 3), ('soup', 2)]
```

A `Counter` works like a dictionary, but a missing item counts as 0 instead of an error. `.most_common(n)` gives the `n` most common items with their counts, as pairs, the biggest count first. Items with the same count stay in the order they first appeared

---

`defaultdict` is a dictionary that makes a value by itself the first time a key is used. We tell it what kind of value: `list` for an empty list, `int` for 0

```py
from collections import defaultdict

words = ["sun", "star", "moon", "sky", "mars"]
by_letter = defaultdict(list)
for word in words:
    by_letter[word[0]].append(word)
print(by_letter["s"])
print(by_letter["m"])
print(len(by_letter))
```

Output

```text
['sun', 'star', 'sky']
['moon', 'mars']
2
```

With a normal dictionary, `by_letter["s"].append(...)` would fail the first time, since there is no list yet. `defaultdict(list)` makes one on the spot. That's the classic way to put items into groups

---

`defaultdict(int)` starts every new key at 0, which is another way to count

```py
from collections import defaultdict

totals = defaultdict(int)
for item, kilos in [("rice", 5), ("salt", 1), ("rice", 3)]:
    totals[item] += kilos
print(dict(totals))
```

Output

```text
{'rice': 8, 'salt': 1}
```

`dict()` turns it into a normal dictionary, so it prints the usual way

---

## Mission: Word Count

The station's radio log is a long line of words. The crew wants to know which words come up the most, and to see the words grouped by their first letter

1. Start your program with a variable **text**, a string of words in small letters, with one space between them. For example `text = "go to the moon and to the stars and back"`
2. Print `Words: ` and how many words the text has, and `Different: ` and how many different words
3. Print `Top: ` and the 3 most common words with their counts, like `to 2, the 2, and 2`. With fewer than 3 different words, print all of them. Words with the same count go in the order they first appear
4. For each first letter, from a to z, print the letter, `: `, and the different words that start with it, joined with ` `, in the order they first appear

Use `Counter` and `defaultdict`. **text** has from 1 to 30 words

**Example** for text = "go to the moon and to the stars and back"

```text
Words: 10
Different: 7
Top: to 2, the 2, and 2
a: and
b: back
g: go
m: moon
s: stars
t: to the
```
