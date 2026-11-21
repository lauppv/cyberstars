names = ["Kai", "Mila", "Tom"]
before = [60, 75, 80]
after = [72, 70, 95]
best = -101
who = ""
for name, b, a in zip(names, before, after):
    d = a - b
    sign = "+" if d > 0 else ""
    print(f"{name}: {b} -> {a} ({sign}{d})")
    if d > best:
        best = d
        who = name
print(f"Most improved: {who}")
