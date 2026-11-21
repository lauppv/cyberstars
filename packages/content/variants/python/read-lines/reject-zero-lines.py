lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]
with open("temps.txt", "w") as f:
    for l in lines:
        f.write(l + "\n")
temps = []
with open("temps.txt") as f:
    for l in f:
        l = l.strip()
        if l == "" or l.startswith("#"):
            continue
        temps.append(int(l.split()[1]))
print(f"Readings: {len(temps)}")
print(f"Lowest: {min(temps, default=0)}")
print(f"Highest: {max(temps, default=0)}")
print(f"Average: {sum(temps) / max(len(temps), 1):.1f}")
