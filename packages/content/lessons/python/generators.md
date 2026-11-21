A normal function runs to its `return` and is done. A **generator** is a function that can stop in the middle, hand out a value, and later go on from the same place. It uses `yield` instead of `return`

---

Any function with `yield` in it is a generator. Calling it doesn't run its code yet: it gives back a generator object, ready to hand out values

```py
def three():
    yield "one"
    yield "two"
    yield "three"

for word in three():
    print(word)
```

Output

```text
one
two
three
```

The `for` loop asks the generator for a value. The code runs until the first `yield`, hands out `"one"` and pauses there. The loop asks again, and the code goes on from where it paused, up to the next `yield`. When the code reaches its end, the loop stops

---

`next()` asks a generator for its next value by hand. This shows the pausing clearly

```py
def countdown(start):
    print("starting")
    while start > 0:
        yield start
        start -= 1

timer = countdown(3)
print(next(timer))
print(next(timer))
print(list(timer))
```

Output

```text
starting
3
2
[1]
```

`starting` is printed only once, at the first `next()`. The generator remembers its variables between values: `start` is still 2 when the second `next()` comes. `list()` takes all the values that are left. A generator gives each value once, so after that it's empty

Asking an empty generator with `next()` stops the program with a StopIteration error. A second value in the brackets is what `next()` gives back instead when nothing is left

```py
def countdown(start):
    while start > 0:
        yield start
        start -= 1

print(next(countdown(0), "nothing"))
print(next(countdown(2), "nothing"))
```

Output

```text
nothing
2
```

---

Why not just return a list? A generator makes each value only when it's asked for. It doesn't keep them all in memory, and it can stop early. It can even go on forever, as long as the loop that uses it stops

```py
def squares():
    n = 1
    while True:
        yield n * n
        n += 1

found = []
for s in squares():
    if s > 50:
        break
    found.append(s)
print(found)
```

Output

```text
[1, 4, 9, 16, 25, 36, 49]
```

`while True` would never end in a normal function. Here it's fine: the generator pauses at each `yield`, and the `break` in our loop stops asking

---

A generator can also use the values it gets as parameters, and `return` can end it early. A `return` in a generator just stops it, without handing out anything

```py
def evens_up_to(limit):
    for n in range(0, limit + 1, 2):
        if n > 6:
            return
        yield n

print(list(evens_up_to(100)))
```

Output

```text
[0, 2, 4, 6]
```

---

## Mission: Fuel Burn

A ship burns the same amount of fuel at each tick of the engine, until it can't burn a full amount anymore

1. Write a generator **burn(fuel, rate)** that hands out the fuel left after each tick: first `fuel - rate`, then `fuel - 2 * rate`, and so on. It stops before the fuel would go below 0. Use `yield`
2. Start your program with two variables: **fuel** and **rate**, two whole numbers. For example `fuel = 10` and `rate = 3`
3. Print `First: ` and the first value of a new generator, using `next()`. If the generator has no values, print `First: none`
4. Print one line for each tick of another new generator: `Tick `, the tick's number counted from 1, `: ` and the fuel left
5. Print `Ticks: ` and how many ticks there were

**fuel** is from 0 to 200 and **rate** from 1 to 50

**Example** for fuel = 10 and rate = 3

```text
First: 7
Tick 1: 7
Tick 2: 4
Tick 3: 1
Ticks: 3
```

A fuel of exactly 0 after a tick still counts: for fuel = 6 and rate = 3 the ticks are 3 and 0
