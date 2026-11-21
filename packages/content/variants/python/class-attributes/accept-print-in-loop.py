class Ship:
    next_number = 1
    fleet = "Free Fleet"

    def __init__(self, name):
        self.number = Ship.next_number
        self.name = name
        Ship.next_number = Ship.next_number + 1

    def __str__(self):
        return f"#{self.number} {self.name} of {self.fleet}"


names = ["Hope", "Swift"]
fleet = "Star Fleet"
made = [Ship(n) for n in names]
Ship.fleet = fleet
for s in made:
    print(s)
print(f"Next free number: {Ship.next_number}")
