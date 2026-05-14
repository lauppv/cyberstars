In real programs, we constantly need to **filter** data (keep only what we want) and **transform** it (change every element in some way). These are two of the most common operations in programming, and we've already seen them — now let's practice them as a skill

---

**Filtering** means: go through a list and keep only the elements that match a condition

```py
scores = [45, 82, 67, 91, 38, 74, 55, 96]
passed = []
for s in scores:
    if s >= 50:
        passed.append(s)
print(passed)
```
Output **[82, 67, 91, 74, 55, 96]**

Or with list comprehension
```py
passed = [s for s in scores if s >= 50]
```
Same result, shorter code

---

**Transforming** means: apply an operation to every element

```py
prices = [10.0, 25.5, 8.0, 42.0]
withTax = []
for price in prices:
    withTax.append(round(price * 1.19, 2))
print(withTax)
```
Output **[11.9, 30.35, 9.52, 49.98]**

Or with list comprehension
```py
withTax = [round(price * 1.19, 2) for price in prices]
```

---

The real power comes when we **combine** both: filter first, then transform (or vice versa)

```py
players = [
    {"name": "Tommy", "score": 95, "online": True},
    {"name": "Lance", "score": 42, "online": False},
    {"name": "Cortez", "score": 88, "online": True},
    {"name": "Phil", "score": 71, "online": True},
    {"name": "Sonny", "score": 33, "online": False}
]

onlineNames = []
for player in players:
    if player["online"]:
        onlineNames.append(player["name"])
print(onlineNames)
```
Output **['Tommy', 'Cortez', 'Phil']**

We **filtered** (only online players) and **transformed** (extracted just the name). With list comprehension
```py
onlineNames = [p["name"] for p in players if p["online"]]
```

---

Let's do a more complex example. We have student grades and we want to

1. **Filter** out anyone who failed (below 50)
2. **Transform** the remaining grades by adding a 5-point bonus
3. **Cap** at 100 (nobody can go above 100)

```py
grades = [45, 82, 67, 91, 38, 74, 55, 96]

result = []
for grade in grades:
    if grade >= 50:
        boosted = grade + 5
        if boosted > 100:
            boosted = 100
        result.append(boosted)

print(result)
```
Output **[87, 72, 96, 79, 60, 100]**

With comprehension and **min()** to cap
```py
result = [min(g + 5, 100) for g in grades if g >= 50]
```

---

You have a list of **words**. Do the following

1. **Filter**: keep only words that start with an uppercase letter
2. **Transform**: convert each kept word to lowercase
3. Display the result as a list

Tip: **word[0].isupper()** checks if the first character is uppercase

Expected output
```text
['shrek', 'fiona', 'donkey']
```