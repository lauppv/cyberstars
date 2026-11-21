import json


class InventoryError(Exception):
    pass


class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, count, kg):
        item = self.items.setdefault(name, {"count": 0, "kg": kg})
        item["count"] = item["count"] + count

    def remove(self, name, count):
        item = self.items.get(name)
        if item is None:
            raise InventoryError("no such item")
        if item["count"] < count:
            raise InventoryError("only " + str(item["count"]) + " left")
        item["count"] = item["count"] - count

    def save(self, path):
        with open(path, "w") as out:
            json.dump(self.items, out)


def load_inventory(path):
    inv = Inventory()
    with open(path) as f:
        inv.items = json.load(f)
    return inv


bay = Inventory()
line = input()
while line != "end":
    p = line.split()
    try:
        if p[0] == "add":
            bay.add(p[1], int(p[2]), int(p[3]))
        else:
            bay.remove(p[1], int(p[2]))
    except InventoryError as err:
        print(line + ": " + str(err))
    line = input()
bay.save("cargo.json")
back = load_inventory("cargo.json")
rows = [(n, v["count"], v["kg"]) for n, v in sorted(back.items.items()) if v["count"] > 0]
for n, c, k in rows:
    print(f"{n}: {c} x {k} kg = {c * k} kg")
print("Total:", sum(c * k for _, c, k in rows), "kg")
print("Heaviest:", max(rows, key=lambda r: r[1] * r[2])[0] if rows else "none")
