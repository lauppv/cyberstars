Text often comes as one long line: a list of names, a row of numbers, a sentence. Two string methods help us work with it: `split()` cuts a string into a list, and `join()` glues a list back into a string

---

`split()` cuts a string where it finds spaces, and gives back a list of the pieces

```py
sentence = "we are going to the moon"
words = sentence.split()
print(words)
print(len(words))
```

Output

```text
['we', 'are', 'going', 'to', 'the', 'moon']
6
```

`len(words)` tells us how many words the sentence has. Even if there are two or three spaces between the words, `split()` with nothing inside the brackets still finds only the words

---

We can tell `split()` where to cut. Data often comes with commas between the values

```py
line = "Mercury,Venus,Earth,Mars"
planets = line.split(",")
for planet in planets:
    print(planet)
```

Output

```text
Mercury
Venus
Earth
Mars
```

The comma is gone: `split(",")` cuts at each comma and throws the comma away. The result is a normal list, so we can loop over it, read `planets[0]`, or use `append`

---

`join()` does the opposite. We write the glue first, then `.join()` with the list inside

```py
planets = ["Mercury", "Venus", "Earth"]
print(" - ".join(planets))
print("".join(planets))
```

Output

```text
Mercury - Venus - Earth
MercuryVenusEarth
```

The glue goes between the items, never before the first or after the last. With an empty string `""` as glue, the items stick together

`join()` works only on a list of strings. A list of numbers must become strings first, for example with `str()` in a loop

---

Together they change one format into another. Here we turn a line with commas into a line with slashes, and make every name uppercase on the way

```py
line = "ada,alan,grace"
names = line.split(",")
loud = []
for name in names:
    loud.append(name.upper())
print(" / ".join(loud))
```

Output

```text
ADA / ALAN / GRACE
```

---

## Mission: Crew Badges

The station's computer sends the crew list as one line: the names are separated by commas, and each name is a first name and a last name, in small letters

1. Start your program with a variable **crew**, a string. For example `crew = "ada lovelace,alan turing,grace hopper"`
2. Print `People: ` and how many people are in the crew
3. Print `Badges: ` and the initials of each person in capital letters, joined with `-`
4. Print `Last names: ` and all the last names, joined with `, `

**crew** has from 1 to 10 people. Every name is two words with one space between them, and there are no spaces around the commas

**Example** for crew = "ada lovelace,alan turing,grace hopper"

```text
People: 3
Badges: AL-AT-GH
Last names: lovelace, turing, hopper
```

**Example** for crew = "sally ride"

```text
People: 1
Badges: SR
Last names: ride
```
