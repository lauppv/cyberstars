```py
class Ship:
    pass


names = ["Hope", "Swift", "Bob"]
speeds = [12, 30, 5]

fleet = []
for name, speed in zip(names, speeds):
    ship = Ship()
    ship.name = name
    ship.speed = speed
    fleet.append(ship)

fastest = fleet[0]
for ship in fleet:
    print(f"{ship.name}: {ship.speed}")
    if ship.speed > fastest.speed:
        fastest = ship
print(f"Fastest: {fastest.name}")
```
