names = ["Kai", "Mila", "Tom"]
before = [60, 75, 80]
after = [72, 70, 95]
best = -101
who = ""
for name, b, a in zip(names, before, after):
    d = a - b
    print(f"{name}: {b} -> {a} ({d:+})")
    if d >= best:
        best = d
        who = name
print(f"Most improved: {who}")
