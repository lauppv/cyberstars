Printing one of our objects shows something like `<__main__.Planet object at 0x7f3a...>`: its class and where it sits in memory. Not very useful. A method named `__str__` tells Python how the object should look as text

---

`__str__` takes only `self` and returns a string. `print()` calls it by itself

```py
class Planet:
    def __init__(self, name, moons):
        self.name = name
        self.moons = moons

    def __str__(self):
        return f"{self.name} with {self.moons} moons"

mars = Planet("Mars", 2)
print(mars)
```

Output

```text
Mars with 2 moons
```

We don't call `mars.__str__()` ourselves. Python does it whenever the object has to become text

---

`str()` and f-strings use `__str__` too, so the object fits right into any text

```py
class Planet:
    def __init__(self, name, moons):
        self.name = name
        self.moons = moons

    def __str__(self):
        return f"{self.name} with {self.moons} moons"

earth = Planet("Earth", 1)
text = str(earth)
print(text.upper())
print(f"Home: {earth}")
```

Output

```text
EARTH WITH 1 MOONS
Home: Earth with 1 moons
```

---

`__str__` can choose its words, like any method. Here a planet without moons says so

```py
class Planet:
    def __init__(self, name, moons):
        self.name = name
        self.moons = moons

    def __str__(self):
        if self.moons == 0:
            return f"{self.name}, no moons"
        return f"{self.name}, moons: {self.moons}"

for planet in [Planet("Venus", 0), Planet("Mars", 2)]:
    print(planet)
```

Output

```text
Venus, no moons
Mars, moons: 2
```

---

A list of objects is printed with a different method, `__repr__`, meant for programmers. Without one, a printed list shows the memory addresses again. The easy way is to print the items one by one, or join their texts

```py
class Planet:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

planets = [Planet("Venus"), Planet("Mars")]
print(" | ".join(str(p) for p in planets))
```

Output

```text
Venus | Mars
```

---

## Mission: Planet Cards

The station's school shows a card for each planet. Each card is one line of text, made by the planet object itself

1. Write a class **Planet** with an `__init__` that takes a `name`, a number of `moons` and `rings` (True or False), and a `__str__` that returns `name, moons: N`, with `, rings` added at the end when the planet has rings. A planet with 0 moons says `name, no moons` instead of `moons: 0`
2. Start your program with three variables: **names**, **moons** and **rings**, three lists in the same order. For example `names = ["Saturn", "Mars", "Venus"]`, `moons = [146, 2, 0]` and `rings = [True, False, False]`
3. Make a `Planet` for each, and print each one with `print()`, giving it the object itself
4. Print `With rings: ` and the cards of the planets with rings joined with `/` with a space on each side, or `none`

The lists have from 1 to 10 planets, with 0 to 200 moons each

**Example** for the values above

```text
Saturn, moons: 146, rings
Mars, moons: 2
Venus, no moons
With rings: Saturn, moons: 146, rings
```
