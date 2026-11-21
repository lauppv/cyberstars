Many classes are mostly data: a few attributes, an `__init__` that copies them, an `__eq__` that compares them. Writing those again and again is boring. The module `dataclasses` writes them for us, from a short list of fields

---

`@dataclass` goes on the line above the class. It's a **decorator**: something that changes the class right after it's made. Inside, we list the fields with their types

```py
from dataclasses import dataclass

@dataclass
class Crate:
    label: str
    weight: int

food = Crate("food", 40)
print(food.label, food.weight)
print(food)
print(food == Crate("food", 40))
```

Output

```text
food 40
Crate(label='food', weight=40)
True
```

We wrote no `__init__`, no `__eq__` and no way to print it, yet all three work. The dataclass made them from the fields, in the order we listed them

---

The types after the colon, like `str` and `int`, are notes for people and tools. Python doesn't check them: `Crate("food", "heavy")` would still work. A field can have a default value, which must come after the fields without one

```py
from dataclasses import dataclass

@dataclass
class Crate:
    label: str
    weight: int = 10
    fragile: bool = False

print(Crate("tools"))
print(Crate("glass", fragile=True))
```

Output

```text
Crate(label='tools', weight=10, fragile=False)
Crate(label='glass', weight=10, fragile=True)
```

---

`@dataclass(order=True)` also makes `<`, `>` and the others. Objects compare field by field, in the order of the fields, like tuples do. So the first field decides first

```py
from dataclasses import dataclass

@dataclass(order=True)
class Crate:
    weight: int
    label: str

crates = [Crate(40, "food"), Crate(5, "seeds"), Crate(40, "books")]
for crate in sorted(crates):
    print(crate)
```

Output

```text
Crate(weight=5, label='seeds')
Crate(weight=40, label='books')
Crate(weight=40, label='food')
```

That's why `weight` comes first here: we want to sort by weight, then by label

---

A dataclass is still a normal class. We can add our own methods to it

```py
from dataclasses import dataclass

@dataclass
class Crate:
    label: str
    weight: int

    def heavy(self):
        return self.weight > 30

print(Crate("food", 40).heavy())
```

Output

```text
True
```

---

## Mission: Cargo Crates

A cargo ship brings crates to the station. Each crate has a weight and a label, and the crew loads them from the lightest to the heaviest

1. Write a dataclass **Crate** with `order=True` and two fields: `weight` (a whole number) and `label` (a string), in this order
2. Start your program with two variables: **weights** and **labels**, two lists in the same order. For example `weights = [40, 5, 40]` and `labels = ["food", "seeds", "books"]`
3. Make a `Crate` for each, and print them sorted, one on each line, the way the dataclass prints them
4. Print `Heaviest: ` and the label of the heaviest crate, the one sorted last
5. Print `Same as first: ` and how many of the crates are equal to the first crate of the list, the first one included

The lists have from 1 to 10 crates. Weights are from 1 to 100 and labels are small letters

**Example** for the values above

```text
Crate(weight=5, label='seeds')
Crate(weight=40, label='books')
Crate(weight=40, label='food')
Heaviest: food
Same as first: 1
```
