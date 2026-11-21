Setting every attribute by hand after making an object is long, and easy to forget. A class can do it by itself, with a special function called `__init__`. Python runs it every time a new object is made

---

`__init__` goes inside the class, indented. Its first parameter is `self`: the new object being made. The other parameters are the values we give when we make the object

```py
class Ship:
    def __init__(self, name, speed):
        self.name = name
        self.speed = speed

hope = Ship("Hope", 12)
swift = Ship("Swift", 30)
print(hope.name, hope.speed)
print(swift.name, swift.speed)
```

Output

```text
Hope 12
Swift 30
```

`Ship("Hope", 12)` makes an empty object, then calls `__init__` with that object as `self`, `"Hope"` as `name` and `12` as `speed`. `self.name = name` puts the value on the object. The names have two underscores on each side; Python uses such names for its special functions

---

We never pass `self` ourselves: Python does it. Give the other values, in order or by name, as for any function. Forgetting one is an error

```py
class Ship:
    def __init__(self, name, speed):
        self.name = name
        self.speed = speed

bob = Ship(speed=5, name="Bob")
print(bob.name)
try:
    Ship("Lost")
except TypeError:
    print("a ship needs a name and a speed")
```

Output

```text
Bob
a ship needs a name and a speed
```

---

`__init__` can do more than copy values. It can give defaults, work out new attributes, or start a list empty

```py
class Ship:
    def __init__(self, name, speed=10):
        self.name = name.upper()
        self.speed = speed
        self.fast = speed > 20
        self.cargo = []

hope = Ship("hope")
hope.cargo.append("water")
print(hope.name, hope.speed, hope.fast, hope.cargo)
```

Output

```text
HOPE 10 False ['water']
```

Every object now has the same attributes from the start, so none can be missing

---

## Mission: Crew Badges

Every new crew member gets a badge. The badge has the person's name, their role, and a code made from them

1. Write a class **Member** with an `__init__` that takes a `name` and a `role`, and sets three attributes: `name`, `role` and `code`. The code is the first 3 letters of the name in capitals, a `-`, and the length of the role, like `ADA-5` for Ada the pilot
2. Start your program with two variables: **names** and **roles**, two lists of strings in the same order. For example `names = ["Ada", "Alan", "Grace"]` and `roles = ["pilot", "medic", "engineer"]`
3. Make a `Member` for each name and role, and print one line for each: the code, ` `, the name and ` (` the role `)`

The lists have from 1 to 10 people. Every name has at least 3 letters

**Example** for the values above

```text
ADA-5 Ada (pilot)
ALA-5 Alan (medic)
GRA-8 Grace (engineer)
```
