import json
from collections import Counter

events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]
with open("events.txt", "w") as f:
    f.write("\n".join(events) + "\n")
with open("events.txt") as f:
    counts = Counter(line.split(":")[0] for line in f)
with open("summary.json", "w") as f:
    json.dump(dict(counts), f)
with open("summary.json") as f:
    data = json.load(f)
for h in data:
    print(h + ": " + str(data[h]))
print("Busiest: " + max(data, key=data.get))
with open("summary.json") as f:
    print("Bytes: " + str(len(f.read())))
