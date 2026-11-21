class Ship:
    pass


names = ["Hope", "Swift", "Bob"]
speeds = [12, 30, 5]
fleet = []
for n, sp in zip(names, speeds):
    s = Ship()
    s.name, s.speed = n, sp
    fleet.append(s)
top = fleet[0]
for s in fleet:
    print(f"{s.name}: {s.speed}")
    if s.speed >= top.speed:
        top = s
print(f"Fastest: {top.name}")
