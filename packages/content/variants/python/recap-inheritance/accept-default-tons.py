from dataclasses import dataclass


@dataclass(order=True)
class Ship:
    speed: int
    name: str

    def describe(self):
        return self.name + " (" + str(self.speed) + ")"


@dataclass(order=True)
class CargoShip(Ship):
    tons: int = 0

    def describe(self):
        return super().describe() + ", tons " + str(self.tons)


ships = ["Hope 12", "Mule 8 300", "Swift 30", "Ox 8 500"]
fleet = []
for text in ships:
    name, speed, *rest = text.split()
    if rest:
        fleet.append(CargoShip(int(speed), name, int(rest[0])))
    else:
        fleet.append(Ship(int(speed), name))
fleet.sort(key=lambda s: (s.speed, s.name))
for s in fleet:
    print(s.describe())
print("Fastest:", fleet[-1].name)
total = 0
for s in fleet:
    if isinstance(s, CargoShip):
        total += s.tons
print("Cargo:", total)
