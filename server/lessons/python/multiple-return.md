We learned that **return** sends a value back from a function. But what if we want to send back **more than one value**? For example, a function that gives us both the **minimum** and **maximum** of a list

In many programming languages, this is tricky. In Python, it's beautifully simple

```py
def min_max(numbers):
    return min(numbers), max(numbers)

smallest, largest = min_max([5, 2, 8, 1, 9])
print(smallest)
print(largest)
```

Output

```text
1
9
```

What happened? The function **returned two values** separated by a comma. On the outside, we **unpacked** them into two variables, just like we did with tuples. In fact, that's exactly what Python does behind the scenes — it creates a **tuple** and then unpacks it

```py
def min_max(numbers):
    return min(numbers), max(numbers)

result = min_max([5, 2, 8, 1, 9])
print(result)
print(type(result))
```

Output

```text
(1, 9)
<class 'tuple'>
```

See? It's a tuple. **return a, b** is the same as **return (a, b)**. Python lets us skip the parentheses for convenience

---

This is incredibly useful for functions that compute related values

```py
def player_stats(scores):
    total = sum(scores)
    average = total / len(scores)
    best = max(scores)
    return total, average, best

t, avg, top = player_stats([80, 95, 70, 88])
print(f"Total: {t}")
print(f"Average: {avg}")
print(f"Best: {top}")
```

Output

```text
Total: 333
Average: 83.25
Best: 95
```

One function, three useful values back. Clean

---

Another common use: a function that **splits** a full name

```py
def split_name(full_name):
    parts = full_name.split(" ")
    first_name = parts[0]
    last_name = parts[1]
    return first_name, last_name

first, last = split_name("Tommy Vercetti")
print(f"First: {first}")
print(f"Last: {last}")
```

Output

```text
First: Tommy
Last: Vercetti
```

**.split(" ")** is a new string method: it splits a string by a separator (in this case a space) and returns a **list** of the parts. So **"Tommy Vercetti".split(" ")** gives us **["Tommy", "Vercetti"]**

---

## Mission: Coordinate Parser

Write a function `parse(reading)` that takes a string of three numbers separated by spaces (like `"45 90 12"`) and returns **three values**: the **sum**, the **largest**, and the **smallest**.

Inside the function, use `.split(" ")` to break the string into parts and turn each part into a number. Then **return** all three results at once.

In the main program, **read** a line, call `parse`, **unpack** the three values, and print them.

**Input:**

- three numbers on one line, separated by spaces

**Output**

```text
Total: 147
Largest: 90
Smallest: 12
```

**Example**

If the user types

```text
45 90 12
```

the program prints the output shown above.
