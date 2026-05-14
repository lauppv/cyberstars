We already know **lists**. A list can grow, shrink, and change — we can **append**, **remove**, and **modify** elements whenever we want. But sometimes we want a collection that **cannot change**. This is a **tuple**

```py
coordinates = (10, 20)
print(coordinates)
```
Output **(10, 20)**

A tuple looks like a list, but with **parentheses ()** instead of **square brackets []**. The big difference? We **cannot modify** it after creation

```py
coordinates = (10, 20)
coordinates[0] = 99
```
**Run** it. Python will scream at us with a **TypeError**: 'tuple' object does not support item assignment. In other words: "you can't change me" :)

---

Why would we ever want something we can't change? Well, sometimes that's the whole point. Think about a date of birth. **Tommy Vercetti was born on a specific day**. That date should never change. If we accidentally write code that tries to modify it, we **want** Python to stop us

```py
birthday = (1951, 7, 15)
print(birthday)
```

Another example: GPS coordinates. **Vice City is at a fixed location**. It doesn't move
```py
viceCity = (25.7617, -80.1918)
print(viceCity)
```

---

We **can** read elements from a tuple, just like a list, using an **index**
```py
player = ("Tommy Vercetti", 100, "Vice City")
print(player[0])
print(player[1])
print(player[2])
```
Output
```text
Tommy Vercetti
100
Vice City
```

**len()** works too
```py
player = ("Tommy Vercetti", 100, "Vice City")
print(len(player))
```
Output **3**

---

One of the coolest things about tuples is **unpacking**. Instead of using indexes, we can grab all values at once

```py
player = ("Tommy Vercetti", 100, "Vice City")

name, health, city = player
print(name)
print(health)
print(city)
```
Output
```text
Tommy Vercetti
100
Vice City
```
We created **three variables** in one line. Python took the first element and put it in **name**, the second in **health**, the third in **city**. The number of variables on the left **must match** the number of elements in the tuple

```py
a, b = (10, 20)
print(a)
print(b)
```
Output
```text
10
20
```
This is the same **unpacking** we saw in **.items()** when looping through dictionaries. Now you know where it comes from :)

---

We can also **loop** through a tuple, just like a list
```py
heroes = ("Shrek", "Fiona", "Donkey")
for hero in heroes:
    print(hero)
```
Output
```text
Shrek
Fiona
Donkey
```

---

You have a tuple **mission** on the right with 3 values: a mission name, a difficulty, and a reward

1. **Unpack** the tuple into three variables: **name**, **difficulty**, **reward**
2. Display each on a separate line

Expected output
```text
Demolition Man
Hard
5000
```