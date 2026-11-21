lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]

f = open("temps.txt", "w")
for line in lines:
    f.write(line + "\n")
f.close()

temps = []
f = open("temps.txt")
for line in f:
    line = line.strip()
    if line == "" or line.startswith("#"):
        continue
    time, value = line.split()
    temps.append(int(value))
f.close()

print(f"Readings: {len(temps)}")
if len(temps) > 0:
    print(f"Lowest: {min(temps)}")
    print(f"Highest: {max(temps)}")
    print(f"Average: {sum(temps) / len(temps):.1f}")
