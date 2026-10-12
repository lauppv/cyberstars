log = "alpha beta alpha gamma beta alpha"
codes = log.split(" ")
counts = {}
for code in codes:
    counts[code] = counts.get(code, 0) + 1
print(f"Codes: {len(codes)}")
for code, count in counts.items():
    print(f"{code}: {count}")
print(f"Most common: {max(counts, key=counts.get)}")
