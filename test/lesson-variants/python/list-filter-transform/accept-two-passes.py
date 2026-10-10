readings = [45, 82, 67, 91, 38, 74, 55, 96, 12, 60]

stable = []
for value in readings:
    if not value < 50:
        stable.append(value)
boosted = []
total = 0
for value in stable:
    b = min(value + 5, 100)
    boosted.append(b)
    total += b
print(f"Boosted: {boosted}")
print(f"Stable reactors: {len(stable)}")
print(f"Average: {round(total / len(boosted))}")
