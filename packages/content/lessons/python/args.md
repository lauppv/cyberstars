Some functions don't know how many values they will get. `print()` takes one value, or two, or ten. We can write functions like that too, with a star in front of a parameter: `*args`

---

A parameter with `*` in front catches all the values given in order, however many there are, and puts them in a **tuple**

```py
def show(*values):
    print(values)
    print(len(values))

show(4, 8, 15)
show("hi")
show()
```

Output

```text
(4, 8, 15)
3
('hi',)
1
()
0
```

A tuple is like a list we can't change, as we saw in Tuples. With no values at all, the tuple is empty. The name doesn't have to be `args`: `*values`, `*numbers` or `*names` are all fine. Pick one that says what's inside

---

Since it's a tuple, we can loop over it, take its length, or give it to `sum()`

```py
def average(*numbers):
    if len(numbers) == 0:
        return 0
    return sum(numbers) / len(numbers)

print(average(2, 4, 9))
print(average(10))
print(average())
```

Output

```text
5.0
10.0
0
```

Checking for an empty tuple first keeps us from dividing by zero

---

Normal parameters can come before the star. They take the first values, and the star takes the rest

```py
def team(captain, *others):
    print("Captain:", captain)
    for name in others:
        print("Crew:", name)

team("Ada", "Alan", "Grace")
```

Output

```text
Captain: Ada
Crew: Alan
Crew: Grace
```

---

The star works the other way round too. When we already have a list, a `*` in front of it in a call spreads its items out, as if we wrote each one by hand

```py
def average(*numbers):
    if len(numbers) == 0:
        return 0
    return sum(numbers) / len(numbers)

scores = [6, 8, 10]
print(average(*scores))
print(average(scores[0], scores[1]))
```

Output

```text
8.0
7.0
```

Without the star, `average(scores)` would get one value, the whole list, and `sum()` of a tuple holding a list fails

---

## Mission: Weigh Station

Boxes arrive at the station's scales one by one, a few at a time, or none at all. The scales need one function that works for any number of boxes

1. Write a function **summary(\*weights)** that returns a line like `boxes 3, total 45 kg, heaviest 25 kg`. With no boxes the heaviest is 0
2. Start your program with a variable **boxes**, a list of whole numbers: the weights in kilograms. For example `boxes = [10, 25, 10]`
3. Print three lines: the summary of all the boxes, the summary of no boxes, and the summary of only the first and the last box

**boxes** has from 1 to 20 boxes, each from 1 to 500 kg

**Example** for boxes = [10, 25, 10]

```text
boxes 3, total 45 kg, heaviest 25 kg
boxes 0, total 0 kg, heaviest 0 kg
boxes 2, total 20 kg, heaviest 10 kg
```

When the list has one box, that box is both the first and the last, so the third line counts it twice
