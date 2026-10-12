```py
signals = ["A1", "B2", "A1", "C3", "B2", "A1", "D4", "C3"]

print(f"Total: {len(signals)}")

unique = set(signals)
print(f"Unique: {len(unique)}")

if "D4" in unique:
    print("D4 detected")
else:
    print("D4 missing")
```
