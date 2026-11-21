distances = [800, 750, 1200, 1200, 1500]
best = -1
days = 0
for i in range(len(distances)):
    if distances[i] > best:
        best = distances[i]
        days += 1
        print(f"Day {i + 1}: {distances[i]} new best")
    else:
        print(f"Day {i + 1}: {distances[i]}")
print(f"Best days: {days}")
