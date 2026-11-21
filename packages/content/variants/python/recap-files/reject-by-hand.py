events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]

with open("events.txt", "w") as f:
    for event in events:
        f.write(event + "\n")

counts = {}
with open("events.txt") as f:
    for line in f:
        hour = line[:2]
        counts[hour] = counts.get(hour, 0) + 1

text = "{" + ", ".join([f'"{hour}": {count}' for hour, count in counts.items()]) + "}"
with open("summary.json", "w") as f:
    f.write(text)

busiest = ""
for hour, count in counts.items():
    print(f"{hour}: {count}")
    if busiest == "" or count > counts[busiest]:
        busiest = hour
print(f"Busiest: {busiest}")

with open("summary.json") as f:
    print(f"Bytes: {len(f.read())}")
