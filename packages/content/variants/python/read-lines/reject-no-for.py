lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]

with open("temps.txt", "w") as f:
    f.write("".join([line + "\n" for line in lines]))

with open("temps.txt") as f:
    kept = [line.strip() for line in f]
temps = [int(line.split()[1]) for line in kept if line != "" and not line.startswith("#")]

print(f"Readings: {len(temps)}")
if len(temps) > 0:
    print(f"Lowest: {min(temps)}")
    print(f"Highest: {max(temps)}")
    print(f"Average: {sum(temps) / len(temps):.1f}")
