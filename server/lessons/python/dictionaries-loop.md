Now that we know what a dictionary is, it's time to **loop** through one. Just like we looped through lists, we can loop through dictionaries. But since a dictionary has **keys** and **values**, things are a bit different

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for key in player:
    print(key)
```
Output
```text
name
health
city
```
Wait, it only showed the **keys**? Yes. By default, when we loop through a dictionary, Python gives us the **keys**. But we can easily get the **value** too

```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for key in player:
    print(f"{key} -> {player[key]}")
```
Output
```text
name -> Tommy Vercetti
health -> 100
city -> Vice City
```
We used **player[key]** to grab the value for each key. This works, but Python has a nicer way

---

**.items()** gives us both the **key** and **value** at the same time
```py
player = {
    "name": "Tommy Vercetti",
    "health": 100,
    "city": "Vice City"
}

for key, value in player.items():
    print(f"{key} -> {value}")
```
Same output, but cleaner. The **key, value** part is called **unpacking**, Python puts the key in one variable and the value in the other

---

If we only need the **keys**, we can use **.keys()**
```py
player = {"name": "Tommy", "health": 100}

for k in player.keys():
    print(k)
```
Output
```text
name
health
```

If we only need the **values**, we use **.values()**
```py
player = {"name": "Tommy", "health": 100}

for v in player.values():
    print(v)
```
Output
```text
Tommy
100
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
This is called a **frequency dictionary** or **histogram**. We check: is the letter already in the dictionary? If yes, increase the count. If not, start it at **1**. This pattern shows up **everywhere** in programming, so study it carefully :)

---

**len()** works on dictionaries too
```py
player = {"name": "Tommy", "health": 100, "city": "Vice City"}
print(len(player))
```
Output **3** — the dictionary has 3 key-value pairs

---

You have a dictionary of **scores** on the right. Do the following

1. Loop through it and display each name and score like **Tommy: 95**
2. Calculate and display the **total** of all scores
3. Calculate and display the **average** score

Expected output
```text
Tommy: 95
Lance: 80
Cortez: 70
Phil: 90
245
61.25
```