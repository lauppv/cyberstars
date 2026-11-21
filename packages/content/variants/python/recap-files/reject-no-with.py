import json

events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]

f = open("events.txt", "w")
for event in events:
    f.write(event + "\n")
f.close()

counts = {}
f = open("events.txt")
for line in f:
    hour = line[:2]
    counts[hour] = counts.get(hour, 0) + 1
f.close()

f = open("summary.json", "w")
json.dump(counts, f)
f.close()
f = open("summary.json")
summary = json.load(f)
f.close()

busiest = ""
for hour, count in summary.items():
    print(f"{hour}: {count}")
    if busiest == "" or count > summary[busiest]:
        busiest = hour
print(f"Busiest: {busiest}")

f = open("summary.json")
print(f"Bytes: {len(f.read())}")
f.close()
