names = ["Hope", "Swift", "Bob"]
speeds = [12, 30, 5]
fleet = [{"name": n, "speed": s} for n, s in zip(names, speeds)]
for s in fleet:
    print(f"{s['name']}: {s['speed']}")
print(f"Fastest: {max(fleet, key=lambda s: s['speed'])['name']}")
