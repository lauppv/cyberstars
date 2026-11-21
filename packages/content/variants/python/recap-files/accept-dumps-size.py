import json

events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]
with open("events.txt", "w") as f:
    for e in events:
        print(e, file=f)
hours = {}
with open("events.txt") as f:
    for line in f:
        h = line.strip()[0:2]
        if h in hours:
            hours[h] += 1
        else:
            hours[h] = 1
with open("summary.json", "w") as f:
    json.dump(hours, f)
with open("summary.json") as f:
    back = json.load(f)
top = None
for h, n in back.items():
    print(f"{h}: {n}")
    if top is None or n > back[top]:
        top = h
print(f"Busiest: {top}")
print(f"Bytes: {len(json.dumps(back))}")
