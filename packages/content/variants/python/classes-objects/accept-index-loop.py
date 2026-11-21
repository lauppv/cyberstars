class Ship:
    pass


names = ["Hope", "Swift", "Bob"]
speeds = [12, 30, 5]
ships = []
for i in range(len(names)):
    s = Ship()
    s.name = names[i]
    s.speed = speeds[i]
    ships.append(s)
top = None
for s in ships:
    print(f"{s.name}: {s.speed}")
    if top is None or s.speed > top.speed:
        top = s
print(f"Fastest: {top.name}")
