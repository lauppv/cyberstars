```py
lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]

with open("temps.txt", "w") as f:
    for line in lines:
        f.write(line + "\n")

temps = []
with open("temps.txt") as f:
    for line in f:
        line = line.strip()
        if line == "" or line.startswith("#"):
            continue
        time, value = line.split()
        temps.append(int(value))

print(f"Readings: {len(temps)}")
if len(temps) > 0:
    print(f"Lowest: {min(temps)}")
    print(f"Highest: {max(temps)}")
    print(f"Average: {sum(temps) / len(temps):.1f}")
```
