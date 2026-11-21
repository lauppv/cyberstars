counter = 1


class Ship:
    def __init__(self, name):
        global counter
        self.name = name
        self.number = counter
        counter += 1


names = ["Hope", "Swift"]
fleet = "Star Fleet"
ships = [Ship(n) for n in names]
for s in ships:
    print(f"#{s.number} {s.name} of {fleet}")
print(f"Next free number: {counter}")
