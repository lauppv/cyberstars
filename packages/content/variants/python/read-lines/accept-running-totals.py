lines = ["# morning", "08:00 21", "", "09:00 25", "10:00 19"]
with open("temps.txt", "w") as f:
    for l in lines:
        print(l, file=f)
count = total = 0
low = high = None
with open("temps.txt") as f:
    for l in f:
        parts = l.split()
        if len(parts) != 2 or parts[0].startswith("#"):
            continue
        t = int(parts[1])
        count += 1
        total += t
        low = t if low is None or t < low else low
        high = t if high is None or t > high else high
print(f"Readings: {count}")
if count:
    print(f"Lowest: {low}")
    print(f"Highest: {high}")
    print(f"Average: {total / count:.1f}")
