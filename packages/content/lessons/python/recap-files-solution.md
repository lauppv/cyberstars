```py
import json

events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]

with open("events.txt", "w") as f:
    for event in events:
        f.write(event + "\n")

counts = {}
with open("events.txt") as f:
    for line in f:
        hour = line[:2]
        counts[hour] = counts.get(hour, 0) + 1

with open("summary.json", "w") as f:
    json.dump(counts, f)
with open("summary.json") as f:
    summary = json.load(f)

busiest = ""
for hour, count in summary.items():
    print(f"{hour}: {count}")
    if busiest == "" or count > summary[busiest]:
        busiest = hour
print(f"Busiest: {busiest}")

with open("summary.json") as f:
    print(f"Bytes: {len(f.read())}")
```
