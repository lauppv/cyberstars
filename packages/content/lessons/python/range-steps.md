In For Loops we met the third number of `range()`, the step: `range(0, 11, 2)` gives 0, 2, 4, 6, 8, 10. Now we use the step to walk in other ways: backwards, and through a list one position out of two

---

A negative step counts down. The start is the big number, and the stop is the small one

```py
for second in range(5, 0, -1):
    print(second)
print("Liftoff")
```

Output

```text
5
4
3
2
1
Liftoff
```

The stop is still left out, just like before. `range(5, 0, -1)` stops before 0, so the last number is 1. To reach 0 too, the stop must be -1

---

Bigger steps work the same way in both directions

```py
print(list(range(10, 0, -3)))
print(list(range(1, 10, 4)))
```

Output

```text
[10, 7, 4, 1]
[1, 5, 9]
```

`list()` turns the numbers from `range()` into a list, so we can see them all at once. Each number is the one before it plus the step, as long as we don't reach the stop

---

With `range()` we walk through the **positions** of a list, and the step lets us pick which ones. Here we take every second position

```py
planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter"]
for i in range(0, len(planets), 2):
    print(i, planets[i])
```

Output

```text
0 Mercury
2 Earth
4 Jupiter
```

---

To walk a list from the end, start at the last position, `len(planets) - 1`, and use a negative step. The stop is -1, so that position 0 is the last one we visit

```py
planets = ["Mercury", "Venus", "Earth"]
for i in range(len(planets) - 1, -1, -1):
    print(i, planets[i])
```

Output

```text
2 Earth
1 Venus
0 Mercury
```

A slice like `planets[::-1]` also gives the list backwards, but it doesn't tell us the positions. With `range()` we have both the position and the value

---

## Mission: Night Shift

During the day the sensors write their readings in a list, the newest one last. At night the engineer checks them from the newest to the oldest, and only one reading out of two, starting with the newest

1. Start your program with a variable **readings**, a list of whole numbers. For example `readings = [12, 15, 11, 18, 20]`
2. For each reading the engineer checks, print its position in the list, `: `, and the reading
3. Print `Checked: ` and how many readings were checked

Use `range()` with a step for the positions, not a slice. **readings** has from 1 to 30 numbers

**Example** for readings = [12, 15, 11, 18, 20]

```text
4: 20
2: 11
0: 12
Checked: 3
```

**Example** for readings = [7, 3, 9, 4]

```text
3: 4
1: 3
Checked: 2
```
