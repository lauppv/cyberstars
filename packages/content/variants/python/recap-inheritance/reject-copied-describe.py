from dataclasses import dataclass


@dataclass(order=True)
class Ship:
    speed: int
    name: str

    def describe(self):
        return f"{self.name} ({self.speed})"


@dataclass(order=True)
class CargoShip(Ship):
    tons: int

    def describe(self):
        return f"{self.name} ({self.speed}), tons {self.tons}"


ships = ["Hope 12", "Mule 8 300", "Swift 30", "Ox 8 500"]
fleet = []
for t in ships:
    p = t.split()
    fleet.append(CargoShip(int(p[1]), p[0], int(p[2])) if len(p) == 3 else Ship(int(p[1]), p[0]))
fleet.sort(key=lambda s: (s.speed, s.name))
for s in fleet:
    print(s.describe())
print(f"Fastest: {fleet[-1].name}")
print(f"Cargo: {sum(s.tons for s in fleet if isinstance(s, CargoShip))}")
