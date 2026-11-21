Often the child class needs its own `__init__`, because it has more data than the parent. But the parent's `__init__` already knows how to set up the common part. `super()` lets the child call it, instead of copying its lines

---

If the child writes its own `__init__`, the parent's is no longer called by itself. The common attributes would then be missing

```py
class Person:
    def __init__(self, name):
        self.name = name

class Pilot(Person):
    def __init__(self, name, hours):
        self.hours = hours

ada = Pilot("Ada", 300)
print(hasattr(ada, "name"), ada.hours)
```

Output

```text
False 300
```

The pilot has hours but no name. The child's `__init__` replaced the parent's, and nobody set `self.name`

---

`super()` gives the parent's version of a method. `super().__init__(name)` runs the parent's setup on this same object, then the child adds its own part

```py
class Person:
    def __init__(self, name):
        self.name = name

class Pilot(Person):
    def __init__(self, name, hours):
        super().__init__(name)
        self.hours = hours

ada = Pilot("Ada", 300)
print(ada.name, ada.hours)
```

Output

```text
Ada 300
```

Call `super().__init__()` first, so the common attributes exist before the child's code uses them. We don't pass `self`: `super()` already knows the object

---

If the parent's setup changes later, every child gets the change for free. Here the parent starts to clean up the name, and the pilot doesn't need a single new line

```py
class Person:
    def __init__(self, name):
        self.name = name.strip().title()

class Pilot(Person):
    def __init__(self, name, hours):
        super().__init__(name)
        self.hours = hours

print(Pilot("  ada LOVELACE ", 10).name)
```

Output

```text
Ada Lovelace
```

`.title()` makes the first letter of each word a capital and the rest small

---

`super()` works for any method, not only `__init__`. The next lesson uses it to build on a parent's method instead of replacing it

---

## Mission: Pilot Records

Every person on the station has a name and an age. Pilots also have their flight hours, and the ones with at least 500 hours may fly long trips

1. Write a class **Person** with an `__init__` that takes a `name` and an `age`, and a method **info()** that returns `name, age`
2. Write a class **Pilot** that inherits from `Person`. Its `__init__` takes a `name`, an `age` and `hours`, uses `super()` to set the name and the age, and sets `hours` itself. Add a method **long_trips()** that returns True if the pilot has at least 500 hours
3. Start your program with three variables: **names**, **ages** and **hours**, three lists in the same order. For example `names = ["Ada", "Ben"]`, `ages = [36, 29]` and `hours = [800, 120]`
4. Make a `Pilot` for each, and print a line for each: the info, `| hours:` with a space on each side, the hours, `| long trips:` with a space on each side, and `yes` or `no`
5. Print `Most hours: ` and the info of the pilot with the most hours, the first one if several have as many

The lists have from 1 to 10 pilots, ages from 20 to 70 and hours from 0 to 5,000

**Example** for the values above

```text
Ada, 36 | hours: 800 | long trips: yes
Ben, 29 | hours: 120 | long trips: no
Most hours: Ada, 36
```
