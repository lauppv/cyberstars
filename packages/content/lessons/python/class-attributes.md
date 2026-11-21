The attributes we set with `self.name = ...` belong to one object. Sometimes a value belongs to the whole class instead: a counter of how many objects were made, or a setting all of them share. That's a **class attribute**

---

A class attribute is set in the class itself, outside the methods. Every object can read it, and so can the class

```py
class Ship:
    wheels = 0
    max_speed = 100

    def __init__(self, name):
        self.name = name

hope = Ship("Hope")
print(hope.max_speed)
print(Ship.max_speed)
```

Output

```text
100
100
```

`hope` has no `max_speed` of its own, so Python looks in its class and finds it there

---

To change a class attribute for everyone, change it through the class. Here each new object counts itself

```py
class Ship:
    made = 0

    def __init__(self, name):
        self.name = name
        Ship.made += 1

Ship("Hope")
Ship("Swift")
print(Ship.made)
```

Output

```text
2
```

`Ship.made += 1` changes the one value the class keeps, so every new ship adds to the same count

---

Watch out: setting it through `self` makes a new attribute on that one object, which hides the class's value only for that object

```py
class Ship:
    max_speed = 100

hope = Ship()
swift = Ship()
hope.max_speed = 50
print(hope.max_speed, swift.max_speed, Ship.max_speed)
```

Output

```text
50 100 100
```

So read class attributes through `self` or the class as you like, but change them through the class

---

A second trap: a list as a class attribute is one list for all the objects. Adding to it from one object adds for all

```py
class Ship:
    cargo = []

hope = Ship()
swift = Ship()
hope.cargo.append("water")
print(swift.cargo)
```

Output

```text
['water']
```

When each object needs a list of its own, make it in `__init__` with `self.cargo = []`

---

## Mission: Ship Numbers

Every ship that joins the fleet gets the next free number, and all ships fly under the same fleet name

1. Write a class **Ship** with two class attributes: `next_number`, which starts at 1, and `fleet`, which starts as `"Free Fleet"`. Its `__init__` takes a `name`, sets the attributes `name` and `number`, giving the ship the class's next number, and moves the class's next number up by 1
2. Start your program with two variables: **names**, a list of strings, and **fleet**, a string. For example `names = ["Hope", "Swift"]` and `fleet = "Star Fleet"`
3. Make a `Ship` for each name. Then set the class's fleet name to **fleet**, and print one line for each ship: `#`, its number, a space, its name, `of` with a space on each side, and the fleet name, read through the ship
4. Print `Next free number: ` and the class's next number

**names** has from 1 to 10 names

**Example** for the values above

```text
#1 Hope of Star Fleet
#2 Swift of Star Fleet
Next free number: 3
```
