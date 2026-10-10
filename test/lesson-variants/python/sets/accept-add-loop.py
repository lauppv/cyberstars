signals = ["A1", "B2", "A1", "C3", "B2", "A1", "D4", "C3"]
seen = set()
for code in signals:
    seen.add(code)
print("Total:", len(signals))
print("Unique:", len(seen))
print("D4 detected" if "D4" in seen else "D4 missing")
