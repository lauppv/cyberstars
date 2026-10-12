```py
readings = [45, 82, 67, 91, 38, 74, 55, 96, 12, 60]

boosted = []
for reading in readings:
    if reading >= 50:
        boosted.append(min(reading + 5, 100))

print(f"Boosted: {boosted}")
print(f"Stable reactors: {len(boosted)}")
print(f"Average: {round(sum(boosted) / len(boosted))}")
```
