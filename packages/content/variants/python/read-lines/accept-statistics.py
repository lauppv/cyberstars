import statistics

lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]
with open("temps.txt", "w") as f:
    f.write("\n".join(lines) + "\n")
values = []
with open("temps.txt") as f:
    for row in f:
        row = row.rstrip("\n")
        if not row or row[0] == "#":
            continue
        values.append(int(row.split(" ")[1]))
print("Readings:", len(values))
if values:
    print("Lowest:", min(values))
    print("Highest:", max(values))
    print("Average:", format(statistics.mean(values), ".1f"))
