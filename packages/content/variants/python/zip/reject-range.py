names = ["Kai", "Mila", "Tom"]
before = [60, 75, 80]
after = [72, 70, 95]
best = -101
who = ""
for i in range(len(names)):
    d = after[i] - before[i]
    print(f"{names[i]}: {before[i]} -> {after[i]} ({d:+})")
    if d > best:
        best = d
        who = names[i]
print(f"Most improved: {who}")
