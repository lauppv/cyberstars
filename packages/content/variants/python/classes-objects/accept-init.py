class Ship:
    def __init__(self, name, speed):
        self.name = name
        self.speed = speed


names = ["Hope", "Swift", "Bob"]
speeds = [12, 30, 5]
fleet = [Ship(n, s) for n, s in zip(names, speeds)]
for s in fleet:
    print(s.name + ": " + str(s.speed))
best = max(fleet, key=lambda s: s.speed)
print("Fastest: " + best.name)
