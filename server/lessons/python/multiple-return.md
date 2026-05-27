We learned that **return** sends a value back from a function. But what if we want to send back **more than one value**? For example, a function that gives us both the **minimum** and **maximum** of a list

In many programming languages, this is tricky. In Python, it's beautifully simple

```py
def minMax(numbers):
    return min(numbers), max(numbers)

smallest, largest = minMax([5, 2, 8, 1, 9])
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
def minMax(numbers):
    return min(numbers), max(numbers)

result = minMax([5, 2, 8, 1, 9])
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
def playerStats(scores):
    total = sum(scores)
    average = total / len(scores)
    best = max(scores)
    return total, average, best

t, avg, top = playerStats([80, 95, 70, 88])
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
def splitName(fullName):
    parts = fullName.split(" ")
    firstName = parts[0]
    lastName = parts[1]
    return firstName, lastName

first, last = splitName("Tommy Vercetti")
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

Write a function **analyzeWord** that takes a **word** and returns **three** values: the word in **uppercase**, the word in **lowercase**, and its **length**

```py
upper, lower, length = analyzeWord("Cortez")
```

Display each on a separate line. Expected output

```text
CORTEZ
cortez
6
```
