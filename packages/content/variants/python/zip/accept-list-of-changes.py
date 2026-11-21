names = ["Kai", "Mila", "Tom"]
before = [60, 75, 80]
after = [72, 70, 95]
changes = []
for b, a in zip(before, after):
    changes.append(a - b)
for name, b, a, c in zip(names, before, after, changes):
    sign = "+" if c >= 0 else ""
    print(name + ": " + str(b) + " -> " + str(a) + " (" + sign + str(c) + ")")
top = max(changes)
for name, c in zip(names, changes):
    if c == top:
        print("Most improved:", name)
        break
