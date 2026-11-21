readings = [12, 15, 11, 18, 20]
positions = list(range(len(readings) - 1, -1, -2))
for p in positions:
    print(f"{p}: {readings[p]}")
print(f"Checked: {len(positions)}")
