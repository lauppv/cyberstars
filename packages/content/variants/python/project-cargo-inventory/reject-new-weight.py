import json


class InventoryError(Exception):
    pass


class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, count, kg):
        old = self.items.get(name, {"count": 0})["count"]
        self.items[name] = {"count": old + count, "kg": kg}

    def remove(self, name, count):
        if name not in self.items:
            raise InventoryError("no such item")
        if count > self.items[name]["count"]:
            raise InventoryError(f"only {self.items[name]['count']} left")
        self.items[name]["count"] -= count

    def save(self, path):
        with open(path, "w") as f:
            json.dump(self.items, f)


def load_inventory(path):
    inv = Inventory()
    with open(path) as f:
        inv.items = json.load(f)
    return inv


bay = Inventory()
while (line := input()) != "end":
    p = line.split()
    try:
        bay.add(p[1], int(p[2]), int(p[3])) if p[0] == "add" else bay.remove(p[1], int(p[2]))
    except InventoryError as e:
        print(f"{line}: {e}")
bay.save("cargo.json")
back = load_inventory("cargo.json")
total, best, best_w = 0, "none", 0
for n in sorted(back.items):
    c, k = back.items[n]["count"], back.items[n]["kg"]
    if c:
        total += c * k
        print(f"{n}: {c} x {k} kg = {c * k} kg")
        if c * k > best_w:
            best, best_w = n, c * k
print(f"Total: {total} kg")
print(f"Heaviest: {best}")
