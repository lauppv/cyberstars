Now that we know what a dictionary is, it's time to **loop** through one. Just like we looped through lists, we can loop through dictionaries. But since a dictionary has **keys** and **values**, things are a bit different

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for i in player:
    print(i)
```

Output

```text
name
health
city
```

Wait, it only showed the **keys**? Yes. By default, when we loop through a dictionary, Python gives us the **keys**. But we can easily get the **values** too

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for i in player:
    print(player[i])
```

Output

```text
Tommy Vercetti
100
Vice City
```

We used **player[i]** to grab the value for each key. We took **i** as the iterator, which goes through each key in the dictionary one by one. This works, but Python has a nicer way

---

**.items()** gives us both the **key** and the **value** at the same time

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for key, value in player.items():
    print(f"The key {key} with value {value}")
```

We see how Python views **player.items()**, it knows this means a `key: value` pair, so it automatically assigns **key** to whatever is on the left of the **:** ("name", "health", "city") and **value** to whatever is on the right of the **:** ("Tommy Vercetti", 100, "Vice City")

---

If we only need the **keys**, we can use **.keys()**

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for k in player.keys():
    print(k)
```

Output

```text
name
health
city
```

If we only need the **values**, we use **.values()**

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}
for v in player.values():
    print(v)
```

Output

```text
Tommy Vercetti
100
Vice City
```

---

A very common use case: **counting things**. Let's say we want to count how many times each letter appears in a word

```py
word = "banana"
counter = {}

for letter in word:
    if letter in counter:
        counter[letter] = counter[letter] + 1
    else:
        counter[letter] = 1

print(counter)
```

Output

```text
{'b': 1, 'a': 3, 'n': 2}
```

This is called a **frequency dictionary** or **histogram**. We check: is the letter already in the dictionary? If yes, increase the count. If not, start it at **1**

---

**len()** works on dictionaries too

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}
print(len(player))
```

Output **3** — the dictionary has 3 key-value pairs

---

## Mission: Crew Scores

You have a dictionary of crew members and their scores from the last mission (already on the right). Loop through it and build a report.

Print, in this order:

1. The `name` of each member (loop with **.keys()**)
2. The `score` of each member (loop with **.values()**)
3. `Total: ` then the sum of all scores
4. `Average: ` then the total divided by the number of members (use **len()**)
5. `Top: ` then the **name** of the member with the highest score

**Output**

```text
Tommy
Lance
Cortez
Phil
Ken
Sonny
Diaz
Avery
Umberto
Mercedes
88
95
70
90
65
78
84
72
60
83
Total: 785
Average: 78.5
Top: Lance
```
