class Ship:
    next_number = 1
    fleet = "Free Fleet"

    def __init__(self, name):
        self.name = name
        self.number = type(self).next_number
        type(self).next_number = self.number + 1


names = ["Hope", "Swift"]
fleet = "Star Fleet"
fleet_ships = []
for n in names:
    fleet_ships.append(Ship(n))
Ship.fleet = fleet
for s in fleet_ships:
    print("#" + str(s.number) + " " + s.name + " of " + s.fleet)
print("Next free number:", Ship.next_number)
