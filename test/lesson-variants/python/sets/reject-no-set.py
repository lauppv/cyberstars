signals = ["A1", "B2", "A1", "C3", "B2", "A1", "D4", "C3"]
unique = []
for s in signals:
    if s not in unique:
        unique.append(s)
print(f"Total: {len(signals)}")
print(f"Unique: {len(unique)}")
print("D4 detected" if "D4" in unique else "D4 missing")
