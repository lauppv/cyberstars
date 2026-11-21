In Built-in Functions we saw `enumerate()`: it gives us the position and the value together, so we don't need `range(len(...))`. Now we look at what else it can do

---

A quick reminder. Each time around the loop, `enumerate()` hands us two things: a number and an item. We catch them in two variables

```py
crew = ["Ada", "Alan", "Grace"]
for i, name in enumerate(crew):
    print(i, name)
```

Output

```text
0 Ada
1 Alan
2 Grace
```

---

People count from 1, not from 0. `enumerate()` can start from any number we give it with `start=`

```py
crew = ["Ada", "Alan", "Grace"]
for number, name in enumerate(crew, start=1):
    print(f"{number}. {name}")
```

Output

```text
1. Ada
2. Alan
3. Grace
```

Only the numbers change. The items are the same, and they still come from the first position of the list

---

`enumerate()` works with anything we can loop over, a string too

```py
for i, letter in enumerate("moon"):
    if letter == "o":
        print("o at position", i)
```

Output

```text
o at position 1
o at position 2
```

---

With the position in our hands, we can look at the item before. Here we find where the temperature went up

```py
temperatures = [20, 22, 21, 25]
for i, t in enumerate(temperatures):
    if i > 0 and t > temperatures[i - 1]:
        print(f"Day {i}: up to {t}")
```

Output

```text
Day 1: up to 22
Day 3: up to 25
```

`i > 0` comes first, because the item at position 0 has nothing before it. Python reads `and` from the left and stops as soon as one side is false, so `temperatures[i - 1]` is never asked for position 0

---

We can also use the position to change the list itself

```py
scores = [7, 12, 9]
for i, score in enumerate(scores):
    scores[i] = score * 10
print(scores)
```

Output

```text
[70, 120, 90]
```

Changing `score` alone wouldn't change the list. `scores[i] = ...` does

---

## Mission: Personal Bests

A runner trains on the station's track every day, and writes each day's distance in a list. A day is a new personal best when its distance is bigger than every day before it. The first day is always a personal best

1. Start your program with a variable **distances**, a list of whole numbers: the meters run each day. For example `distances = [800, 750, 1200, 1200, 1500]`
2. Print one line for each day: `Day `, the day's number counted from 1, `: `, and the distance. When the day is a new personal best, add ` new best` at the end
3. Print `Best days: ` and how many days were a new personal best

Use `enumerate()`, not `range()`. **distances** has from 1 to 30 days, each from 0 to 50,000 meters

**Example** for distances = [800, 750, 1200, 1200, 1500]

```text
Day 1: 800 new best
Day 2: 750
Day 3: 1200 new best
Day 4: 1200
Day 5: 1500 new best
Best days: 3
```

Day 4 is not a new best: 1200 is the same as the best so far, not bigger
