Two numbers can be compared with `==` and `<`. Two of our own objects can't, not in a useful way: Python doesn't know what makes two ships equal, or one smaller than the other. The methods `__eq__` and `__lt__` tell it

---

Without `__eq__`, `==` only checks if two names point to the very same object. Two objects with the same data are still "different"

```py
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

a = Point(1, 2)
b = Point(1, 2)
print(a == b)
print(a == a)
```

Output

```text
False
True
```

---

`__eq__(self, other)` decides what "equal" means. It gets the other object and returns True or False

```py
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

print(Point(1, 2) == Point(1, 2))
print(Point(1, 2) != Point(3, 2))
print(Point(1, 2) in [Point(0, 0), Point(1, 2)])
```

Output

```text
True
True
True
```

`!=` and `in` use `__eq__` too, for free

---

`__lt__(self, other)` means "less than", the `<` sign. Once a class has it, `sorted()`, `min()` and `max()` work on its objects, since they compare with `<`

```py
class Ship:
    def __init__(self, name, speed):
        self.name = name
        self.speed = speed

    def __lt__(self, other):
        return self.speed < other.speed

fleet = [Ship("Hope", 12), Ship("Swift", 30), Ship("Bob", 5)]
print([s.name for s in sorted(fleet)])
print(max(fleet).name)
print(Ship("A", 1) < Ship("B", 2))
```

Output

```text
['Bob', 'Hope', 'Swift']
Swift
True
```

---

A handy trick inside these methods: compare tuples. Tuples compare their first values, and only on a tie their second, and so on

```py
print((2, 5) < (2, 9))
print((3, 0) < (2, 9))
```

Output

```text
True
False
```

So `return (self.speed, self.name) < (other.speed, other.name)` sorts by speed, and by name when speeds are equal

---

## Mission: Version Numbers

The station's computer gets software updates with version numbers like `1.10.2`. As text, `"1.10.2"` comes before `"1.9.0"`, which is wrong: 10 is bigger than 9. The station needs versions that compare as numbers

1. Write a class **Version** with an `__init__` that takes a `text` like `"1.10.2"` and keeps it, together with its parts as whole numbers, a `__str__` that returns the text, an `__eq__` that says two versions are equal when their numbers are, and an `__lt__` that compares the first numbers, then the second ones on a tie, then the third
2. Start your program with two variables: **versions**, a list of strings, and **current**, a string. For example `versions = ["1.10.2", "1.9.0", "2.0.0", "1.9.0"]` and `current = "1.10.2"`
3. Print the versions from the oldest to the newest, using `sorted()` on `Version` objects, joined with `<` with a space on each side
4. Print `Newest: ` and the newest version
5. Print `Up to date: ` and `yes` if the current version equals the newest one, or `no`

Every version has three numbers from 0 to 99, joined with dots. **versions** has from 1 to 10 versions

**Example** for the values above

```text
1.9.0 < 1.9.0 < 1.10.2 < 2.0.0
Newest: 2.0.0
Up to date: no
```
