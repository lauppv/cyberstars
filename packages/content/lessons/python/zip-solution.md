```py
names = ["Kai", "Mila", "Tom"]
before = [60, 75, 80]
after = [72, 70, 95]

best_name = ""
best_change = -101
for name, first, last in zip(names, before, after):
    change = last - first
    print(f"{name}: {first} -> {last} ({change:+})")
    if change > best_change:
        best_change = change
        best_name = name
print(f"Most improved: {best_name}")
```
