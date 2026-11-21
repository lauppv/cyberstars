In this project we build the cargo bay's inventory: a class that knows what is in the bay, refuses to give out what isn't there, and saves itself to a JSON file so nothing is lost when the program ends. It brings together classes, your own exceptions, sorting, files and JSON

---

The inventory keeps a dictionary: for each item, how many there are and how much one weighs. Adding an item that's already there adds to its count

```py
class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, count, kg):
        if name in self.items:
            self.items[name]["count"] += count
        else:
            self.items[name] = {"count": count, "kg": kg}

bay = Inventory()
bay.add("rice", 10, 2)
bay.add("rice", 5, 2)
bay.add("tools", 1, 30)
print(bay.items)
```

Output

```text
{'rice': {'count': 15, 'kg': 2}, 'tools': {'count': 1, 'kg': 30}}
```

---

Taking items out can fail in two ways: the item isn't there, or there aren't enough of it. One error class covers both, with a message that says which

```py
class InventoryError(Exception):
    pass

class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, count, kg):
        if name in self.items:
            self.items[name]["count"] += count
        else:
            self.items[name] = {"count": count, "kg": kg}

    def remove(self, name, count):
        if name not in self.items:
            raise InventoryError("no such item")
        left = self.items[name]["count"]
        if count > left:
            raise InventoryError(f"only {left} left")
        self.items[name]["count"] -= count

bay = Inventory()
bay.add("rice", 10, 2)
for name, count in [("rice", 4), ("rice", 9), ("tea", 1)]:
    try:
        bay.remove(name, count)
        print(name, count, "ok")
    except InventoryError as e:
        print(name, count, e)
```

Output

```text
rice 4 ok
rice 9 only 6 left
tea 1 no such item
```

---

The dictionary is plain data, so `json` can save it as it is, and load it back later. A function builds a new inventory from the file

```py
import json

class Inventory:
    def __init__(self):
        self.items = {}

    def save(self, path):
        with open(path, "w") as f:
            json.dump(self.items, f)

def load_inventory(path):
    bay = Inventory()
    with open(path) as f:
        bay.items = json.load(f)
    return bay

old = Inventory()
old.items = {"rice": {"count": 6, "kg": 2}}
old.save("cargo.json")
new = load_inventory("cargo.json")
print(new.items["rice"]["count"])
```

Output

```text
6
```

---

The report goes through the items in the order of their names, and works out each line's weight and the total

```py
items = {"tools": {"count": 1, "kg": 30}, "rice": {"count": 6, "kg": 2}}
total = 0
for name in sorted(items):
    count = items[name]["count"]
    kg = items[name]["kg"]
    total += count * kg
    print(f"{name}: {count} x {kg} kg = {count * kg} kg")
print(f"Total: {total} kg")
```

Output

```text
rice: 6 x 2 kg = 12 kg
tools: 1 x 30 kg = 30 kg
Total: 42 kg
```

---

## Mission: Cargo Bay

Write the inventory, run a day of the cargo bay from the keyboard, then save it, load it back, and report from what was loaded

1. Write a class **InventoryError** that inherits from `Exception`, and a class **Inventory** with the methods **add(name, count, kg)**, **remove(name, count)** and **save(path)** as above, and a function **load_inventory(path)** that returns a new `Inventory` read from the file
2. Read commands until a line that says `end`. A command is `add`, a name, a count and the kilograms of one item, like `add rice 10 2`, or `remove`, a name and a count, like `remove rice 4`. An item added again keeps its first weight
3. For a `remove` that fails, print the command, `: ` and the error's message. Print nothing for the commands that work
4. After `end`, save the inventory to `cargo.json`, load it back with `load_inventory()`, and from the loaded one print a report line for each item with a count above 0, in the order of their names, then `Total: ` and the total weight and ` kg`, then `Heaviest: ` and the item whose line weighs the most, the first in name order if several weigh as much, or `none` if the bay is empty

Names are one word in small letters. Counts are from 1 to 100 and weights from 1 to 50. There are from 0 to 20 commands

**Input**

```text
add rice 10 2
add tools 1 30
remove rice 4
remove rice 9
remove tea 1
add rice 5 9
end
```

**Output**

```text
remove rice 9: only 6 left
remove tea 1: no such item
rice: 11 x 2 kg = 22 kg
tools: 1 x 30 kg = 30 kg
Total: 52 kg
Heaviest: tools
```
