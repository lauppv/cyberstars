distances = [800, 750, 1200, 1200, 1500]
best = -1
days = 0
for i, d in enumerate(distances):
    if d > best:
        best = d
        days += 1
        print(f"Day {i}: {d} new best")
    else:
        print(f"Day {i}: {d}")
print(f"Best days: {days}")
