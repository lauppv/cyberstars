```py
distances = [800, 750, 1200, 1200, 1500]

best = 0
best_days = 0
for day, meters in enumerate(distances, start=1):
    if day == 1 or meters > best:
        best = meters
        best_days += 1
        print(f"Day {day}: {meters} new best")
    else:
        print(f"Day {day}: {meters}")
print(f"Best days: {best_days}")
```
