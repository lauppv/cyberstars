class Ship:
    next_number = 1
    fleet = "Free Fleet"

    def __init__(self, name):
        self.name = name
        self.number = self.next_number
        self.next_number += 1


names = ["Hope", "Swift"]
fleet = "Star Fleet"
ships = [Ship(n) for n in names]
Ship.fleet = fleet
for s in ships:
    print(f"#{s.number} {s.name} of {s.fleet}")
print(f"Next free number: {Ship.next_number}")
