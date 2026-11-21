import json

events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]
with open("events.txt", "w") as f:
    for e in events:
        f.write(e + "\n")
counts = {}
with open("events.txt") as f:
    for line in f:
        counts[line[:2]] = counts.get(line[:2], 0) + 1
with open("summary.json", "w") as f:
    json.dump(counts, f)
with open("summary.json") as f:
    data = json.load(f)
best = None
for h, n in data.items():
    print(f"{h}: {n}")
    if best is None or n >= data[best]:
        best = h
print(f"Busiest: {best}")
with open("summary.json") as f:
    print(f"Bytes: {len(f.read())}")
