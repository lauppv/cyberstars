class Ship:
    next_number = 1
    fleet = "Star Fleet"

    def __init__(self, name):
        self.name = name
        self.number = Ship.next_number
        Ship.next_number += 1


names = ["Hope", "Swift"]

ships = [Ship(name) for name in names]
for ship in ships:
    print(f"#{ship.number} {ship.name} of {ship.fleet}")
print(f"Next free number: {Ship.next_number}")
