```py
import json


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

    def save(self, path):
        with open(path, "w") as f:
            json.dump(self.items, f)


def load_inventory(path):
    bay = Inventory()
    with open(path) as f:
        bay.items = json.load(f)
    return bay


bay = Inventory()
while True:
    line = input()
    if line == "end":
        break
    parts = line.split()
    if parts[0] == "add":
        bay.add(parts[1], int(parts[2]), int(parts[3]))
    else:
        try:
            bay.remove(parts[1], int(parts[2]))
        except InventoryError as e:
            print(f"{line}: {e}")

bay.save("cargo.json")
loaded = load_inventory("cargo.json")

total = 0
heaviest = "none"
heaviest_kg = 0
for name in sorted(loaded.items):
    count = loaded.items[name]["count"]
    kg = loaded.items[name]["kg"]
    if count == 0:
        continue
    weight = count * kg
    total += weight
    print(f"{name}: {count} x {kg} kg = {weight} kg")
    if weight > heaviest_kg:
        heaviest = name
        heaviest_kg = weight
print(f"Total: {total} kg")
print(f"Heaviest: {heaviest}")
```
