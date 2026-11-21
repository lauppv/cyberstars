distances = [800, 750, 1200, 1200, 1500]
best = None
days = 0
for n, m in enumerate(distances, 1):
    line = "Day " + str(n) + ": " + str(m)
    if best is None or m > best:
        best = m
        days = days + 1
        line = line + " new best"
    print(line)
print("Best days: " + str(days))
