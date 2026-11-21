class Ship:
    def __init__(self, speed, name):
        self.speed = speed
        self.name = name

    def describe(self):
        return f"{self.name} ({self.speed})"


class CargoShip(Ship):
    def __init__(self, speed, name, tons):
        super().__init__(speed, name)
        self.tons = tons

    def describe(self):
        return f"{super().describe()}, tons {self.tons}"


ships = ["Hope 12", "Mule 8 300", "Swift 30", "Ox 8 500"]

fleet = []
for line in ships:
    parts = line.split()
    if len(parts) == 3:
        fleet.append(CargoShip(int(parts[1]), parts[0], int(parts[2])))
    else:
        fleet.append(Ship(int(parts[1]), parts[0]))

ordered = sorted(fleet, key=lambda s: (s.speed, s.name))
for ship in ordered:
    print(ship.describe())
print(f"Fastest: {ordered[-1].name}")
print(f"Cargo: {sum(s.tons for s in fleet if isinstance(s, CargoShip))}")
